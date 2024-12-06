import { isWritableVisualModel, VisualModel } from "@dataspecer/core-v2/visual-model";
import { ClassesContextType } from "../context/classes-context";
import { ModelGraphContextType } from "../context/model-context";
import { createCreateProfileClassDialogState } from "../dialog/class-profile/create-class-profile-dialog-controller";
import { UseNotificationServiceWriterType } from "../notification/notification-service-context";
import { Options } from "../application";
import { isSemanticModelClass, isSemanticModelGeneralization, isSemanticModelRelationship } from "@dataspecer/core-v2/semantic-model/concepts";
import { isSemanticModelClassUsage, isSemanticModelRelationshipUsage, SemanticModelRelationshipEndUsage } from "@dataspecer/core-v2/semantic-model/usage/concepts";
import { createClassProfile } from "./open-create-profile-dialog";
import { findSourceModelOfEntity } from "../service/model-service";
import { InMemorySemanticModel } from "@dataspecer/core-v2/semantic-model/in-memory";
import { createRelationshipUsage } from "@dataspecer/core-v2/semantic-model/usage/operations";
import { addSemanticClassProfileToVisualModelAction } from "./add-class-profile-to-visual-model";
import { UseDiagramType } from "../diagram/diagram-hook";
import { addSemanticRelationshipProfileToVisualModelAction } from "./add-relationship-profile-to-visual-model";


export const profileSelectionAction = (
  notifications: UseNotificationServiceWriterType,
  graph: ModelGraphContextType,
  diagram: UseDiagramType,
  options: Options,
  classesContext: ClassesContextType,
  visualModel: VisualModel | null,
  nodeSelection: string[],
  edgeSelection: string[]
): void => {
  const createdClassesAndClassesProfiles: Record<string, string> = {};
  for(const selectedEntityId of nodeSelection) {
    const classOrClassProfileToBeProfiled = graph.aggregatorView.getEntities()?.[selectedEntityId]?.aggregatedEntity;
    if(classOrClassProfileToBeProfiled === undefined) {
      notifications.error("The entity (node) to be profiled from selection is not present in aggregatorView");
      return;
    }
    const isTheProfiledClassClassProfile = isSemanticModelClassUsage(classOrClassProfileToBeProfiled);
    if(!isSemanticModelClass(classOrClassProfileToBeProfiled) && !isTheProfiledClassClassProfile) {
      notifications.error("The entity to be profiled from selection is not a class or class profile");
      return;
    }

    const profileClassState = createCreateProfileClassDialogState(
      classesContext,
      graph,
      visualModel,
      options.language,
      classOrClassProfileToBeProfiled,
    );
    const createdClassProfile = createClassProfile(profileClassState);
    if(createdClassProfile === null) {
      continue;
    }

    createdClassesAndClassesProfiles[selectedEntityId] = createdClassProfile.identifier;

    if(isWritableVisualModel(visualModel)) {
      addSemanticClassProfileToVisualModelAction(notifications, graph, visualModel, diagram, createdClassProfile.identifier, createdClassProfile.model.getId(), null);
    }
  }

  for(const selectedEntityId of edgeSelection) {
    const associationOrAssociationProfileToBeProfiled = graph.aggregatorView.getEntities()?.[selectedEntityId]?.aggregatedEntity;
    if(associationOrAssociationProfileToBeProfiled === undefined || associationOrAssociationProfileToBeProfiled === null) {
      notifications.error("The entity (edge) to be profiled from selection is not present in aggregatorView");
      continue;
    }
    if(isSemanticModelClassUsage(associationOrAssociationProfileToBeProfiled)) {    // The visual edge representing class profile
      continue;
    }
    if(isSemanticModelGeneralization(associationOrAssociationProfileToBeProfiled)) {
      continue;
    }
    if(!isSemanticModelRelationship(associationOrAssociationProfileToBeProfiled) && !isSemanticModelRelationshipUsage(associationOrAssociationProfileToBeProfiled)) {
      notifications.error("The entity to be profiled from selection is not a association or association profile");
      continue;
    }

    const model = findSourceModelOfEntity(associationOrAssociationProfileToBeProfiled.id, graph.models);
    if (model === null) {
      notifications.error(`Can not find model for '${associationOrAssociationProfileToBeProfiled.id}'.`);
      continue;
    }
    if (!(model instanceof InMemorySemanticModel)) {
      notifications.error(`Model for '${associationOrAssociationProfileToBeProfiled.id} is not semantic'.`);
      continue;
    }


    const ends: SemanticModelRelationshipEndUsage[] | undefined = [];
    for (const end of associationOrAssociationProfileToBeProfiled.ends) {
      if(end.concept === null) {
        continue;
      }

      const newEnd: SemanticModelRelationshipEndUsage = {
        ...end,
        concept: createdClassesAndClassesProfiles[end.concept] ?? end.concept,
        usageNote: (end as SemanticModelRelationshipEndUsage)?.usageNote ?? null,
        cardinality: end.cardinality ?? null,
      };

      ends.push(newEnd);
    }

    let usageNote = null;
    if(isSemanticModelRelationshipUsage(associationOrAssociationProfileToBeProfiled)) {
      usageNote = associationOrAssociationProfileToBeProfiled.usageNote;
    }

    const { success, id: identifier } = model.executeOperation(createRelationshipUsage({
      usageOf: associationOrAssociationProfileToBeProfiled.id,
      usageNote: usageNote,
      ends: ends,
    }));

    if (!(identifier !== undefined && success)) {
      notifications.error("The operation of creating association profiled failed on semantic level");
      continue;
    }

    if(isWritableVisualModel(visualModel)) {
      addSemanticRelationshipProfileToVisualModelAction(notifications, graph, visualModel, identifier, model.getId());
    }
  }
};
