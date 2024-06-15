import { StageGenerationContext } from "../../../engine/generator-stage-interface";
import { LayerArtifact } from "../../../engine/layer-artifact";
import { ListTableTemplate } from "../../../template-interfaces/presentation/list-table-template";
import { TemplateConsumer, TemplateDependencyMap } from "../../../templates/template-consumer";
import { BaseArtifactSaver } from "../../../utils/artifact-saver";
import { PresentationLayerGenerator } from "../../presentation-layer-strategy-interface";

interface ListPresentationDependencyMap extends TemplateDependencyMap {
    listAppLogicArtifact: LayerArtifact;
}

export class ListTableTemplateGenerator extends TemplateConsumer<ListTableTemplate> implements PresentationLayerGenerator {

    strategyIdentifier: string = "list-table-react-generator";
    constructor({ templatePath, filePath }: {templatePath: string, filePath: string }) {
        super(
            templatePath,
            filePath
        );
    }
    
    generatePresentationLayer(context: StageGenerationContext): Promise<LayerArtifact> {
        if (!context.previousResult) {
            const errorArtifact: LayerArtifact = {
                filePath: "",
                exportedObjectName: "ErrorPage",
                sourceText: ""
            }

            return Promise.resolve(errorArtifact);
        }

        const presentationLayerArtifact = this.processTemplate({
            listAppLogicArtifact: context.previousResult
        });

        return Promise.resolve(presentationLayerArtifact);
    }
    
    processTemplate(dependencies: ListPresentationDependencyMap): LayerArtifact {

        const tableTemplate: ListTableTemplate = {
            templatePath: this._templatePath,
            placeholders: {
                list_capability_app_layer: dependencies.listAppLogicArtifact.exportedObjectName,
                list_app_layer_path: {
                    from: "ListTable" in BaseArtifactSaver.savedArtifactsMap ? BaseArtifactSaver.savedArtifactsMap["ListTable"] : this._filePath,
                    to: dependencies.listAppLogicArtifact.filePath
                }
            }
        };

        const presentationLayerRender = this._templateRenderer.renderTemplate(tableTemplate);

        return {
            exportedObjectName: "ListTable",
            filePath: this._filePath,
            sourceText: presentationLayerRender
        };
    }
}