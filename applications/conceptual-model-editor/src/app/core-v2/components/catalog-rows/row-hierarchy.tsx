import {
    SemanticModelClass,
    SemanticModelRelationship,
    isSemanticModelAttribute,
    isSemanticModelClass,
} from "@dataspecer/core-v2/semantic-model/concepts";
import { InMemorySemanticModel } from "@dataspecer/core-v2/semantic-model/in-memory";
import {
    SemanticModelClassUsage,
    SemanticModelRelationshipUsage,
    isSemanticModelAttributeUsage,
    isSemanticModelClassUsage,
} from "@dataspecer/core-v2/semantic-model/usage/concepts";
import { EntityRow } from "../../components/catalog-rows/entity-catalog-row";
import { sourceModelOfEntity } from "../../util/model-utils";
import { useModelGraphContext } from "../../context/model-context";
import { useClassesContext } from "../../context/classes-context";
import { ProfileDialogSupportedTypes } from "../../dialog/create-profile-dialog";
import { ExternalSemanticModel } from "@dataspecer/core-v2/semantic-model/simplified";
import { EntityModel } from "@dataspecer/core-v2/entity-model";
import { useState } from "react";

export const RowHierarchy = (props: {
    entity: SemanticModelClass | SemanticModelClassUsage | SemanticModelRelationship | SemanticModelRelationshipUsage;
    handlers: {
        handleOpenModification: (
            model: InMemorySemanticModel,
            entity:
                | SemanticModelClass
                | SemanticModelClassUsage
                | SemanticModelRelationship
                | SemanticModelRelationshipUsage
        ) => void;
        handleOpenDetail: (
            cls:
                | SemanticModelClass
                | SemanticModelClassUsage
                | SemanticModelRelationship
                | SemanticModelRelationshipUsage
        ) => void;
        handleAddEntityToActiveView: (entityId: string) => void;
        handleRemoveEntityFromActiveView: (entityId: string) => void;
        handleCreateUsage: (entity: ProfileDialogSupportedTypes) => void;
        handleExpansion: (model: EntityModel, classId: string) => Promise<void>;
        handleRemoval: (model: InMemorySemanticModel, entityId: string) => void;
    };
    visibleOnCanvas: Map<string, boolean>;
    indent: number;
}) => {
    const { models, aggregatorView } = useModelGraphContext();
    const { profiles, classes2, allowedClasses } = useClassesContext();

    const [showProfiles, setShowProfiles] = useState(false);

    const sourceModel = sourceModelOfEntity(props.entity.id, [...models.values()]);

    const modificationHandler =
        sourceModel instanceof InMemorySemanticModel
            ? { openModificationHandler: () => props.handlers.handleOpenModification(sourceModel, props.entity) }
            : null;

    const expansionHandler =
        isSemanticModelClass(props.entity) && sourceModel instanceof ExternalSemanticModel
            ? {
                  toggleHandler: () => props.handlers.handleExpansion(sourceModel, props.entity.id),
                  expanded: () => allowedClasses.includes(props.entity.id),
              }
            : null;

    const drawingHandler = !(isSemanticModelAttribute(props.entity) || isSemanticModelAttributeUsage(props.entity))
        ? {
              addToViewHandler: () => props.handlers.handleAddEntityToActiveView(props.entity.id),
              removeFromViewHandler: () => props.handlers.handleRemoveEntityFromActiveView(props.entity.id),
          }
        : null;

    const removalHandler =
        sourceModel instanceof InMemorySemanticModel
            ? { remove: () => props.handlers.handleRemoval(sourceModel, props.entity.id) }
            : null;

    const profilingHandler = {
        createProfileHandler: () => {
            props.handlers.handleCreateUsage(props.entity);
        },
    };

    const thisEntityProfiles = profiles.filter((p) => p.usageOf == props.entity.id);

    return (
        <>
            <div
                className={`${thisEntityProfiles.length > 0 && props.indent == 0 ? "grid grid-cols-[auto_1fr]" : ""}`}
                style={
                    props.indent > 0 && sourceModel
                        ? { backgroundColor: aggregatorView.getActiveVisualModel()?.getColor(sourceModel?.getId()) }
                        : {}
                }
            >
                {thisEntityProfiles.length > 0 && props.indent == 0 && (
                    <button title="show profiles of this entity" onClick={() => setShowProfiles((prev) => !prev)}>
                        {showProfiles ? "🍳" : "🥚"}
                    </button>
                )}
                <EntityRow
                    offset={props.indent}
                    entity={props.entity}
                    key={props.entity.id + aggregatorView.getActiveVisualModel()?.getId() + classes2.length}
                    expandable={expansionHandler}
                    openDetailHandler={() => props.handlers.handleOpenDetail(props.entity)}
                    modifiable={modificationHandler}
                    drawable={drawingHandler}
                    removable={removalHandler}
                    profile={profilingHandler}
                    sourceModel={sourceModel}
                    visibleOnCanvas={props.visibleOnCanvas.get(props.entity.id)}
                />
            </div>
            {(props.indent > 0 || showProfiles) &&
                thisEntityProfiles.map((p) => (
                    <RowHierarchy
                        entity={p}
                        indent={props.indent + 1}
                        handlers={props.handlers}
                        visibleOnCanvas={props.visibleOnCanvas}
                    />
                ))}
        </>
    );
};