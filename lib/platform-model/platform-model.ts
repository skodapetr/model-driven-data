/**
 * We allow only one value for each language.
 */
export type LanguageString = Record<string, string>;

/**
 * Model base class.
 * We do not store order as our items are ordered and order is
 * not actually stored in the resource.
 */
export class ModelResource {

  readonly types: ModelResourceType[] = [];

  readonly id: string;

  readonly rdfTypes: string[];

  constructor(id: string, rdfTypes: string[] = []) {
    this.id = id;
    this.rdfTypes = rdfTypes;
  }

}

export enum ModelResourceType {
  PimSchema = "pim-schema",
  PimClass = "pim-class",
  PimAttribute = "pim-attribute",
  PimAssociation = "pim-association",
  PsmSchema = "psm-schema",
  PsmClass = "psm-class",
  PsmChoice = "psm-choice",
  PsmExtendedBy = "psm-extended-by",
  PsmPart = "psm-part",
  PsmIncludes = "prm-includes",
  CimEntity = "cim-entity",
}

export class PimSchema extends ModelResource {

  // dcterms:title
  pimHumanLabel: LanguageString = {};

  // dcterms:description
  pimHumanDescription: LanguageString = {};

  // dcterms:hasPart
  pimParts: string[] = [];

  static as(resource: ModelResource): PimSchema {
    if (resource.types.includes(ModelResourceType.PimSchema)) {
      return resource as PimSchema;
    }
    resource.types.push(ModelResourceType.PimSchema);
    const result = resource as PimSchema;
    result.pimHumanLabel = result.pimHumanLabel || {};
    result.pimHumanDescription = result.pimHumanDescription || {};
    result.pimParts = result.pimParts || [];
    return result;
  }

}

export class PimBase extends ModelResource {

  // pim:hasInterpretation
  pimInterpretation?: string;

  // pim:technicalLabel
  pimTechnicalLabel?: string;

  // dcterms:title
  pimHumanLabel?: LanguageString;

  // dcterms:description
  pimHumanDescription?: LanguageString;

}

export class PimClass extends PimBase {

  // pim:isa
  pimIsa?: string;

  static as(resource: ModelResource): PimClass {
    if (resource.types.includes(ModelResourceType.PimClass)) {
      return resource as PimSchema;
    }
    resource.types.push(ModelResourceType.PimClass);
    return resource as PimClass;
  }

}

export class PimAttribute extends PimBase {

  /**
   * Owner class.
   */
  pimHasClass?: string;

  // pim:hasDatatype
  pimDatatype?: string;

  static as(resource: ModelResource): PimAttribute {
    if (resource.types.includes(ModelResourceType.PimAttribute)) {
      return resource as PimAttribute;
    }
    resource.types.push(ModelResourceType.PimAttribute);
    return resource as PimAttribute;
  }

}

export class PimAssociation extends PimBase {

  /**
   * Owner class.
   */
  pimHasClass?: string;

  pimEnd: PimAssociationEnd[] = [];

  static as(resource: ModelResource): PimAssociation {
    if (resource.types.includes(ModelResourceType.PimAssociation)) {
      return resource as PimAssociation;
    }
    resource.types.push(ModelResourceType.PimAssociation);
    const result = resource as PimAssociation;
    result.pimEnd = result.pimEnd || [];
    return result;
  }

}

export class PimAssociationEnd {

  // pim:hasParticipant
  pimParticipant?: string;

}

export class PsmSchema extends ModelResource {

  // dcterms:title
  psmHumanLabel?: LanguageString;

  // dcterms:description
  psmHumanDescription?: LanguageString;

  // psm:technicalLabel
  psmTechnicalLabel?: string;

  // psm:hasRoot
  psmRoots: string[] = [];

  /**
   * Allow us to import other schemas.
   */
  // urn:import
  psmImports: string[] = [];

  // urn:jsonLdContext
  psmJsonLdContext: string | undefined;

  // urn:fos
  psmFos: string | undefined;

  // urn:prefix
  psmPrefix: Record<string, string> = {};

  static as(resource: ModelResource): PsmSchema {
    if (resource.types.includes(ModelResourceType.PsmSchema)) {
      return resource as PsmSchema;
    }
    resource.types.push(ModelResourceType.PsmSchema);
    const result = resource as PsmSchema;
    result.psmHumanLabel = result.psmHumanLabel || {};
    result.psmRoots = result.psmRoots || [];
    result.psmPrefix = result.psmPrefix || {};
    return result;
  }

}

export class PsmBase extends ModelResource {

  // psm:hasInterpretation
  psmInterpretation?: string;

  // psm:technicalLabel
  psmTechnicalLabel?: string;

  // dcterms:title
  psmHumanLabel?: LanguageString;

  // dcterms:description
  psmHumanDescription?: LanguageString;

}

export class PsmClass extends PsmBase {

  // psm:extends
  psmExtends: string[] = [];

  // dcterms:hasPart
  psmParts: string[] = [];

  static as(resource: ModelResource): PsmClass {
    if (resource.types.includes(ModelResourceType.PsmClass)) {
      return resource as PsmClass;
    }
    resource.types.push(ModelResourceType.PsmClass);
    const result = resource as PsmClass;
    result.psmExtends = result.psmExtends || [];
    result.psmParts = result.psmParts || [];
    return result;
  }

}

export class PsmChoice extends PsmBase {

  // dcterms:hasPart
  psmParts: string[] = [];

  static as(resource: ModelResource): PsmChoice {
    if (resource.types.includes(ModelResourceType.PsmChoice)) {
      return resource as PsmChoice;
    }
    resource.types.push(ModelResourceType.PsmChoice);
    const result = resource as PsmChoice;
    result.psmParts = result.psmParts || [];
    return result;
  }

}

export class PsmExtendedBy extends PsmBase {

  // dcterms:hasPart
  psmParts: string[] = [];

  static as(resource: ModelResource): PsmExtendedBy {
    if (resource.types.includes(ModelResourceType.PsmExtendedBy)) {
      return resource as PsmExtendedBy;
    }
    resource.types.push(ModelResourceType.PsmExtendedBy);
    const result = resource as PsmChoice;
    result.psmParts = result.psmParts || [];
    return result;
  }

}

/**
 * General part, allow to override values from PsmBase.
 */
export class PsmPart extends PsmBase {

  // dcterms:hasPart
  psmParts: string[] = [];

  static as(resource: ModelResource): PsmPart {
    if (resource.types.includes(ModelResourceType.PsmPart)) {
      return resource as PsmPart;
    }
    resource.types.push(ModelResourceType.PsmPart);
    const result = resource as PsmPart;
    result.psmParts = result.psmParts || [];
    return result;
  }

}

/**
 * Content of given include should be placed instead of this.
 */
export class PsmIncludes extends PsmBase {

  // psm:includes
  psmIncludes?: string;

  static as(resource: ModelResource): PsmIncludes {
    if (resource.types.includes(ModelResourceType.PsmIncludes)) {
      return resource as PsmIncludes;
    }
    resource.types.push(ModelResourceType.PsmIncludes);
    return resource as PsmIncludes;
  }

}

export class CimEntity extends ModelResource {

  cimHumanLabel?: LanguageString;

  cimHumanDescription?: LanguageString;

  cimIsCodelist: boolean;

  static as(resource: ModelResource): CimEntity {
    if (resource.types.includes(ModelResourceType.CimEntity)) {
      return resource as CimEntity;
    }
    resource.types.push(ModelResourceType.CimEntity);
    return resource as CimEntity;
  }

}
