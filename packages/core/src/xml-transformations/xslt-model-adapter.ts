import {
  StructureModelClass,
  StructureModelPrimitiveType,
  StructureModelProperty,
  StructureModel,
  StructureModelType,
  StructureModelComplexType,
} from "../structure-model";
import {
  XmlTransformation,
  XmlTemplate,
  XmlRootTemplate,
  XmlMatch,
  XmlClassMatch,
  XmlLiteralMatch,
  XmlTransformationInclude,
  XmlCodelistMatch,
} from "./xslt-model";

import {
  DataSpecification,
  DataSpecificationArtefact,
  DataSpecificationSchema,
} from "../data-specification/model";

import { OFN, XSD } from "../well-known";
import { XSLT_LIFTING, XSLT_LOWERING } from "./xslt-vocabulary";
import { namespaceFromIri, QName, simpleTypeMapIri } from "../xml/xml-conventions";
import { pathRelative } from "../core/utilities/path-relative";

export function structureModelToXslt(
  specifications: { [iri: string]: DataSpecification },
  specification: DataSpecification,
  artifact: DataSpecificationSchema,
  model: StructureModel
): XmlTransformation {
  const adapter = new XsltAdapter(
    specifications, specification, artifact, model
  );
  return adapter.fromRoots(model.roots);
}

type ClassMap = Record<string, StructureModelClass>;
class XsltAdapter {
  private classMap: ClassMap;
  private specifications: { [iri: string]: DataSpecification };
  private specification: DataSpecification;
  private artifact: DataSpecificationSchema;
  private model: StructureModel;
  private namespacePrefix: string;
  private rdfNamespaces: Record<string, string>;
  private rdfNamespacesIris: Record<string, string>;
  private rdfNamespaceCounter: number;
  private includes: { [specification: string]: XmlTransformationInclude };

  constructor(
    specifications: { [iri: string]: DataSpecification },
    specification: DataSpecification,
    artifact: DataSpecificationSchema,
    model: StructureModel
  ) {
    this.specifications = specifications;
    this.specification = specification;
    this.artifact = artifact;
    this.model = model;
    const map: ClassMap = {};
    for (const classData of Object.values(model.classes)) {
      map[classData.psmIri] = classData;
    }
    this.classMap = map;
    this.rdfNamespaces = {};
    this.rdfNamespacesIris = {};
    this.rdfNamespaceCounter = 0;
    this.includes = {};
  }

  public fromRoots(roots: string[]): XmlTransformation {
    return {
      targetNamespace: null,
      targetNamespacePrefix: null,
      rdfNamespaces: this.rdfNamespaces,
      rootTemplates: roots.map(this.rootToTemplate, this),
      templates: Object.keys(this.classMap).map(this.classToTemplate, this)
        .filter(template => template != null),
      includes: Object.values(this.includes),
    };
  }

  findArtefactsForImport(
    classData: StructureModelClass
  ): DataSpecificationArtefact[] {
    const targetSpecification = this.specifications[classData.specification];
    if (targetSpecification == null) {
      throw new Error(`Missing specification ${classData.specification}`);
    }
    return targetSpecification.artefacts.filter(candidate => {
      if (
        candidate.generator !== XSLT_LIFTING.Generator &&
        candidate.generator !== XSLT_LOWERING.Generator
      ) {
        return false;
      }
      const candidateSchema = candidate as DataSpecificationSchema;
      if (classData.structureSchema !== candidateSchema.psm) {
        return false;
      }
      // TODO We should check that the class is root here.
      return true;
    });
  }

  currentPath(generator: string): string {
    return this.artifact.publicUrl;
  }

  resolveImportedElement(
    classData: StructureModelClass
  ): boolean {
    if (this.model.psmIri !== classData.structureSchema) {
      const importDeclaration = this.includes[classData.specification];
      if (importDeclaration == null) {
        const artifacts = this.findArtefactsForImport(classData);
        this.includes[classData.specification] = {
          locations: Object.fromEntries(
            artifacts.map(
              artifact => {
                return [
                  artifact.generator, pathRelative(
                    this.currentPath(artifact.generator),
                  artifact.publicUrl)
                ]
              }
            )
          )
        };
      }
      return true;
    }
    return false;
  }

  getClass(iri: string): StructureModelClass {
    const cls = this.classMap[iri];
    if (cls == null) {
      throw new Error(`Class ${iri} is not defined in the model.`);
    }
    return cls;
  }

  classTemplateName(classData: StructureModelClass) {
    return "_" + classData.psmIri.replace(
      /[^-.\p{L}\p{N}]/gu,
      s => "_" + s.charCodeAt(0).toString(16).padStart(4, "0")
    );
  }

  rootToTemplate(rootIri: string): XmlRootTemplate {
    const classData = this.classMap[rootIri];
    return {
      typeIri: classData.cimIri,
      elementName: [this.namespacePrefix, classData.technicalLabel],
      targetTemplate: this.classTemplateName(classData),
    };
  }

  classToTemplate(classIri: string): XmlTemplate | null {
    const classData = this.classMap[classIri];
    if (classData.isCodelist) {
      return null;
    }
    if (this.resolveImportedElement(classData)) {
      return {
        name: this.classTemplateName(classData),
        classIri: classData.cimIri,
        propertyMatches: [],
        imported: true,
      };
    }
    return {
      name: this.classTemplateName(classData),
      classIri: classData.cimIri,
      propertyMatches: classData.properties.map(this.propertyToMatch, this),
      imported: false,
    }
  }

  propertyToMatch(
    propertyData: StructureModelProperty
  ): XmlMatch {
    let dataTypes = propertyData.dataTypes;
    if (dataTypes.length === 0) {
      throw new Error(
        `Property ${propertyData.psmIri} has no specified types.`
      );
    }
    if (dataTypes.length > 1) {
      throw new Error(
        `Multiple datatypes on a property ${propertyData.psmIri} are ` +
        "not supported."
      );
    }
    // Enforce the same type (class or datatype)
    // for all types in the property range.
    const result =
      this.propertyToMatchCheckType(
        propertyData,
        dataTypes,
        (type) => type.isAssociation() &&
          this.getClass(type.psmClassIri).isCodelist,
        this.classPropertyToCodelistMatch
      ) ??
      this.propertyToMatchCheckType(
        propertyData,
        dataTypes,
        (type) => type.isAssociation(),
        this.classPropertyToClassMatch
      ) ??
      this.propertyToMatchCheckType(
        propertyData,
        dataTypes,
        (type) => type.isAttribute(),
        this.datatypePropertyToLiteralMatch
      );
    if (result == null) {
      throw new Error(
        `Property ${propertyData.psmIri} must use either only ` +
          "class types or only primitive types."
      );
    }
    return result;
  }

  iriToQName(iri: string): QName {
    const parts = namespaceFromIri(iri);
    if (parts == null) {
      throw new Error(
        `Cannot extract namespace from property ${iri}.`
      );
    }
    const [namespaceIri, localName] = parts;
    if (this.rdfNamespacesIris[namespaceIri] != null) {
      return [this.rdfNamespacesIris[namespaceIri], localName];
    }
    const ns = "ns" + (this.rdfNamespaceCounter++);
    this.rdfNamespaces[ns] = namespaceIri;
    this.rdfNamespacesIris[namespaceIri] = ns;
    return [ns, localName];
  }

  propertyToMatchCheckType(
    propertyData: StructureModelProperty,
    dataTypes: StructureModelType[],
    rangeChecker: (rangeType: StructureModelType) => boolean,
    typeConstructor: (
        propertyData: StructureModelProperty,
        interpretation: QName,
        propertyName: QName,
        dataTypes: StructureModelType[]
      ) => XmlMatch
  ): XmlMatch | null {
    if (dataTypes.every(rangeChecker)) {
      if (propertyData.cimIri == null) {
        throw new Error(
          `Property ${propertyData.psmIri} has no interpretation!`
        );
      }
      const interpretation = this.iriToQName(propertyData.cimIri);
      const propertyName = [this.namespacePrefix, propertyData.technicalLabel];
      return typeConstructor.call(
        this, propertyData, interpretation, propertyName, dataTypes
      );
    }
    return null;
  }

  classPropertyToClassMatch(
    propertyData: StructureModelProperty,
    interpretation: QName,
    propertyName: QName,
    dataTypes: StructureModelComplexType[]
  ): XmlClassMatch {
    return {
      interpretation: interpretation,
      propertyIri: propertyData.cimIri,
      propertyName: propertyName,
      isDematerialized: propertyData.dematerialize,
      targetTemplate: this.classTemplateName(
        this.getClass(dataTypes[0].psmClassIri)
      ),
    };
  }

  datatypePropertyToLiteralMatch(
    propertyData: StructureModelProperty,
    interpretation: QName,
    propertyName: QName,
    dataTypes: StructureModelPrimitiveType[]
  ): XmlLiteralMatch {
    return {
      interpretation: interpretation,
      propertyIri: propertyData.cimIri,
      propertyName: propertyName,
      dataTypeIri: this.primitiveToIri(dataTypes[0])
    };
  }

  classPropertyToCodelistMatch(
    propertyData: StructureModelProperty,
    interpretation: QName,
    propertyName: QName,
    dataTypes: StructureModelComplexType[]
  ): XmlCodelistMatch {
    return {
      interpretation: interpretation,
      propertyIri: propertyData.cimIri,
      propertyName: propertyName,
      isCodelist: true,
    };
  }

  primitiveToIri(primitiveData: StructureModelPrimitiveType): string {
    if (primitiveData.dataType == null || primitiveData.dataType == OFN.text) {
      return null;
    }
    return simpleTypeMapIri[primitiveData.dataType] ?? primitiveData.dataType;
  }
}
