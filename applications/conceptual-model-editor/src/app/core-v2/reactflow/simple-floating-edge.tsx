import { useCallback } from "react";
import {
    useStore,
    EdgeProps,
    getSimpleBezierPath,
    EdgeLabelRenderer,
    getStraightPath,
    Edge,
    MarkerType,
} from "reactflow";

import { getEdgeParams } from "./utils";
import { SemanticModelRelationship, SemanticModelGeneralization } from "@dataspecer/core-v2/semantic-model/concepts";
import { getNameOf } from "../util/utils";

// this is a little helper component to render the actual edge label
const CardinalityEdgeLabel = ({ transform, label }: { transform: string; label: string }) => {
    return (
        <div className="nodrag nopan absolute bg-teal-800 p-1" style={{ transform }} className="nodrag nopan">
            {label}
        </div>
    );
};

export const SimpleFloatingEdge: React.FC<EdgeProps> = ({ id, source, target, style, markerEnd, data }) => {
    const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
    const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

    if (!sourceNode || !targetNode) {
        return null;
    }

    const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

    const [edgePath, labelX, labelY] =
        data.type == "r"
            ? getSimpleBezierPath({
                  sourceX: sx,
                  sourceY: sy,
                  sourcePosition: sourcePos,
                  targetPosition: targetPos,
                  targetX: tx,
                  targetY: ty,
              })
            : getStraightPath({
                  sourceX: sx,
                  sourceY: sy,
                  targetX: tx,
                  targetY: ty,
              });

    return (
        <>
            <path
                id={id}
                className="react-flow__edge-path"
                d={edgePath}
                strokeWidth={1}
                markerEnd={markerEnd}
                style={style}
            />
            <EdgeLabelRenderer>
                <div
                    className="nodrag nopan absolute bg-teal-500 p-2"
                    style={{
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                    }}
                >
                    {data.label}
                </div>
                {data.cardinalitySource && (
                    <CardinalityEdgeLabel
                        transform={`translate(-50%,-10%) translate(${sx}px,${sy}px)`}
                        label={data.cardinalitySource}
                    />
                )}
                {data.cardinalityTarget && (
                    <CardinalityEdgeLabel transform={` translate(${tx}px,${ty}px)`} label={data.cardinalityTarget} />
                )}
            </EdgeLabelRenderer>
        </>
    );
};

export const semanticModelRelationshipToReactFlowEdge = (rel: SemanticModelRelationship, index: number = 6.9) =>
    ({
        id: rel.id,
        source: rel.ends[0]!.concept,
        target: rel.ends[1]!.concept,
        markerEnd: { type: MarkerType.Arrow },
        type: "floating",
        data: {
            label: getNameOf(rel).t,
            type: "r",
            cardinalitySource: rel.ends[0]?.cardinality?.toString(),
            cardinalityTarget: rel.ends[1]?.cardinality?.toString(),
        },
        style: { strokeWidth: 2 },
    } as Edge);

export const semanticModelGeneralizationToReactFlowEdge = (
    gen: SemanticModelGeneralization,
    index: number = 6.9,
    strokeColor: string | undefined
) =>
    ({
        id: gen.id,
        source: gen.child,
        target: gen.parent,
        markerEnd: { type: MarkerType.ArrowClosed, color: strokeColor || "maroon" },
        type: "floating",
        data: { label: "generalization", type: "g" },
        style: { stroke: strokeColor || "maroon", strokeWidth: 2 },
    } as Edge);
