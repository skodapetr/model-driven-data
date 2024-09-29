import { isWritableVisualModel } from "@dataspecer/core-v2/visual-model";
import type { ModelGraphContextType } from "../context/model-context";
import type { UseNotificationServiceWriterType } from "../notification/notification-service-context";

/**
 * Add resource to the visual model and by doing so to the canvas as well.
 *
 * @param notifications
 * @param graph
 * @param model Owner of the entity to add visual representation for.*
 * @param identifier Identifier of semantic entity to add visual representation for.
 * @param position
 */
export function addNodeToVisualModelAction(
  notifications: UseNotificationServiceWriterType,
  graph: ModelGraphContextType,
  model: string,
  identifier: string,
  position: { x: number, y: number },
) {
  const visualModel = graph.aggregatorView.getActiveVisualModel();
  if (visualModel === null) {
    notifications.error("There is no active visual model.");
    return;
  }
  if (!isWritableVisualModel(visualModel)) {
    notifications.error("Visual model is not writable.");
    return;
  }
  //
  visualModel.addVisualNode({
    model: model,
    representedEntity: identifier,
    position: {
      x: position.x,
      y: position.y,
      anchored: null,
    },
    content: [],
    visualModels: [],
  });
}