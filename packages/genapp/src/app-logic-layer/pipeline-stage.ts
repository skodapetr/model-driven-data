import { LayerArtifact } from "../engine/layer-artifact";
import { GeneratorStage, StageGenerationContext } from "../engine/generator-stage-interface";
import { ArtifactSaver, GeneratedFilePathCalculator } from "../utils/artifact-saver";
import { ApplicationLayerGenerator } from "./strategy-interface";

export class ApplicationLayerStage implements GeneratorStage {

    artifactSaver: ArtifactSaver;
    private readonly _applicationLayerGeneratorStrategy: ApplicationLayerGenerator;

    constructor(layerGeneratorStrategy: ApplicationLayerGenerator) {
        this.artifactSaver = new ArtifactSaver("/application-layer");
        this._applicationLayerGeneratorStrategy = layerGeneratorStrategy;
    }

    generateStage(context: StageGenerationContext): Promise<LayerArtifact> {
        context._.pathResolver = this.artifactSaver as GeneratedFilePathCalculator;
        const appLayerArtifact = this._applicationLayerGeneratorStrategy.generateApplicationLayer(context);

        return appLayerArtifact;
    }
}