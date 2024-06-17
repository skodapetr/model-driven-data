import { LayerArtifact } from "../../engine/layer-artifact";
import { TemplateDependencyMap } from "../../templates/template-consumer";
import { GeneratedFilePathCalculator } from "../../utils/artifact-saver";

export interface PresentationLayerDependencyMap extends TemplateDependencyMap {
    pathResolver: GeneratedFilePathCalculator,
    listAppLogicArtifact: LayerArtifact;
}