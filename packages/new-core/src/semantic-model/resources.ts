import {Resource} from "../model/resource";
import {NamedThing} from "./helper";

/**
 * Represent classes, enumerations and simple data types.
 */
export interface SemanticModelClass extends NamedThing, Resource {
    type: [typeof SEMANTIC_MODEL_CLASS];

    // todo: is it class, enumeration, datatype, code list, ...
}

export const SEMANTIC_MODEL_CLASS = "class"; // todo use proper IRI

export function isSemanticModelClass(resource: Resource | null): resource is SemanticModelClass {
    return resource?.type.includes(SEMANTIC_MODEL_CLASS) ?? false;
}

/**
 * Represents attributes and associations.
 */
export interface SemanticModelRelationship extends NamedThing, Resource {
    type: [typeof SEMANTIC_MODEL_RELATIONSHIP];

    ends: SemanticModelRelationshipEnd[]

    // todo: is it attribute or association
}

export interface SemanticModelRelationshipEnd extends NamedThing {
    cardinality?: [number, number|null];

    /** {@link SemanticModelClass} */
    concept: string;
}

export const SEMANTIC_MODEL_RELATIONSHIP = "relationship"; // todo use proper IRI

export function isSemanticModelRelationship(resource: Resource | null): resource is SemanticModelRelationship {
    return resource?.type.includes(SEMANTIC_MODEL_RELATIONSHIP) ?? false;
}

/**
 * Inheritance hierarchy.
 */
export interface SemanticModelGeneralization extends Resource {
    type: [typeof SEMANTIC_MODEL_GENERALIZATION]

    /** {@link SemanticModelClass} */
    child: string;

    /** {@link SemanticModelClass} */
    parent: string;
}

export const SEMANTIC_MODEL_GENERALIZATION = "generalization"; // todo use proper IRI

export function isSemanticModelGeneralization(resource: Resource | null): resource is SemanticModelGeneralization {
    return resource?.type.includes(SEMANTIC_MODEL_GENERALIZATION) ?? false;
}