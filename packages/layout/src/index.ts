import { SemanticModelEntity, isSemanticModelClass } from "@dataspecer/core-v2/semantic-model/concepts";
import { VisualEntity } from "@dataspecer/core-v2/visual-model";
import { ExtractedModel, LayoutAlgorithm, LayoutMethod, extractModelObjects } from "./layout-iface";

import { doRandomLayoutAdvanced } from "./basic-layouts";
import { UserGivenConstraints, UserGivenAlgorithmConfigurationslVersion2, ConstraintTime, IConstraint, IConstraintSimple } from "./configs/constraints";
import { GraphClassic, GraphFactory, IMainGraphClassic, INodeClassic, MainGraphClassic, VisualEntityComplete } from "./graph-iface";
import { EdgeCrossingMetric } from "./graph-metrics/graph-metrics";
import { ConstraintContainer, ALGORITHM_NAME_TO_LAYOUT_MAPPING } from "./configs/constraint-container";
import { VisualEntityModel } from "@dataspecer/core-v2/visual-model";
import { EntityModel } from "@dataspecer/core-v2";
import { ConstraintFactory } from "./configs/constraint-factories";
import { ReactflowDimensionsEstimator } from "./dimension-estimators/reactflow-dimension-estimator";
import { VisualEntities } from "../../core-v2/lib/visual-model/visual-entity";
import { PhantomElementsFactory } from "./util/utils";
import { CONSTRAINT_MAP } from "./configs/constraints-mapping";

export type { IConstraintSimple, UserGivenConstraints, UserGivenAlgorithmConfigurationslVersion2 as UserGivenConstraintsVersion2 } from "./configs/constraints";
export { getDefaultUserGivenAlgorithmConstraint, getDefaultUserGivenConstraintsVersion2 } from "./configs/constraints";
export type { AlgorithmName } from "./configs/constraint-container";
export { DIRECTION } from "./util/utils";

export type {
	UserGivenAlgorithmConfiguration,
	UserGivenAlgorithmConfigurationElkForce,
	UserGivenAlgorithmConfigurationExtraData,
	UserGivenAlgorithmConfigurationForGeneralization,
	UserGivenAlgorithmConfigurationLayered,
	UserGivenAlgorithmConfigurationStress,
	UserGivenAlgorithmConfigurationOnlyData,
} from "./configs/constraints";

export { type ElkForceAlgType } from "./configs/elk/elk-constraints";

export interface NodeDimensionQueryHandler {
	getWidth(node: INodeClassic);
	getHeight(node: INodeClassic);
}

export async function doDynamicLayout(visualModel: VisualEntityModel,
										semanticModels: Record<string, EntityModel>,
										newNodesIdentifiers: string[],
										config: UserGivenAlgorithmConfigurationslVersion2,
										nodeDimensionQueryHandler?: NodeDimensionQueryHandler) {
	if(nodeDimensionQueryHandler === undefined) {
		nodeDimensionQueryHandler = new ReactflowDimensionsEstimator();
	}

	// TODO: Here perform dynamic layouting on top of visual model
}


export async function doEditorLayout(visualModel: VisualEntityModel,
										semanticModels: Map<string, EntityModel>,
										config: UserGivenAlgorithmConfigurationslVersion2,
										nodeDimensionQueryHandler?: NodeDimensionQueryHandler): Promise<VisualEntities> {
	if(nodeDimensionQueryHandler === undefined) {
		nodeDimensionQueryHandler = new ReactflowDimensionsEstimator();
	}


	// TODO: For now for simplicity just concatenate all the semantic models into one
	let semanticModel: Record<string, SemanticModelEntity> = {};
	for(const currSemanticModel of semanticModels)  {
		semanticModel = {
			...semanticModel,
			...(currSemanticModel[1].getEntities() as Record<string, SemanticModelEntity>)
		};
	}

	const graph = GraphFactory.createMainGraph(null, semanticModel, null, visualModel);
	const visualEntitiesPromise = doFindBestLayoutFromGraph(graph, config, nodeDimensionQueryHandler, visualModel);
	// TODO: Repeating code from doLayout
	if(visualEntitiesPromise == undefined) {
		console.log("LAYOUT FAILED")
		throw new Error("Layout Failed");
	}

	return visualEntitiesPromise;
}


export async function doLayout(inputSemanticModel: Record<string, SemanticModelEntity>,
								config: UserGivenAlgorithmConfigurationslVersion2,
								nodeDimensionQueryHandler?: NodeDimensionQueryHandler): Promise<VisualEntities> {
	if(nodeDimensionQueryHandler === undefined) {
		nodeDimensionQueryHandler = new ReactflowDimensionsEstimator();
	}

	const visualEntitiesPromise = doFindBestLayout(inputSemanticModel, config, nodeDimensionQueryHandler);
	if(visualEntitiesPromise == undefined) {
		console.log("LAYOUT FAILED")
		throw new Error("Layout Failed");
	}

	return visualEntitiesPromise;
}


export async function doFindBestLayout(inputSemanticModel: Record<string, SemanticModelEntity>,
										config: UserGivenAlgorithmConfigurationslVersion2,
										nodeDimensionQueryHandler: NodeDimensionQueryHandler): Promise<VisualEntities> {
	const graph = GraphFactory.createMainGraph(null, inputSemanticModel, null, null);
	return doFindBestLayoutFromGraph(graph, config, nodeDimensionQueryHandler, null);
}

export async function doFindBestLayoutFromGraph(graph: IMainGraphClassic,
												config: UserGivenAlgorithmConfigurationslVersion2,
												nodeDimensionQueryHandler: NodeDimensionQueryHandler,
												visualModel: VisualEntityModel | null): Promise<VisualEntities> {
	const constraints = ConstraintFactory.createConstraints(config);

	// TODO: Try this later, now it isn't that important

	// const compactifyConstraint: IConstraintSimple  = {
	// 	name: "post-compactify",
	// 	type: "???",
	// 	constraintedNodes: "ALL",
	// 	constraintTime: "POST-MAIN",
	// 	data: undefined,
	// };
	// constraints.addSimpleConstraints(compactifyConstraint);

	const resultingLayoutPromise = layoutController(graph, constraints, nodeDimensionQueryHandler, visualModel);

	// TODO: DEBUG
	// console.log("THE END");
	// throw new Error("THE END");

	return resultingLayoutPromise.then(result => result.convertWholeGraphToDataspecerRepresentation());
}


const layoutController = (graph: IMainGraphClassic,
							constraints: ConstraintContainer,
							nodeDimensionQueryHandler: NodeDimensionQueryHandler,
							visualModel: VisualEntityModel | null): Promise<IMainGraphClassic> => {
	return runPreMainAlgorithmConstraints(graph, constraints, nodeDimensionQueryHandler).then(_ => {
		if(constraints.algorithmOnlyConstraints["GENERALIZATION"] !== undefined) {
			// TODO: For now
			(graph as MainGraphClassic).createGeneralizationSubgraphsFromStoredTODOExtractedModel(visualModel);
			console.info("graph.allEdges");
			console.info(graph.allEdges);
			// throw new Error("THE END of subgraphs");

			const generalizationAlgorithm: LayoutAlgorithm = ALGORITHM_NAME_TO_LAYOUT_MAPPING[constraints.algorithmOnlyConstraints["GENERALIZATION"].algorithmName];
			generalizationAlgorithm.prepareFromGraph(graph, constraints, nodeDimensionQueryHandler);
			return generalizationAlgorithm.runGeneralizationLayout(true).then(generalizationResult => {
				return runMainLayoutAlgorithm(generalizationResult, constraints, nodeDimensionQueryHandler).then(result => {
					return runPostMainAlgorithmConstraints(result, constraints, nodeDimensionQueryHandler).then(_ => result);
				});
			});
		}
		else {
			return runMainLayoutAlgorithm(graph, constraints, nodeDimensionQueryHandler).then(result => {
				return runPostMainAlgorithmConstraints(result, constraints, nodeDimensionQueryHandler).then(_ => result);
			});
		}
	});

}


const runPreMainAlgorithmConstraints = async (graph: IMainGraphClassic,
												constraintsContainer: ConstraintContainer,
												nodeDimensionQueryHandler: NodeDimensionQueryHandler): Promise<void[]> => {
	const constraintPromises: Promise<void[]> = runConstraintsInternal(graph, constraintsContainer.simpleConstraints, "PRE-MAIN", nodeDimensionQueryHandler).then(_ => {
		return runConstraintsInternal(graph, constraintsContainer.constraints, "PRE-MAIN", nodeDimensionQueryHandler);
	});
	return constraintPromises;
}

const runPostMainAlgorithmConstraints = async (graph: IMainGraphClassic,
												constraintsContainer: ConstraintContainer,
												nodeDimensionQueryHandler: NodeDimensionQueryHandler): Promise<void[]> => {
	const constraintPromises: Promise<void[]> = runConstraintsInternal(graph, constraintsContainer.simpleConstraints, "POST-MAIN", nodeDimensionQueryHandler).then(_ => {
		return runConstraintsInternal(graph, constraintsContainer.constraints, "POST-MAIN", nodeDimensionQueryHandler);
	});
	return constraintPromises;
}

const runConstraintsInternal = async (graph: IMainGraphClassic,
										constraints: IConstraintSimple[] | IConstraint[],
										constraintTime: Omit<ConstraintTime, "IN-MAIN">,
										nodeDimensionQueryHandler: NodeDimensionQueryHandler): Promise<void[]> => {
	const constraintPromises: Promise<void>[] = [];
	for(const constraint of constraints) {
		if(constraint.constraintTime === constraintTime) {
			constraintPromises.push(CONSTRAINT_MAP[constraint.name](graph, nodeDimensionQueryHandler));
		}
	}

	return Promise.all(constraintPromises);
}


// TODO: Can be called in webworker ... but webworkers in node.js are worker threads and they are non-compatible, so it is too much of a hassle, so maybe later if necessary
// TODO: Also need a bit think about the iterating to find the best model, so the method will maybe need some small rework
const runMainLayoutAlgorithm = async (graph: IMainGraphClassic,
										constraints: ConstraintContainer,
										nodeDimensionQueryHandler: NodeDimensionQueryHandler): Promise<IMainGraphClassic> => {
	const mainLayoutAlgorithm: LayoutAlgorithm = ALGORITHM_NAME_TO_LAYOUT_MAPPING[constraints.algorithmOnlyConstraints["ALL"].algorithmName];
	let bestLayoutedVisualEntitiesPromise: Promise<IMainGraphClassic>;
	let minEdgeCrossCount = 1000000;
	const edgeCrossingMetric: EdgeCrossingMetric = new EdgeCrossingMetric();

	mainLayoutAlgorithm.prepareFromGraph(graph, constraints, nodeDimensionQueryHandler);		// TODO: Prepare only once? or in each iteration?
	for(let i = 0; i < 1; i++) {
		const layoutedGraphPromise: Promise<IMainGraphClassic> = mainLayoutAlgorithm.run(true);
		const layoutedGraph = await layoutedGraphPromise;

		const visualEntities = layoutedGraph.convertWholeGraphToDataspecerRepresentation();
		console.log(visualEntities);

		const edgeCrossCountForCurrMetric = edgeCrossingMetric.computeMetric(graph);
		// console.log("Edge cross count: " + edgeCrossCountForCurrMetric);
		if(minEdgeCrossCount > edgeCrossCountForCurrMetric) {
			// console.log("MIN Edge cross count: " + edgeCrossCountForCurrMetric);
			bestLayoutedVisualEntitiesPromise = layoutedGraphPromise;
			minEdgeCrossCount = edgeCrossCountForCurrMetric;
		}
	}

	return bestLayoutedVisualEntitiesPromise;
}
