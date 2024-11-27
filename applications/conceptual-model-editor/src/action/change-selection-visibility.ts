import { ModelGraphContextType } from "../context/model-context";
import { UseNotificationServiceWriterType } from "../notification/notification-service-context";
import { useActions } from "./actions-react-binding";
import { removeFromVisualModelAction } from "./remove-from-visual-model";

/**
 * Changes visibility of given {@link nodeSelection} and {@link edgeSelection} to given {@link visibility}.
 */
export const changeSelectionVisibilityAction = (nodeSelection: string[], edgeSelection: string[],
                                                notifications: UseNotificationServiceWriterType,
                                                graph: ModelGraphContextType,
                                                visibility: boolean): void => {
    for(const selectedEntityId of edgeSelection.concat(nodeSelection)) {
        if(visibility === false) {
            // TODO: Maybe we could remove all entities at once instead of removing sequentially (same for the else branch when adding to visual model)
            //       but I am not sure if there is currently support for that (I thought there is, but can't find it now).
            //       Also it might not be as simple - for reference you can check the comment in remove-selection-from-semantic-model.ts
            removeFromVisualModelAction(notifications, graph, selectedEntityId);
        }
        else {
            // Is it ok to use the actions from API? or should we always use the implementing action methods from the action methods
            useActions().addSemanticEntityToVisualModel(selectedEntityId);
        }
    }
};
