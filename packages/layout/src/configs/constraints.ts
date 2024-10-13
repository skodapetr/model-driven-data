import { LayoutOptions } from "elkjs";
import { IGraphClassic, IMainGraphClassic } from "../graph-iface"
import { DIRECTION } from "../util/utils";
import { AlgorithmName, ConstraintContainer, ALGORITHM_NAME_TO_LAYOUT_MAPPING } from "./constraint-container";
import _ from "lodash";
import { ElkForceAlgType } from "./elk/elk-constraints";


export type ConstraintedNodesGroupingsType = "ALL" | "GENERALIZATION" | "PROFILE";


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Old part of already deprecated config
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// There were 2 possibilities of how to represent the config from dialog as a type:
// 1) Flat structure
// 2) Hierarchy structure
// We chose flat structure (well not completely flat, we have generalization and whole model),
// because even though some of the info is specific only for some of the algorithms, a lot of it is shared
// and the idea is that class representing the main algorithm gets the user configuration from dialog and it is its responsibility to
// take only the relevant data and convert it to the implementation (based on used library) specific data
/**
 * @deprecated
 */
export interface UserGivenConstraints extends BasicUserGivenConstraints, UserGivenConstraintsChangingCodeFlow {}

/**
 * @deprecated
 */
export interface UserGivenConstraintsChangingCodeFlow {
    "process_general_separately": boolean,
    "double_run": boolean,
}

/**
 * @deprecated
 */
export interface BasicUserGivenConstraints {
        "main_layout_alg": AlgorithmName,
//                                            "profile-nodes-position-against-source": DIRECTION.DOWN,
        "main_alg_direction": DIRECTION,
        "layer_gap": number,
        "in_layer_gap": number,

        "stress_edge_len": number,

        "min_distance_between_nodes": number,
        "force_alg_type": ElkForceAlgType,

        "general_main_alg_direction": DIRECTION,
        "general_layer_gap": number,
        "general_in_layer_gap": number,
}


// TODO: Will need some parameters in the mapped function
export const CONSTRAINT_MAP: Record<string, (graph: IMainGraphClassic) => Promise<void>> = {
    "Anchor constraint": async () => {},
    "post-compactify": async () => {},
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// End of old already deprecated part config
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// We use 2 types of settings:
//     1) Configuration is the stuff strictly related to the algorithms - classic fields - min distance between nodes, some other parameters
// TODO: !!! Configuration internally uses constraint - therefore the split to main/general is completely unnecesary, we can just keep stacking objects
//                            and the need to split is not needed, just the dialog needs to add the "should_be_considered": true, "constraintedNodes": "ALL"
//                            (respectively the should_be_considered can be deducted from the fact that it is inside the list of objects or not)
//                            ... this is much more general and better .... but will we use it??? only If I want to override the settings somehow for group of nodes
//                            ... Keep it "simple" for now, I can always rewrite it to create more objects than the main, general!!!!!
//                            ... It starts making sense only if you add some "+" button which adds constraints, otherwise enumeration is enough
//


//     2) Constraints on the other hand can be related to algorithms (For example the anchoring), but can enforce some additional constraints on the nodes
//        Constraint is something very general it just has type, affected nodes and data, therefore configuration extends Constraint
//                - For example some nodes should be aligned, some other relations between nodes, it can be basically anything
//                - TODO:
//                -       Well everything but it has to be implemented into the algorithms, so ideally it should contain the actual code which solves the constraint
//                -       Well really I can't think of anything really useful except the aligning
//                -       Maybe we could think about the constraints as some post-fix??? or "in-iteration-fix" - for example some articles about the constraints -
//                -       had 1 iteration of the physical layout model followed by the constraints - this is closer to the d3.js approach



// There were 2 possibilities of how to represent the config from dialog as a type:
// 1) Flat structure
// 2) Hierarchy structure
// At first we chose the flat structure for the reason mentioned above (in the deprecated section)
// But me moved to the hierarchic structure for 3 reasons:
// a) We can then just iterate through the fields and process them - 1 field 1 constraint
// b) It makes it easier to extend
// c) We can have uniformity, before that we had to have for the general variant the same fields as for layered algorithm in main
//    but prefixed with general_ - for example "general_layer_gap" (On a side note - Now we allow the generalization edges to be separately processed by any algorithm)
// We pay fot it though, when using setState with nested object it gets more complicated than with flat object
export interface UserGivenAlgorithmConfigurationslVersion2 {
    // The information after & can be safely deducted from the field name
    main: UserGivenAlgorithmConfiguration & { "should_be_considered": true, "constraintedNodes": "ALL" },
    general: UserGivenAlgorithmConfigurationForGeneralization,
    // TODO: if we want to later have run limit
    // maxTime: number,
    // fixModel: [{
    //     modelId: string
    // }]
}


export interface UserGivenAlgorithmConfigurationLayered {
    "alg_direction": DIRECTION,
    "layer_gap": number,
    "in_layer_gap": number,
}

export interface UserGivenAlgorithmConfigurationStress {
    "stress_edge_len": number,
}

export interface UserGivenAlgorithmConfigurationElkForce {
    "min_distance_between_nodes": number,
    "force_alg_type": ElkForceAlgType,
}


export interface UserGivenAlgorithmConfigurationExtraData {
    "constraintedNodes": ConstraintedNodesGroupingsType,
    "should_be_considered": boolean,
}

// This actually only used so we type checking for the mapping from the universal parameter names to the library ones (for example to the elk ones)
export interface UserGivenAlgorithmConfigurationOnlyData extends UserGivenAlgorithmConfigurationLayered,
                                                                UserGivenAlgorithmConfigurationStress,
                                                                UserGivenAlgorithmConfigurationElkForce {
    "layout_alg": AlgorithmName,
}

export interface UserGivenAlgorithmConfiguration extends UserGivenAlgorithmConfigurationOnlyData, UserGivenAlgorithmConfigurationExtraData { }


export interface UserGivenAlgorithmConfigurationForGeneralization extends UserGivenAlgorithmConfiguration {
    "double_run": boolean,
    "constraintedNodes": "GENERALIZATION"
}

// TODO: getDefaultUserGivenAlgorithmConfiguration
export function getDefaultUserGivenAlgorithmConstraint(): Omit<UserGivenAlgorithmConfiguration, "constraintedNodes" | "should_be_considered"> {
    return {
        "layout_alg": "elk_stress",
    //  "profile-nodes-position-against-source": DIRECTION.DOWN,
        ...LayeredConfiguration.getDefaultObject(),
        "stress_edge_len": 600,

        "force_alg_type": "FRUCHTERMAN_REINGOLD",
        "min_distance_between_nodes": 100,
    }
}

export type ConstraintTime = "PRE-MAIN" | "IN-MAIN" | "POST-MAIN";

interface IConstraintType {
    name: string;
    constraintTime: ConstraintTime;
    type: string;
}

/**
 * Constraint on concrete set of nodes.
 */
export interface IConstraint extends IConstraintType {
    constraintedSubgraph: IGraphClassic;
    data: object;
}

/**
 * Constraint to fix group of nodes in position
 */
export class FixPositionConstraint implements IConstraint {
    constraintedSubgraph: IGraphClassic;
    data: undefined = undefined;
    name = "Anchor constraint";
    type = "ANCHOR";
    constraintTime: ConstraintTime = "PRE-MAIN";
}

/**
 * Constraint on predefined set of nodes.
 */
export interface IConstraintSimple extends IConstraintType {
    constraintedNodes: ConstraintedNodesGroupingsType,
    // TODO: modelID is part of data in case constaintedNodes === "MODEL", maybe just create interface IConstraintSimpleForModel, which extends this one
    //       which has modelID field
    data: object,
}

// TODO: Check IConstraintSimple for more info on modelID
// export interface IConstraintSimpleForModel extends IConstraintSimple {
//     constraintedNodes: "MODEL",
//     // modelID: string,
//     data: object,
// }

export interface IAlgorithmOnlyConstraint extends IConstraintSimple {
    algorithmName: AlgorithmName;
    // modelID: string | null;        // TODO: Is null in case it is meant for whole algorithm, model if for model
}

export class AlgorithmConfiguration implements IAlgorithmOnlyConstraint {
    algorithmName: AlgorithmName;
    constraintedNodes: ConstraintedNodesGroupingsType;
    data: object;
    type: string;
    name: string;
    constraintTime: ConstraintTime = "IN-MAIN";
    // modelID: string = undefined;        // TODO: For now just undefined no matter what, I am still not sure how will it work with models

    getAllConstraintKeys() {
        let constraintKeys = [
            "layout_alg"
        ];

        // TODO: Careful about this, right now it works, but I really don't know if I will use the double_run in future and where.
        if(this.constraintedNodes === "ALL") {
            return constraintKeys;
        }
        else {
            return constraintKeys.concat([
                "double_run"
            ]);
        }
    }

    constructor(algorithmName: AlgorithmName, constrainedNodes: ConstraintedNodesGroupingsType) {
        this.algorithmName = algorithmName;
        this.constraintedNodes = constrainedNodes;
        this.type = "ALG";
    }
}


/**
 * General Class which has all relevant constraints for the stress like algorithm. The classes extending this should convert the constraints into
 * the representation which will be used in the algorithm (that means renaming, transforming[, etc.] the parameters in the data field)
 */
export class StressConfiguration extends AlgorithmConfiguration {
    getAllConstraintKeys(): string[] {
        return super.getAllConstraintKeys().concat([
            "stress_edge_len",
        ]);
    }

    constructor(givenAlgorithmConstraints: UserGivenAlgorithmConfiguration) {
        super(givenAlgorithmConstraints.layout_alg, givenAlgorithmConstraints.constraintedNodes);
        this.data = _.pick(givenAlgorithmConstraints, this.getAllConstraintKeys()) as UserGivenAlgorithmConfigurationStress;
    }

    data: UserGivenAlgorithmConfigurationStress = undefined
}


export class LayeredConfiguration extends AlgorithmConfiguration {
    getAllConstraintKeys(): string[] {
        return super.getAllConstraintKeys().concat([
            "alg_direction",
            "layer_gap",
            "in_layer_gap"
        ]);
    }

    // TODO: Ideally just export this static function not the whole class, but it seems that it is possible only using aliasing
    static getDefaultObject(): UserGivenAlgorithmConfigurationLayered {
        return {
            "alg_direction": DIRECTION.UP,
            "layer_gap": 100,
            "in_layer_gap": 100
        }
    }
    constructor(givenAlgorithmConstraints: UserGivenAlgorithmConfiguration) {
        super(givenAlgorithmConstraints.layout_alg, givenAlgorithmConstraints.constraintedNodes);
        this.data = _.pick(givenAlgorithmConstraints, this.getAllConstraintKeys()) as UserGivenAlgorithmConfigurationLayered;
        // TODO: I guess that using lodash is just better
        // let {
        //     layout_alg,
        //     alg_direction,
        //     layer_gap,
        //     in_layer_gap,
        //     ...rest
        // } = givenAlgorithmConstraints;
        // this.data =
    }

    data: UserGivenAlgorithmConfigurationLayered = undefined;
}