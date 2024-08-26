import { LayerArtifact } from "../engine/layer-artifact";
import { StageGenerationContext } from "../engine/generator-stage-interface";

export interface ApplicationLayerGenerator {
    strategyIdentifier: string;
    generateApplicationLayer(context: StageGenerationContext): Promise<LayerArtifact>;
}