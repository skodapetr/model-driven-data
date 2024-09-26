import {StructureModelClass, StructureModelComplexType, StructureModelPrimitiveType, StructureModelProperty, StructureModelSchemaRoot, StructureModelType,} from "@dataspecer/core/structure-model/model";

import {XmlStructureModel as StructureModel} from "../xml-structure-model/model/xml-structure-model";

import {XmlSchema, XmlSchemaAnnotation, XmlSchemaComplexContainer, XmlSchemaComplexContent, XmlSchemaComplexContentElement, XmlSchemaComplexContentItem, XmlSchemaComplexGroup, XmlSchemaComplexItem, XmlSchemaComplexSequence, XmlSchemaComplexType, XmlSchemaElement, XmlSchemaGroupDefinition, XmlSchemaImportDeclaration, XmlSchemaSimpleType, XmlSchemaType, xmlSchemaTypeIsComplex,} from "./xml-schema-model";

import {DataSpecification, DataSpecificationArtefact, DataSpecificationSchema,} from "@dataspecer/core/data-specification/model";

import {XSD, XSD_PREFIX} from "@dataspecer/core/well-known";
import {XML_SCHEMA} from "./xml-schema-vocabulary";

import {commonXmlNamespace, commonXmlPrefix, iriElementName, langStringName, QName, simpleTypeMapQName} from "../conventions";
import {pathRelative} from "@dataspecer/core/core/utilities/path-relative";
import {structureModelAddXmlProperties} from "../xml-structure-model/add-xml-properties";
import {ArtefactGeneratorContext} from "@dataspecer/core/generator";
import {DefaultXmlConfiguration, ExtractOptions, XmlConfiguration, XmlConfigurator} from "../configuration";
import { XML_COMMON_SCHEMA_GENERATOR } from "../xml-common-schema/index";
import { DataSpecificationConfiguration, DataSpecificationConfigurator, DefaultDataSpecificationConfiguration } from "@dataspecer/core/data-specification/configuration";
import { structureModelAddDefaultValues } from "@dataspecer/core/structure-model/transformation/add-default-values";

/**
 * Converts a {@link StructureModel} to an {@link XmlSchema}.
 */
export function structureModelToXmlSchema(
  context: ArtefactGeneratorContext,
  specification: DataSpecification,
  artifact: DataSpecificationSchema,
  model: StructureModel
): XmlSchema {
  const options = XmlConfigurator.merge(DefaultXmlConfiguration, XmlConfigurator.getFromObject(artifact.configuration)) as XmlConfiguration;

  // Adds default values regarding the instancesHaveIdentity
  const globalConfiguration = DataSpecificationConfigurator.merge(
    DefaultDataSpecificationConfiguration,
    DataSpecificationConfigurator.getFromObject(artifact.configuration)
  ) as DataSpecificationConfiguration;
  model = structureModelAddDefaultValues(model, globalConfiguration) as StructureModel;

  // Find common XML artifact
  const commonXmlArtefact = specification.artefacts.find(a => a.generator === XML_COMMON_SCHEMA_GENERATOR);
  if (!commonXmlArtefact) {
    throw new Error("XML generator requires common xml schema artifact");
  }
  const commonXmlSchemaLocation = pathRelative(artifact.publicUrl, commonXmlArtefact.publicUrl);

  const adapter = new XmlSchemaAdapter(
    context, specification, artifact, model, options, commonXmlSchemaLocation
  );
  return adapter.fromRoots(model.roots);
}

/**
 * This type shall be used inside a codelist type in a property.
 */
const anyUriType: StructureModelPrimitiveType = (function () {
  const type = new StructureModelPrimitiveType();
  type.dataType = XSD.anyURI;
  return type;
})();

/**
 * The &lt;iri&gt; property defined at the beginning of every element.
 */
const iriProperty: XmlSchemaComplexContentElement = {
  cardinalityMin: 0,
  cardinalityMax: 1,
  element: {
    elementName: iriElementName,
    annotation: null,
    type: null
  }
};

/**
 * This class contains functions to process all parts of a {@link StructureModel}
 * and create an instance of {@link XmlSchema}.
 */
class XmlSchemaAdapter {
  private usesLangString: boolean;
  private context: ArtefactGeneratorContext;
  private specifications: { [iri: string]: DataSpecification };
  private artifact: DataSpecificationSchema;
  private model: StructureModel;
  private options: XmlConfiguration;
  private commonXmlSchemaLocation: string;

  /**
   * Creates a new instance of the adapter, for a particular structure model.
   * @param context The context of generation, used to access other models.
   * @param specification The specification containing the structure model.
   * @param artifact The artifact describing the output of the generator.
   * @param model The structure model.
   * @param options Additional options to the generator.
   */
  constructor(
    context: ArtefactGeneratorContext,
    specification: DataSpecification,
    artifact: DataSpecificationSchema,
    model: StructureModel,
    options: XmlConfiguration,
    commonXmlSchemaLocation: string,
  ) {
    this.context = context;
    this.specifications = context.specifications;
    this.artifact = artifact;
    this.model = model;
    this.options = options;
    this.commonXmlSchemaLocation = commonXmlSchemaLocation;
  }

  private imports: { [specification: string]: XmlSchemaImportDeclaration };
  private groups: Record<string, XmlSchemaGroupDefinition>;
  private types: Record<string, XmlSchemaType>;

  /**
   * Whether during the generation of the schema, the common XML schema was used and hence it needs to be imported.
   */
  private wasCommonXmlImportUsed: boolean = false;

  /**
   * Produces an XML Schema model from a list of root classes.
   * @param roots A list of roots to specify the desired root elements.
   * @returns An instance of {@link XmlSchema} with the specific root elements.
   */
  public fromRoots(roots: StructureModelSchemaRoot[]): XmlSchema {
    this.imports = {};
    this.groups = {};
    this.types = {};
    this.wasCommonXmlImportUsed = false;
    const elements = roots
      .map(this.rootToElement, this)
      .map(this.extractTypeFromRoot, this);
    if (this.wasCommonXmlImportUsed) {
      this.imports[commonXmlNamespace] = {
        namespace: Promise.resolve(commonXmlNamespace),
        prefix: Promise.resolve(commonXmlPrefix),
        schemaLocation: this.commonXmlSchemaLocation,
      };
    }
    return {
      targetNamespace: this.model.namespace,
      targetNamespacePrefix: this.model.namespacePrefix,
      elements: elements,
      defineLangString: this.usesLangString,
      imports: Object.values(this.imports),
      groups: Object.values(this.groups),
      types: Object.values(this.types),
      commonXmlSchemaLocation: this.commonXmlSchemaLocation,
    };
  }

  /**
   * If allowed, registers the type of the root element and uses it by name.
   */
  extractTypeFromRoot(
    element: XmlSchemaElement
  ): XmlSchemaElement {
    if (this.options.rootClass.extractType) {
      const typeName = element.elementName[1];
      const type = element.type;
      type.name = [null, typeName];
      this.types[typeName] = type;

      return {
        elementName: element.elementName,
        type: {
          name: [this.model.namespacePrefix, typeName],
          annotation: null
        },
        annotation: element.annotation,
      };
    }
    return element;
  }

  findArtefactForImport(
    classData: StructureModelClass
  ): DataSpecificationArtefact | null {
    const targetSpecification = this.specifications[classData.specification];
    if (targetSpecification == null) {
      throw new Error(`Missing specification ${classData.specification}`);
    }
    for (const candidate of targetSpecification.artefacts) {
      if (candidate.generator !== XML_SCHEMA.Generator) {
        continue;
      }
      const candidateSchema = candidate as DataSpecificationSchema;
      if (classData.structureSchema !== candidateSchema.psm) {
        continue;
      }
      // TODO We should check that the class is root here.
      return candidate;
    }
    return null;
  }

  /**
   * Returns true if a class is from a different schema.
   */
  classIsImported(
    classData: StructureModelClass
  ): boolean {
    return this.model.psmIri !== classData.structureSchema || classData.isReferenced;
  }

  /**
   * Returns the path of the current artifact.
   */
  currentPath(): string {
    return this.artifact.publicUrl;
  }

  /**
   * Returns the {@link QName} of a class, potentially asynchronously if the
   * class is imported from a different schema, in order to load the prefix.
   */
  resolveImportedClassName(
    classData: StructureModelClass
  ): QName | Promise<QName> {
    if (this.classIsImported(classData)) {
      const importDeclaration = this.imports[classData.specification];
      if (importDeclaration != null) {
        // Already imported; construct it using the prefix.
        return this.getQName(importDeclaration.prefix, classData.technicalLabel);
      }
      const artefact = this.findArtefactForImport(classData);
      if (artefact != null) {
        const model = this.getImportedModel(classData.structureSchema);
        // Register the import of the schema.
        const imported = this.imports[classData.specification] = {
          namespace: this.getModelNamespace(model),
          prefix: this.getModelPrefix(model),
          schemaLocation: pathRelative(this.currentPath(), artefact.publicUrl),
        };
        return this.getQName(imported.prefix, classData.technicalLabel);
      }
    }
    return [null, classData.technicalLabel];
  }

  resolveImportedOrName(
    property: StructureModelProperty
  ): QName | Promise<QName> {
    const allClassesAreImported = property.dataTypes.every(dt => dt.isAssociation() && dt.dataType.isReferenced);
    if (allClassesAreImported) {
      const firstClass = (property.dataTypes[0] as StructureModelComplexType).dataType;

      const importDeclaration = this.imports[firstClass.specification];
      if (importDeclaration != null) {
        // Already imported; construct it using the prefix.
        return this.getQName(importDeclaration.prefix, property.orTechnicalLabel);
      }
      const artefact = this.findArtefactForImport(firstClass);
      if (artefact != null) {
        const model = this.getImportedModel(firstClass.structureSchema);
        // Register the import of the schema.
        const imported = this.imports[firstClass.specification] = {
          namespace: this.getModelNamespace(model),
          prefix: this.getModelPrefix(model),
          schemaLocation: pathRelative(this.currentPath(), artefact.publicUrl),
        };
        return this.getQName(imported.prefix, property.orTechnicalLabel);
      }
    }
    return [null, property.orTechnicalLabel];
  }

  /**
   * Helper function to construct a {@link QName} from an asynchronously
   * obtained prefix.
   */
  async getQName(
    prefix: Promise<string>,
    name: string
  ): Promise<QName> {
    return [await prefix, name];
  }

  /**
   * Helper function to obtain the namespace IRI of an asynchronously
   * obtained structure model.
   */
  async getModelNamespace(model: Promise<StructureModel>) {
    return (await model)?.namespace ?? null;
  }

  /**
   * Helper function to obtain the namespace prefix of an asynchronously
   * obtained structure model.
   */
  async getModelPrefix(model: Promise<StructureModel>) {
    return (await model)?.namespacePrefix ?? null;
  }

  /**
   * Returns the structure model from an imported schema.
   */
  async getImportedModel(
    iri: string
  ): Promise<StructureModel> {
    const model = this.context.structureModels[iri];
    if (model != null) {
      return await structureModelAddXmlProperties(
        model, this.context.reader
      );
    }
    return null;
  }

  /**
   * Produces an {@link XmlSchemaAnnotation} from a class or property,
   * storing its interpretation, name, and description.
   */
  getAnnotation(
    data: StructureModelClass | StructureModelProperty
  ): XmlSchemaAnnotation {
    const lines = [];
    if (data.cimIri != null) {
      lines.push(`Význam: ${data.cimIri}`);
    }
    if (data.humanLabel != null) {
      for (const lang of Object.keys(data.humanLabel)) {
        lines.push(`Název (${lang}): ${data.humanLabel[lang]}`);
      }
    }
    if (data.humanDescription != null) {
      for (const lang of Object.keys(data.humanDescription)) {
        lines.push(`Popis (${lang}): ${data.humanDescription[lang]}`);
      }
    }
    return lines.length == 0 ? null : {
      modelReference: data.cimIri,
      documentation: lines.join("\n")
    }
  }

  /**
   * Produces an element description from a structure model class.
   */
  classToElement(classData: StructureModelClass): XmlSchemaElement {
    return {
      elementName: this.resolveImportedClassName(classData),
      type: {
        name: null,
        complexDefinition: this.classToComplexType(
          classData,
          this.options.rootClass
        ),
        annotation: this.getAnnotation(classData),
      } as XmlSchemaComplexType,
      annotation: null,
    };
  }

  rootToElement(root: StructureModelSchemaRoot): XmlSchemaElement {
    const classes = root.classes;

    if (classes.length === 1 && !root.isInOr) {
      return this.classToElement(classes[0]);
    }

    const [el, name] = this.oRToSingleType(classes, true);
    const complexType = {
      name: [this.model.namespacePrefix, root.orTechnicalLabel],
      complexDefinition: el,
      annotation: null,
    } as XmlSchemaComplexType;
    this.types[root.orTechnicalLabel] = complexType;
    return {
      elementName: [null, root.orTechnicalLabel],
      type: complexType,
      annotation: null,
    };
  }

  /**
   * Produces a complex type from a structure model class.
   * @param classData The class from the structure model.
   * @param extractOptions The extraction options for this class.
   * @param skipIri True whether to omit &lt;iri&gt; in the result.
   */
  classToComplexType(
    classData: StructureModelClass,
    extractOptions: ExtractOptions,
    skipIri?: boolean
  ): XmlSchemaComplexItem {
    skipIri ||= classData.instancesHaveIdentity === "NEVER";
    if (this.classIsImported(classData)) {
      // For an imported type, construct a reference to its group.
      const name = this.resolveImportedClassName(classData);
      const groupRef: XmlSchemaComplexGroup = {
        xsType: "group",
        name: name,
      };
      if (skipIri) {
        return groupRef;
      } else {
        return this.getIriSequence(groupRef);
      }
    }
    const contents = classData.properties.map(
      this.propertyToComplexContent, this
    );
    const contentsSequence: XmlSchemaComplexSequence = {
      xsType: "sequence",
      contents: contents,
    };
    if (extractOptions.extractGroup) {
      // If extraction is enabled, define the group and return its reference.
      const groupName = classData.technicalLabel;

      this.groups[groupName] = {
        name: groupName,
        definition: contentsSequence,
      };

      const groupRef: XmlSchemaComplexGroup = {
        xsType: "group",
        name: [this.model.namespacePrefix, groupName],
      };
      if (skipIri) {
        return groupRef;
      } else {
        return this.getIriSequence(groupRef);
      }
    }
    if (!skipIri) {
      contents.splice(0, 0, iriProperty);
      this.wasCommonXmlImportUsed = true;
    }
    return contentsSequence;
  }

  /**
   * Constructs the sequence of {@link iriProperty} and another item.
   */
  getIriSequence(item: XmlSchemaComplexItem): XmlSchemaComplexSequence {
    this.wasCommonXmlImportUsed = true;
    const content: XmlSchemaComplexContentItem = {
      cardinalityMax: 1,
      cardinalityMin: 1,
      item: item
    };
    return {
      xsType: "sequence",
      contents: [
        iriProperty,
        content
      ],
    };
  }

  /**
   * Produces a complex content item from a property.
   */
  propertyToComplexContent(
    propertyData: StructureModelProperty
  ): XmlSchemaComplexContent {
    const elementContent: XmlSchemaComplexContentElement = {
      cardinalityMin: propertyData.cardinalityMin ?? 0,
      cardinalityMax: propertyData.cardinalityMax,
      element: this.propertyToElement(propertyData),
    };
    if (propertyData.dematerialize) {
      const type = elementContent.element.type;
      if (xmlSchemaTypeIsComplex(type)) {
        // A dematerialized property item is its type definition.
        const item: XmlSchemaComplexContentItem = {
          cardinalityMin: elementContent.cardinalityMin,
          cardinalityMax: elementContent.cardinalityMax,
          item: type.complexDefinition,
        };
        return item;
      } else {
        throw new Error(
          `Property ${propertyData.psmIri} must be of a class type ` +
            "if specified as non-materialized."
        );
      }
    }
    return elementContent;
  }

  /**
   * Produces an element definition from a property.
   */
  propertyToElement(propertyData: StructureModelProperty): XmlSchemaElement {
    let dataTypes = propertyData.dataTypes;
    if (dataTypes.length === 0) {
      throw new Error(
        `Property ${propertyData.psmIri} has no specified types.`
      );
    }

    const everyClassIsReferenced = propertyData.dataTypes.every(dt => dt.isAssociation() && dt.dataType.isReferenced);

    if (everyClassIsReferenced && propertyData.orTechnicalLabel) {
      return {
        elementName: [null, propertyData.technicalLabel],
        type: {
          name: this.resolveImportedOrName(propertyData),
        } as XmlSchemaSimpleType,
        annotation: this.getAnnotation(propertyData),
      };
    }

    // Treat codelists as URIs
    dataTypes = dataTypes.map(this.replaceCodelistWithUri, this);
    // Enforce the same type (class or datatype)
    // for all types in the property range.
    const result =
      this.propertyToElementCheckType(
        propertyData,
        dataTypes,
        type => type.isAssociation(),
        this.classPropertyToType
      ) ??
      this.propertyToElementCheckType(
        propertyData,
        dataTypes,
        type => type.isAttribute(),
        this.datatypePropertyToType
      );
    if (result == null) {
      throw new Error(
        `Property ${propertyData.psmIri} must use either only ` +
          "class types or only primitive types."
      );
    }
    return result;
  }

  /**
   * Replaces a codelist datatype with {@link anyUriType}.
   */
  replaceCodelistWithUri(dataType: StructureModelType): StructureModelType {
    if (
      dataType.isAssociation() &&
      dataType.dataType.isCodelist
    ) {
      return anyUriType;
    }
    return dataType;
  }

  /**
   * Calls {@link typeConstructor} if every type in {@link dataTypes}
   * matches {@link rangeChecker}, and constructs an element from the property.
   * @param propertyData The property in the structure model.
   * @param dataTypes The datatypes used by the property.
   * @param rangeChecker The type predicate.
   * @param typeConstructor The function constructing the type.
   * @returns The element with the type created by {@link typeConstructor}.
   */
  propertyToElementCheckType(
    propertyData: StructureModelProperty,
    dataTypes: StructureModelType[],
    rangeChecker: (rangeType: StructureModelType) => boolean,
    typeConstructor: (
      propertyData: StructureModelProperty,
      dataTypes: StructureModelType[]
    ) => XmlSchemaType
  ): XmlSchemaElement | null {
    if (dataTypes.every(rangeChecker)) {
      return {
        elementName: [null, propertyData.technicalLabel],
        type: typeConstructor.call(this, propertyData, dataTypes),
        annotation: this.getAnnotation(propertyData),
      };
    }
    return null;
  }

  /**
   * Creates a complex type from a class property.
   */
  classPropertyToType(
    propertyData: StructureModelProperty,
    dataTypes: StructureModelComplexType[]
  ): XmlSchemaComplexType {
    const [definition, name, abstract] = this.classPropertyToComplexDefinition(
      propertyData, dataTypes
    );
    const dataTypeAnnotation = this.getAnnotation(dataTypes[0].dataType);
    if (name != null) {
      // The type has a name; define it and use its name.
      const complexType: XmlSchemaComplexType = {
        name: [null, name],
        mixed: false,
        abstract: abstract,
        annotation: dataTypeAnnotation,
        complexDefinition: definition
      };
      this.types[name] = complexType;
      return {
        name: [this.model.namespacePrefix, name],
        mixed: false,
        abstract: abstract,
        annotation: dataTypeAnnotation,
        complexDefinition: definition
      };
    }
    return {
      name: null,
      mixed: false,
      abstract: abstract,
      annotation: dataTypeAnnotation,
      complexDefinition: definition
    };
  }

  /**
   * Produces a complex type definition from a class property, and other
   * information for its complex content item.
   */
  classPropertyToComplexDefinition(
    propertyData: StructureModelProperty,
    dataTypes: StructureModelComplexType[]
  ): [definition: XmlSchemaComplexItem, name: string, abstract: boolean] {
    const skipIri: boolean = propertyData.dematerialize;

    const [el, name] = this.oRToSingleType(dataTypes.map(t => t.dataType) , true, skipIri, propertyData.orTechnicalLabel, propertyData.isInOr);

    return [el, name, false];
  }

  /**
   * Converts multiple classes in OR relation to a single type.
   * The second argument specifies whether the or is exclusive or not.
   */
  oRToSingleType(
    classes: StructureModelClass[],
    exclusive: boolean,
    skipIri?: boolean,
    orTechnicalLabel?: string,
    isInOr?: boolean,
  ): [XmlSchemaComplexItem, string | null] {
    if (classes.length === 1 && !isInOr) {
      const typeClass = classes[0];
      const name =
        this.options.otherClasses.extractType ? typeClass.technicalLabel : null;
      const classItem = this.classToComplexType(
        typeClass, this.options.otherClasses, skipIri
      );
      return [classItem, name];
    }

    const everyClassIsReferenced = classes.every(c => c.isReferenced);
    if (everyClassIsReferenced && orTechnicalLabel) {
      return [{
        xsType: "choice",
        contents: [{
          cardinalityMin: 1,
          cardinalityMax: 1,
          element: {
            elementName: [null, orTechnicalLabel],
            annotation: null,
            type: null
          } 
        } as XmlSchemaComplexContent]
      } as XmlSchemaComplexContainer, null];
    }

    const root = {
      xsType: exclusive ? "choice" : "sequence",
      contents: []
    } as XmlSchemaComplexContainer;

    for (const classData of classes) {
      if (!classData.isReferenced) {
        const definition = this.classToComplexType(
          classData, this.options.otherClasses, skipIri
        );
        const complexType: XmlSchemaComplexType = {
          name: [null, classData.technicalLabel],
          mixed: false,
          abstract: false,
          annotation: null,
          complexDefinition: definition
        };

        this.types[classData.technicalLabel] = complexType;
      }
      root.contents.push({
        cardinalityMin: 1,
        cardinalityMax: 1,
        element: {
          elementName: [null, classData.technicalLabel],
          annotation: null,
          type: {
            name: [this.model.namespacePrefix, classData.technicalLabel],
            annotation: null
          }
        }
      } as XmlSchemaComplexContentElement);
    }

    return [root, null];
  }

  // /**
  //  * Select the single class from the list of root classes and create its
  //  * complex item, or construct a new complex item from them all.
  //  * @param roots The array of base root classes.
  //  * @returns A tuple of the single selected class or null, the created
  //  * complex item, and the name of the root type, if newly created.
  //  */
  // pickChoiceRoot(
  //   roots: StructureModelClass[]
  // ): [
  //   rootClass: StructureModelClass | null,
  //   root: XmlSchemaComplexItem,
  //   rootName: string
  // ] {
  //   if (roots.length == 1) {
  //     const classData = roots[0];
  //     return [
  //       classData,
  //       this.classToComplexType(
  //         classData, this.options.otherClasses
  //       ),
  //       classData.technicalLabel
  //     ];
  //   }
  //   const name = "_" + roots.map(cls => cls.technicalLabel).join("_");
  //   return [null, {
  //     xsType: "sequence",
  //     contents: [
  //       iriProperty
  //     ]
  //   } as XmlSchemaComplexSequence, name];
  // }

  /**
   * Creates a simple type from a datatype property.
   */
  datatypePropertyToType(
    propertyData: StructureModelProperty,
    dataTypes: StructureModelPrimitiveType[]
  ): XmlSchemaType {
    if (dataTypes.length === 1 && !propertyData.isInOr) {
      return {
        name: this.primitiveToQName(dataTypes[0]),
        annotation: null, // No annotation for primitive types.
      };
    }
    // Use the union of all the datatypes.
    const simpleType: XmlSchemaSimpleType = {
      name: null,
      annotation: null,
      simpleDefinition: {
        xsType: "union",
        contents: dataTypes.map(this.primitiveToQName, this),
      },
    };
    return simpleType;
  }

  /**
   * Obtains the {@link QName} corresponding to a primitive type.
   */
  primitiveToQName(primitiveData: StructureModelPrimitiveType): QName {
    if (primitiveData.dataType == null) {
      // No type defined.
      return ["xs", "anySimpleType"];
    }
    const type: QName = primitiveData.dataType.startsWith(XSD_PREFIX)
      // Type inside XSD is used.
      ? ["xs", primitiveData.dataType.substring(XSD_PREFIX.length)]
      // An interally mapped type (from OFN) is used, if defined.
      : simpleTypeMapQName[primitiveData.dataType] ?? ["xs", "anySimpleType"];
    if (type === langStringName) {
      // Defined langString if it is used.
      this.usesLangString = true;
      if (type[0] == null) {
        return [this.model.namespacePrefix, type[1]];
      }
    }
    return type;
  }
}
