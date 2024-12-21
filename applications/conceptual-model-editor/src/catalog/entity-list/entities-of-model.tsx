import { useEffect, useMemo, useState } from "react";

import type { Entity, EntityModel } from "@dataspecer/core-v2/entity-model";
import { InMemorySemanticModel } from "@dataspecer/core-v2/semantic-model/in-memory";
import { ExternalSemanticModel } from "@dataspecer/core-v2/semantic-model/simplified";
import {
    type SemanticModelClass,
    type SemanticModelRelationship,
    isSemanticModelAttribute,
    isSemanticModelClass,
    isSemanticModelGeneralization,
    isSemanticModelRelationship,
} from "@dataspecer/core-v2/semantic-model/concepts";
import {
    type SemanticModelClassUsage,
    type SemanticModelRelationshipUsage,
    isSemanticModelClassUsage,
    isSemanticModelRelationshipUsage,
} from "@dataspecer/core-v2/semantic-model/usage/concepts";

import { useClassesContext } from "../../context/classes-context";
import { useModelGraphContext } from "../../context/model-context";
import { InputEntityRow } from "../components/input-row";
import { RowHierarchy } from "./row-hierarchy";
import { shortenStringTo } from "../../util/utils";
import { ActionsContextType, useActions } from "../../action/actions-react-binding";
import { ExpandModelButton } from "../components/expand-model";
import { type VisualEntity, isVisualNode, isVisualRelationship } from "@dataspecer/core-v2/visual-model";
import { ShowAllClassesFromSemanticModelButton } from "../components/add-entities-from-semantic-model-to-visual-button";
import { HideAllClassesFromSemanticModelButton } from "../components/remove-entities-in-semantic-model-from-visual-button";

export enum EntityType {
    Class = "class",
    Relationship = "relationship",
    Attribute = "attribute",
    Profile = "profile",
}

type EntityTypes = SemanticModelClass | SemanticModelRelationship | SemanticModelClassUsage | SemanticModelRelationshipUsage;

const DEFAULT_MODEL_COLOR = "#000069";

/**
 * @returns entities of given type.
 */
const getEntitiesByType = (entityType: EntityType, model: EntityModel): EntityTypes[] => {
    switch (entityType) {
        case EntityType.Class:
            return Object.values(model.getEntities())
                .filter(isSemanticModelClass);
        case EntityType.Relationship:
            return Object.values(model.getEntities())
                .filter(isSemanticModelRelationship)
                .filter((entity) => !isSemanticModelAttribute(entity));
        case EntityType.Attribute:
            return Object.values(model.getEntities())
                .filter(isSemanticModelAttribute);
        case EntityType.Profile:
            return Object.values(model.getEntities())
                .filter(isUsage);
    }
};

const isUsage = (what: Entity | null): what is SemanticModelClassUsage | SemanticModelRelationshipUsage => {
    return isSemanticModelClassUsage(what) || isSemanticModelRelationshipUsage(what);
};

/**
 * Render list of entities of given type for given model.
 */
export const EntitiesOfModel = (props: {
    model: EntityModel;
    entityType: EntityType;
}) => {
    const { model, entityType } = props;
    //
    const actions = useActions();
    const { allowedClasses, setAllowedClasses } = useClassesContext();
    const { aggregatorView } = useModelGraphContext();
    const activeVisualModel = useMemo(() => aggregatorView.getActiveVisualModel(), [aggregatorView]);
    // We could utilize Set, but since the list of visible is probably small,
    // this should be fine as well.
    const [listCollapsed, setListCollapsed] = useState(false);
    const [visible, setVisible] = useState<string[]>([]);
    const [color, setColor] = useState(DEFAULT_MODEL_COLOR);
    const entities = getEntitiesByType(entityType, model);

    /**
     * Initialize.
     */
    useEffect(() => {
        if (activeVisualModel === null) {
            // We need to wait to get the model.
            return;
        }
        // Load what we need from the visual model.
        const nextVisible: string[] = [];
        activeVisualModel.getVisualEntities().forEach(entity => {
            const represented = getRepresented(entity);
            if (represented !== null) {
                nextVisible.push(represented);
            }
        });

        setVisible(nextVisible);
        setColor(activeVisualModel.getModelColor(model.getId()) ?? DEFAULT_MODEL_COLOR);

        // Subscribe to changes, so we can keep the visible list up to date.
        const unsubscribe = activeVisualModel.subscribeToChanges({
            modelColorDidChange(identifier, next) {
                if (identifier === model.getId()) {
                    setColor(next ?? DEFAULT_MODEL_COLOR);
                }
            },
            visualEntitiesDidChange(entities) {
                for (const { previous, next } of entities) {
                    if (previous === null && next !== null) {
                        // Create.
                        const represented = getRepresented(next);
                        if (represented !== null) {
                            setVisible(prev => [...prev, represented]);
                        }
                    } else if (previous !== null && next === null) {
                        // Delete
                        setVisible(prev => {
                            const represented = getRepresented(previous);
                            if (represented === null) {
                                return prev;
                            }
                            const index = prev.indexOf(represented);
                            if (index === -1) {
                                return prev;
                            }
                            return [
                                ...prev.slice(0, index),
                                ...prev.slice(index + 1, prev.length),
                            ];
                        });
                    } else if (previous !== null && next !== null) {
                        // Update
                    }
                }
            },
        });

        return () => {
            setVisible([]);
            unsubscribe();
        };

    }, [activeVisualModel, model]);

    /**
     * Add surrounding of an entity to the entity model.
     * This functionality is available only for ExternalSemanticModel.
     */
    const handleExpansion = async (model: EntityModel, identifier: string) => {
        if (!(model instanceof ExternalSemanticModel)) {
            return;
        }
        if (allowedClasses.includes(identifier)) {
            setAllowedClasses(allowedClasses.filter((allowed) => allowed !== identifier));
            await model.releaseClassSurroundings(identifier);
        } else {
            setAllowedClasses([...allowedClasses, identifier]);
            await model.allowClassSurroundings(identifier);
        }
    };

    const handleAddToView = (entity: Entity) => {
        if (isSemanticModelClass(entity)) {
            actions.addClassToVisualModel(model.getId(), entity.id, null);
        } else if (isSemanticModelClassUsage(entity)) {
            actions.addClassProfileToVisualModel(model.getId(), entity.id, null);
        } else if (isSemanticModelRelationship(entity)) {
            actions.addRelationToVisualModel(model.getId(), entity.id);
        } else if (isSemanticModelRelationshipUsage(entity)) {
            actions.addRelationProfileToVisualModel(model.getId(), entity.id);
        } else if (isSemanticModelGeneralization(entity)) {
            actions.addGeneralizationToVisualModel(model.getId(), entity.id);
        }
    };

    const handleDeleteFromView = (identifier: string) => {
        actions.removeFromVisualModel([identifier]);
    };

    const handleDeleteEntity = async (model: InMemorySemanticModel | ExternalSemanticModel, identifier: string) => {
        await actions.deleteFromSemanticModels([{identifier, sourceModel: model.getId()}]);
    };

    const handleSetViewportToEntity = (identifier: string) => {
        actions.centerViewportToVisualEntity(model.getId(), identifier);
    };

    // Rendering section.
    const displayName = model.getAlias() ?? shortenStringTo(model.getId());
    return (
        <li style={{ backgroundColor: color }}>
            <div className="flex flex-row justify-between">
                <h4>
                    Ⓜ {displayName}
                    <ShowAllClassesFromSemanticModelButton semanticModel={model}></ShowAllClassesFromSemanticModelButton>
                    <HideAllClassesFromSemanticModelButton semanticModel={model}></HideAllClassesFromSemanticModelButton>
                </h4>
                <div className="flex flex-row">
                    {renderAddButton(actions, entityType, model)}
                    <ExpandModelButton isOpen={listCollapsed} onClick={() => setListCollapsed(!listCollapsed)} />
                </div>
            </div>
            {listCollapsed ? null : (
                <ul id={`infinite-scroll-${model.getId()}`} className="ml-1">
                    {entities.map((entity: EntityTypes) => (
                        <RowHierarchy
                            key={entity.id}
                            entity={entity}
                            indent={0}
                            handlers={{
                                handleAddEntityToActiveView: handleAddToView,
                                handleRemoveEntityFromActiveView: handleDeleteFromView,
                                handleExpansion,
                                handleRemoval: handleDeleteEntity,
                                handleTargeting: handleSetViewportToEntity,
                            }}
                            onCanvas={visible}
                        />
                    ))}
                    {renderExternalSemanticModelSearch(entityType, model)}
                </ul>
            )}
        </li>
    );
};

function getRepresented(entity: VisualEntity): string | null {
    if (isVisualNode(entity)) {
        return entity.representedEntity;
    } else if (isVisualRelationship(entity)) {
        return entity.representedRelationship;
    } else {
        return null;
    }
}

/**
 * Render input to add a class.
 * This is search box for ExternalSemanticModel and a "add" button for InMemorySemanticModel.
 */
function renderExternalSemanticModelSearch(type: EntityType, model: EntityModel) {
    if (type !== EntityType.Class) {
        return null;
    }
    if (model instanceof ExternalSemanticModel) {
        const onClick = (search: string) => {
            model.search(search).then(async found => {
                for (const item of found) {
                    // We need to use IRI as ExternalSemanticModel,
                    // or sgov in time of writing, does not support identifier.
                    if (item.iri === null) {
                        continue;
                    }
                    await model.allowClass(item.iri);
                }
            }).catch(console.error);
        };
        return <InputEntityRow onClickHandler={onClick} />;
    }
    return null;
}

function renderAddButton(actions: ActionsContextType, type: EntityType, model: EntityModel) {
    if (!(model instanceof InMemorySemanticModel) || type === EntityType.Profile) {
        return null;
    }

    const onAdd = () => {
        switch (type) {
            case EntityType.Class:
                actions.openCreateClassDialog(model.getId());
                break;
            case EntityType.Attribute:
                actions.openCreateAttributeDialog(model.getId());
                break;
            case EntityType.Relationship:
                actions.openCreateAssociationDialog(model.getId());
                break;
        }
    };

    return (
        <div className="flex flex-row justify-between whitespace-nowrap pb-1 pt-0.5">
            &nbsp;
            <button className="ml-2 px-1" onClick={onAdd}>➕</button>
        </div>
    )
}
