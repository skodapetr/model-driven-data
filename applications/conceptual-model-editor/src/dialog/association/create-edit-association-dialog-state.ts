import { VisualModel } from "@dataspecer/core-v2/visual-model";
import { ClassesContextType } from "../../context/classes-context";
import { ModelGraphContextType } from "../../context/model-context";
import { asInMemoryModel, findRepresentative, InvalidEntity, isRepresentingAttribute, prepareModels, representCardinalities, representCardinality, representClasses, representModel, representOwlThing, representRelationships, representSpecializations, representUndefinedCardinality, sortRepresentatives } from "../utilities/dialog-utilities";
import { sanitizeDuplicitiesInRepresentativeLabels } from "../../utilities/label";
import { getModelIri, isIriAbsolute } from "../../util/iri-utils";
import { getDomainAndRange } from "../../util/relationship-utils";
import { SemanticModelRelationship } from "@dataspecer/core-v2/semantic-model/concepts";
import { InMemorySemanticModel } from "@dataspecer/core-v2/semantic-model/in-memory";
import { EditAssociationDialogState } from "./edit-association-dialog-controller";
import { createLogger } from "../../application";

const LOG = createLogger(import.meta.url);

/**
 * Create and return state for edit of entity with given identifier.
 *
 * @param classesContext
 * @param graphContext
 * @param visualModel
 * @param language
 * @param semanticModel Model containing the association.
 * @param entity Raw entity to edit.
 * @returns
 */
export function createEditAssociationDialogState(
  classesContext: ClassesContextType,
  graphContext: ModelGraphContextType,
  visualModel: VisualModel | null,
  language: string,
  semanticModel: InMemorySemanticModel,
  entity: SemanticModelRelationship,
): EditAssociationDialogState {

  const { domain, range } = getDomainAndRange(entity);
  if (range === null) {
    LOG.invalidEntity(entity.id, "Range is null!");
    throw new InvalidEntity(entity);
  }

  const models = prepareModels(graphContext, visualModel);
  const model = representModel(visualModel, semanticModel);

  const availableClasses = sanitizeDuplicitiesInRepresentativeLabels(
    models.all, representClasses(models.raw, classesContext.classes));
  sortRepresentatives(language, availableClasses);

  const availableSpecializations = sanitizeDuplicitiesInRepresentativeLabels(
    models.all, representRelationships(models.raw, classesContext.relationships))
    .filter(item => !isRepresentingAttribute(item))
    .filter(item => item.identifier !== entity.id);
  sortRepresentatives(language, availableClasses);

  const specializations = representSpecializations(
    entity.id, classesContext.generalizations);

  const owlThing = representOwlThing();

  return {
    language,
    availableModels: models.all,
    writableModels: models.writable,
    model: asInMemoryModel(model),
    iri: range.iri ?? "",
    iriPrefix: getModelIri(model.model),
    isIriAutogenerated: false,
    isIriRelative: !isIriAbsolute(range.iri),
    name: range.name,
    description: range.description,
    availableSpecializations,
    specializations,
    domain: findRepresentative(availableClasses, domain?.concept) ?? owlThing,
    domainCardinality: representCardinality(domain?.cardinality),
    availableDomainItems: [owlThing, ...availableClasses],
    range: findRepresentative(availableClasses, range?.concept) ?? owlThing,
    rangeCardinality: representCardinality(range?.cardinality),
    availableRangeItems: [owlThing, ...availableClasses],
    availableCardinalities: [representUndefinedCardinality(), ...representCardinalities()],
  };
}
