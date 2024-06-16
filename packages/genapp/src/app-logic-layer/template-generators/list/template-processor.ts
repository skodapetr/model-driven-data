import { LayerArtifact } from "../../../engine/layer-artifact";
import { StageGenerationContext } from "../../../engine/generator-stage-interface";
import { ListCapabilityAppLayerTemplate } from "./list-app-layer-template";
import { ListReaderInterfaceGenerator } from "../../../data-layer/template-generators/reader-interface-generator";
import { ListResultReturnInterfaceGenerator } from "../../../capabilities/template-generators/capability-interface-generator";
import { TemplateMetadata } from "../../../templates/template-consumer";
import { ApplicationLayerTemplateDependencyMap } from "../app-layer-dependency-map";
import { ApplicationLayerTemplateGenerator } from "../template-app-layer-generator";

export class ListAppLayerTemplateProcessor extends ApplicationLayerTemplateGenerator<ListCapabilityAppLayerTemplate> {

    strategyIdentifier: string = "list-app-template-generator";

    constructor(templateMetadata: TemplateMetadata) {
        super(templateMetadata);
    }

    processTemplate(dependencies: ApplicationLayerTemplateDependencyMap): LayerArtifact {

        //const fullPath = this.artifactSaver ? this.artifactSaver.getFullSavePath(this._filePath) : this._filePath;
        const readerInterfaceArtifact = ListReaderInterfaceGenerator.processTemplate();
        
        if (!readerInterfaceArtifact.dependencies || readerInterfaceArtifact.dependencies.length === 0) {
            throw new Error("Reader interface expects at least one dependency artifact - return type of the read function.");
        }

        let listReturnTypeArtifact = readerInterfaceArtifact.dependencies.find(artifact => artifact.exportedObjectName === "ListResult");

        if (!listReturnTypeArtifact) {
            listReturnTypeArtifact = ListResultReturnInterfaceGenerator.processTemplate();
        }

        const listApplicationTemplate: ListCapabilityAppLayerTemplate = {
            templatePath: this._templatePath,
            placeholders: {
                list_reader_interface: readerInterfaceArtifact.exportedObjectName,
                read_return_type: listReturnTypeArtifact.exportedObjectName,
                read_return_type_path: {
                    from: this._filePath,
                    to: listReturnTypeArtifact.filePath
                },
                generated_capability_class: "GeneratedCapability",
                reader_implementation_path: {
                    from: "", //fullPath,
                    to: dependencies.dataLayerLinkArtifact.filePath
                },
                list_reader_interface_path: {
                    from: "", //fullPath,
                    to: readerInterfaceArtifact.filePath
                }
            }
        }

        const listAppLogicRender = this._templateRenderer.renderTemplate(listApplicationTemplate);

        const listAppLogicLayerArtifact: LayerArtifact = {
            exportedObjectName: "ListCapabilityLogic",
            filePath: this._filePath,
            sourceText: listAppLogicRender,
            dependencies: [readerInterfaceArtifact, listReturnTypeArtifact]
        }

        return listAppLogicLayerArtifact;
    }
}