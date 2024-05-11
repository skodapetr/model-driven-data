import ReactFlow, {
    Background,
    Connection,
    Controls,
    Edge,
    EdgeChange,
    MiniMap,
    Node,
    NodeChange,
    Panel,
    ReactFlowInstance,
    XYPosition,
    getRectOfNodes,
    getTransformForBounds,
    useEdgesState,
    useNodesState,
} from "reactflow";
import { useMemo, useCallback, useEffect, useState } from "react";
import { ClassCustomNode, semanticModelClassToReactFlowNode } from "./reactflow/class-custom-node";
import {
    SimpleFloatingEdge,
    semanticModelClassUsageToReactFlowEdge,
    semanticModelGeneralizationToReactFlowEdge,
    semanticModelRelationshipToReactFlowEdge,
} from "./reactflow/simple-floating-edge";
import { tailwindColorToHex } from "../utils/color-utils";

import "reactflow/dist/style.css";
import { useCreateConnectionDialog } from "./dialog/create-connection-dialog";
import { useModelGraphContext } from "./context/model-context";
import {
    SemanticModelClass,
    SemanticModelGeneralization,
    SemanticModelRelationship,
    isSemanticModelAttribute,
    isSemanticModelClass,
    isSemanticModelGeneralization,
    isSemanticModelRelationship,
} from "@dataspecer/core-v2/semantic-model/concepts";
import { Entity } from "@dataspecer/core-v2/entity-model";
import { useClassesContext } from "./context/classes-context";
import { VisualEntity } from "@dataspecer/core-v2/visual-model";

import { useEntityDetailDialog } from "./dialog/entity-detail-dialog";
import { useModifyEntityDialog } from "./dialog/modify-entity-dialog";
import { AggregatedEntityWrapper } from "@dataspecer/core-v2/semantic-model/aggregator";
import {
    SemanticModelClassUsage,
    SemanticModelRelationshipUsage,
    isSemanticModelAttributeUsage,
    isSemanticModelClassUsage,
    isSemanticModelRelationshipUsage,
} from "@dataspecer/core-v2/semantic-model/usage/concepts";
import { InMemorySemanticModel } from "@dataspecer/core-v2/semantic-model/in-memory";
import { useCreateClassDialog } from "./dialog/create-class-dialog";
import { useCreateProfileDialog } from "./dialog/create-profile-dialog";
import { getDomainAndRange } from "@dataspecer/core-v2/semantic-model/relationship-utils";
import { bothEndsHaveAnIri, temporaryDomainRangeHelper } from "./util/relationship-utils";
import { toSvg } from "html-to-image";
import { useDownload } from "./features/export/download";

export const Visualization = () => {
    const { aggregatorView, models } = useModelGraphContext();
    const { CreateConnectionDialog, isCreateConnectionDialogOpen, openCreateConnectionDialog } =
        useCreateConnectionDialog();
    const { EntityDetailDialog, isEntityDetailDialogOpen, openEntityDetailDialog } = useEntityDetailDialog();
    const { ModifyEntityDialog, isModifyEntityDialogOpen, openModifyEntityDialog } = useModifyEntityDialog();
    const { CreateClassDialog, isCreateClassDialogOpen, openCreateClassDialog } = useCreateClassDialog();
    const { CreateProfileDialog, isCreateProfileDialogOpen, openCreateProfileDialog } = useCreateProfileDialog();
    const { downloadImage } = useDownload();

    const { classes, classes2, relationships, generalizations, profiles, sourceModelOfEntityMap } = useClassesContext();

    const activeVisualModel = useMemo(() => aggregatorView.getActiveVisualModel(), [aggregatorView]);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const nodeTypes = useMemo(() => ({ classCustomNode: ClassCustomNode }), []);
    const edgeTypes = useMemo(() => ({ floating: SimpleFloatingEdge }), []);

    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

    const handleAddEntityToActiveView = (entityId: string, position?: XYPosition) => {
        const updateStatus = activeVisualModel?.updateEntity(entityId, { visible: true, position });
        if (!updateStatus) {
            activeVisualModel?.addEntity({ sourceEntityId: entityId, position });
        }
    };

    const onConnect = useCallback(
        (connection: Connection) => {
            openCreateConnectionDialog(connection);
        },
        [setEdges]
    );

    const onDragOver = useCallback((event: any) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event: any) => {
            event.preventDefault();

            const type = event.dataTransfer.getData("application/reactflow");
            const entityId = event.dataTransfer.getData("application/reactflow-entityId");

            // check if the dropped element is valid
            if (typeof type === "undefined" || !type) {
                return;
            }

            // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
            // and you don't need to subtract the reactFlowBounds.left/top anymore
            // details: https://reactflow.dev/whats-new/2023-11-10
            const position = reactFlowInstance?.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            console.log("on drop handler", event, reactFlowInstance, event.dataTransfer, type, entityId, position);
            handleAddEntityToActiveView(entityId, position);
        },
        [reactFlowInstance, activeVisualModel]
    );

    const getCurrentClassesRelationshipsGeneralizationsAndProfiles = () => {
        return {
            classes2,
            relationships,
            attributes: relationships.filter(isSemanticModelAttribute),
            generalizations,
            profiles,
            profileAttributes: profiles.filter(isSemanticModelAttributeUsage),
            models,
        };
    };

    const relationshipOrGeneralizationToEdgeType = (
        entity: Entity | null,
        color: string | undefined,
        openEntityDetailDialog: () => void,
        openModificationDialog: () => void,
        openCreateProfileDialog: () => void
    ): Edge | undefined => {
        if (isSemanticModelRelationshipUsage(entity)) {
            const usageNotes = entity.usageNote ? [entity.usageNote] : [];
            return semanticModelRelationshipToReactFlowEdge(
                entity,
                color,
                usageNotes,
                openEntityDetailDialog,
                openModificationDialog,
                openCreateProfileDialog
            ) as Edge;
        } else if (isSemanticModelRelationship(entity)) {
            return semanticModelRelationshipToReactFlowEdge(
                entity,
                color,
                [],
                openEntityDetailDialog,
                openModificationDialog,
                openCreateProfileDialog
            ) as Edge;
        } else if (isSemanticModelGeneralization(entity)) {
            return semanticModelGeneralizationToReactFlowEdge(entity, color, openEntityDetailDialog) as Edge;
        }
        return;
    };

    const classUsageToEdgeType = (entity: SemanticModelClassUsage, color: string | undefined): Edge => {
        const res = semanticModelClassUsageToReactFlowEdge(
            entity,
            color,
            () => openEntityDetailDialog(entity),
            () => openModifyEntityDialog(entity)
        );
        return res;
    };

    const rerenderEverythingOnCanvas = () => {
        const modelId = [...models.keys()].at(0);
        if (!modelId) {
            return;
        }
        activeVisualModel?.setColor(modelId, activeVisualModel.getColor(modelId)!); // fixme: jak lip vyvolat change na vsech entitach? 😅
    };

    const exportCanvasToSvg = async () => {
        // we calculate a transform for the nodes so that all nodes are visible
        // we then overwrite the transform of the `.react-flow__viewport` element
        // with the style option of the html-to-image library
        const imageWidth = 800,
            imageHeight = 550;
        const nodesBounds = getRectOfNodes(nodes);
        const transform = getTransformForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2);

        const flow__viewport = document.querySelector(".react-flow__viewport") as HTMLElement | null;

        if (!flow__viewport) {
            return;
        }

        toSvg(flow__viewport, {
            backgroundColor: "#ffffff",
            width: imageWidth,
            height: imageHeight,
            style: {
                width: imageWidth.toString(),
                height: imageHeight.toString(),
                transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
            },
        }).then(downloadImage);
    };

    useEffect(() => {
        // console.log("rerunning useEffect in visualization");
        const aggregatorCallback = (updated: AggregatedEntityWrapper[], removed: string[]) => {
            const localActiveVisualModel = aggregatorView.getActiveVisualModel();
            const entities = aggregatorView.getEntities();
            let {
                classes2: localClasses,
                relationships: localRelationships,
                attributes: localAttributes,
                generalizations: localGeneralizations,
                profiles: localProfiles,
                profileAttributes: localAttributeProfiles,
                models: localModels,
            } = getCurrentClassesRelationshipsGeneralizationsAndProfiles();
            // console.log(
            //     "visualization useEffect aggregator callback u&r:",
            //     updated,
            //     removed,
            //     "local: r,a,g,p,ap",
            //     localRelationships,
            //     localAttributes,
            //     localGeneralizations,
            //     localProfiles,
            //     localAttributeProfiles
            // );

            const getNode = (cls: SemanticModelClass | SemanticModelClassUsage, visualEntity: VisualEntity | null) => {
                if (!visualEntity) {
                    return;
                }
                const pos = visualEntity.position;
                const visible = visualEntity.visible;
                if (!cls || !pos) {
                    return;
                }
                if (!visible) {
                    return "hide-it!";
                }
                let originModelId = sourceModelOfEntityMap.get(cls.id); // ocalClasses.get(cls.id)?.origin;

                if (!originModelId) {
                    // just try to find the model directly
                    const modelId = [...localModels.values()]
                        .find((m) => {
                            const c = m.getEntities()[cls.id];
                            if (c) return true;
                        })
                        ?.getId();
                    if (modelId) {
                        originModelId = modelId;
                    }
                }
                const sourceModel = [models.get(originModelId ?? "")].find(
                    (m): m is InMemorySemanticModel => m instanceof InMemorySemanticModel
                );

                const attributes = localAttributes
                    .filter(isSemanticModelAttribute)
                    .filter((attr) => getDomainAndRange(attr)?.domain.concept == cls.id);
                const attributeProfiles = localAttributeProfiles
                    .filter(isSemanticModelAttributeUsage)
                    .filter((attr) => temporaryDomainRangeHelper(attr)?.domain.concept == cls.id);

                return semanticModelClassToReactFlowNode(
                    cls.id,
                    cls,
                    pos,
                    originModelId ? localActiveVisualModel?.getColor(originModelId) : "#ffaa66", // colorForModel.get(UNKNOWN_MODEL_ID),
                    attributes,
                    () => openEntityDetailDialog(cls),
                    () => openModifyEntityDialog(cls, sourceModel ?? null),
                    () => openCreateProfileDialog(cls),
                    attributeProfiles
                );
            };

            const getEdge = (
                relOrGen: SemanticModelRelationship | SemanticModelGeneralization | SemanticModelRelationshipUsage,
                color: string | undefined
            ) => {
                return relationshipOrGeneralizationToEdgeType(
                    relOrGen,
                    color,
                    () => openEntityDetailDialog(relOrGen),
                    // @ts-ignore TODO: modifikace generalizace
                    // model ? () => openModifyEntityDialog(relOrGen, model) :
                    (m: InMemorySemanticModel | null) => openModifyEntityDialog(relOrGen, m),
                    isSemanticModelGeneralization(relOrGen) ? () => {} : () => openCreateProfileDialog(relOrGen)
                );
            };

            if (removed.length > 0) {
                // --- removed entities --- --- ---
                const [affectedNodeIds, nodesAffectedByAttributeRemovals] = localAttributes
                    .filter((a) => removed.includes(a.id))
                    .map((a) => {
                        const aggregatedEntityOfAttributesNode =
                            entities[a.ends[0]?.concept ?? ""]?.aggregatedEntity ?? null;
                        const visualEntityOfAttributesNode =
                            entities[aggregatedEntityOfAttributesNode?.id ?? ""]?.visualEntity;
                        localAttributes = localAttributes.filter((la) => la.id != a.id);

                        if (
                            isSemanticModelClass(aggregatedEntityOfAttributesNode) ||
                            isSemanticModelClassUsage(aggregatedEntityOfAttributesNode)
                        ) {
                            const n = getNode(aggregatedEntityOfAttributesNode, visualEntityOfAttributesNode ?? null);
                            if (n && n != "hide-it!") {
                                return [n.id, n];
                            }
                        }
                        return null;
                    })
                    .filter((n): n is [string, Node] => n != null)
                    .reduce(
                        ([ids, nodes], curr) => {
                            return [ids.add(curr[0]), nodes.concat(curr[1])];
                        },
                        [new Set<string>(), [] as Node[]]
                    );
                localGeneralizations = localGeneralizations.filter((g) => !removed.includes(g.id));
                localRelationships = localRelationships.filter((r) => !removed.includes(r.id));
                localProfiles = localProfiles.filter((p) => !removed.includes(p.id));
                setNodes((n) =>
                    n
                        .filter((v) => !removed.includes(v.id) && !affectedNodeIds.has(v.id))
                        .concat(nodesAffectedByAttributeRemovals)
                );
            }

            for (const { id, aggregatedEntity: entity, visualEntity: ve } of updated) {
                const visualEntity = ve ?? entities[id]?.visualEntity ?? null;
                if (isSemanticModelClass(entity) || isSemanticModelClassUsage(entity)) {
                    const n = getNode(entity, visualEntity);
                    if (n == "hide-it!") {
                        setNodes((prev) => prev.filter((node) => node.data.cls.id !== id));
                    } else if (n) {
                        setNodes((prev) => prev.filter((n) => n.data.cls.id !== id).concat(n));
                    }
                } else if (isSemanticModelAttribute(entity) || isSemanticModelAttributeUsage(entity)) {
                    if (bothEndsHaveAnIri(entity)) {
                        console.warn("both ends have an IRI, skipping", entity, entity.ends);
                        alert("both ends have an IRI, skipping");
                        continue;
                    }
                    // it is an attribute, rerender the node that the attribute comes form
                    const domainOfAttribute = isSemanticModelAttribute(entity)
                        ? getDomainAndRange(entity)?.domain.concept
                        : null;
                    const aggrEntityOfAttributesNode =
                        entities[domainOfAttribute ?? entity.ends[0]?.concept ?? ""]?.aggregatedEntity ?? null;

                    if (
                        isSemanticModelClass(aggrEntityOfAttributesNode) ||
                        isSemanticModelClassUsage(aggrEntityOfAttributesNode)
                    ) {
                        // TODO: omg, localAttributes jeste v sobe nemaj ten novej atribut, tak ho se musim jeste pridat 🤦
                        if (isSemanticModelRelationship(entity)) {
                            // remove the existing version of attribute, use this updated one
                            localAttributes = localAttributes.filter((v) => v.id != entity.id).concat(entity);
                        } else {
                            // remove the existing version of attribute, use this updated one
                            localAttributeProfiles = localAttributeProfiles
                                .filter((v) => v.id != entity.id)
                                .concat(entity);
                        }

                        const visEntityOfAttributesNode = entities[aggrEntityOfAttributesNode.id]?.visualEntity;
                        const n = getNode(aggrEntityOfAttributesNode, visEntityOfAttributesNode ?? null);
                        if (n && n != "hide-it!") {
                            setNodes((prev) => prev.filter((n) => n.data.cls.id !== id).concat(n));
                        }
                    } else {
                        console.log(
                            "callback2: something weird",
                            aggrEntityOfAttributesNode,
                            entity,
                            entities[aggrEntityOfAttributesNode?.id ?? ""]
                        );
                    }
                    continue;
                } else if (isSemanticModelRelationship(entity)) {
                    localRelationships = localRelationships.filter((r) => r.id != entity.id).concat(entity);
                } else if (isSemanticModelRelationshipUsage(entity)) {
                    localProfiles = localProfiles.filter((p) => p.id != entity.id).concat(entity);
                } else if (isSemanticModelGeneralization(entity)) {
                    localGeneralizations = localGeneralizations.filter((g) => g.id != entity.id).concat(entity);
                } else {
                    console.error("callback2 unknown entity type", id, entity, visualEntity);
                    //throw new Error("unknown entity type"); // todo: throws if there is a visual entity without semantic entity
                }
            }

            // console.log(
            //     "visualization useEffect aggregator callback AFTER setting locals u&r:",
            //     updated,
            //     removed,
            //     "local: r,a,g,p,ap",
            //     localRelationships,
            //     localAttributes,
            //     localGeneralizations,
            //     localProfiles,
            //     localAttributeProfiles
            // );
            const rerenderAllEdges = () => {
                const e2 = aggregatorView.getActiveVisualModel()?.getVisualEntities();
                const es = [
                    ...localRelationships,
                    ...localGeneralizations,
                    ...localProfiles.filter(isSemanticModelRelationshipUsage),
                ]
                    .map((relOrGen) => {
                        const visible = e2?.get(relOrGen.id)?.visible ?? true;
                        if (!visible) {
                            return;
                        }

                        const sourceModelId = sourceModelOfEntityMap.get(relOrGen.id);
                        return getEdge(
                            relOrGen,
                            localActiveVisualModel?.getColor(sourceModelId ?? "some random model id that doesn't exist")
                        );
                    })
                    .filter((e): e is Edge => {
                        return e?.id != undefined;
                    })
                    .concat(
                        [...localProfiles].filter(isSemanticModelClassUsage).map((u) => {
                            const sourceModelId = sourceModelOfEntityMap.get(u.id);
                            return classUsageToEdgeType(u, localActiveVisualModel?.getColor(sourceModelId ?? ""));
                        })
                    );

                setEdges(es);
            };
            rerenderAllEdges();
        };

        const callToUnsubscribe2 = aggregatorView.subscribeToChanges(aggregatorCallback);
        const callToUnsubscribe3 = aggregatorView
            .getActiveVisualModel()
            ?.subscribeToChanges((updated: Record<string, VisualEntity>, removed: string[]) => {
                // console.log("visual model subscription", updated, removed);
                const entities = aggregatorView.getEntities();
                const updatedAsAggrEntityWrappers = Object.entries(updated).map(([uId, visualEntity]) => {
                    return {
                        id: visualEntity.sourceEntityId,
                        aggregatedEntity: entities[visualEntity.sourceEntityId]?.aggregatedEntity ?? null,
                        visualEntity: visualEntity,
                    } as AggregatedEntityWrapper;
                });
                aggregatorCallback(updatedAsAggrEntityWrappers, removed);
            });

        aggregatorCallback([], []);

        return () => {
            callToUnsubscribe2?.();
            callToUnsubscribe3?.();
        };
    }, [aggregatorView, classes /* changed when new view is used */]);

    useEffect(() => {
        console.log("visualization: active visual model changed", activeVisualModel);
        setNodes([]);
        setEdges([]);
        rerenderEverythingOnCanvas();
    }, [activeVisualModel]);

    const handleNodeChanges = (changes: NodeChange[]) => {
        for (const change of changes) {
            if (change.type == "position") {
                // FIXME: maybe optimize so that it doesn't update every pixel
                change.positionAbsolute &&
                    activeVisualModel?.updateEntity(change.id, { position: change.positionAbsolute });
            }
        }
    };

    return (
        <>
            {isCreateConnectionDialogOpen && <CreateConnectionDialog />}
            {isEntityDetailDialogOpen && <EntityDetailDialog />}
            {isModifyEntityDialogOpen && <ModifyEntityDialog />}
            {isCreateClassDialogOpen && <CreateClassDialog />}
            {isCreateProfileDialogOpen && <CreateProfileDialog />}

            <div className="h-full w-full">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    onNodesChange={(changes: NodeChange[]) => {
                        onNodesChange(changes);
                        handleNodeChanges(changes);
                    }}
                    onEdgesChange={(changes: EdgeChange[]) => {
                        onEdgesChange(changes);
                    }}
                    onConnect={onConnect}
                    snapGrid={[20, 20]}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    snapToGrid={true}
                    onInit={(reactFlowInstance) => setReactFlowInstance(reactFlowInstance)}
                    onPaneClick={(e) => {
                        if (e.altKey) {
                            const position = reactFlowInstance?.screenToFlowPosition({
                                x: e.clientX,
                                y: e.clientY,
                            });
                            openCreateClassDialog(undefined, {
                                x: position?.x ?? e.nativeEvent.layerX,
                                y: position?.y ?? e.nativeEvent.layerY,
                            });
                        }
                    }}
                >
                    <Controls />
                    <MiniMap
                        nodeColor={miniMapNodeColor}
                        style={{ borderStyle: "solid", borderColor: "#5438dc", borderWidth: "2px" }}
                    />
                    <Panel position="top-right">
                        <div className="flex flex-row-reverse">
                            <div className="cursor-help" title="add class to canvas by clicking and holding `alt`">
                                ℹ
                            </div>
                            <div className="mx-1">
                                <button title="download svg of the canvas" onClick={exportCanvasToSvg}>
                                    🖼
                                </button>
                            </div>
                        </div>
                    </Panel>
                    <Background gap={12} size={1} />
                </ReactFlow>
            </div>
        </>
    );
};

const miniMapNodeColor = (node: Node) => {
    return tailwindColorToHex(node.data?.color);
};
