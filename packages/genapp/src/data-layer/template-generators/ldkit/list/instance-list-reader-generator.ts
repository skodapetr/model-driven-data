import { LayerArtifact } from "../../../../engine/layer-artifact";
import { InstanceListLdkitReaderTemplate } from "./instance-list-reader-template";
import { TemplateConsumer, TemplateDependencyMap, TemplateMetadata } from "../../../../templates/template-consumer";
import { BaseListLdkitReaderGenerator } from "./base-list-reader-generator";

interface InstanceListLdkitReaderDependencyMap extends TemplateDependencyMap {
    ldkitSchemaArtifact: LayerArtifact,
    sparqlEndpointUri: string
}

function isInstanceListLdkitReaderDependencyList(obj: TemplateDependencyMap): obj is InstanceListLdkitReaderDependencyMap {
    return (obj as InstanceListLdkitReaderDependencyMap) !== undefined;
}

export class InstanceListLdkitReaderGenerator extends TemplateConsumer<InstanceListLdkitReaderTemplate> {

    constructor(templateMetadata: TemplateMetadata) {
        super(templateMetadata);
    }

    async processTemplate(dependencies: InstanceListLdkitReaderDependencyMap): Promise<LayerArtifact> {

        if (!dependencies || !isInstanceListLdkitReaderDependencyList(dependencies)) {
            throw new Error("Invalid dependencies list parameter.");
        }

        const baseLdkitListReaderArtifact = await new BaseListLdkitReaderGenerator().processTemplate();
        const listExportedObject = dependencies.aggregate.getAggregateNamePascalCase({
            suffix: "LdkitListReader"
        });

        const instanceListLdkitReaderTemplate: InstanceListLdkitReaderTemplate = {
            templatePath: this._templatePath,
            placeholders: {
                aggregate_name: listExportedObject,
                ldkit_endpoint_uri: `"${dependencies.sparqlEndpointUri}"`,
                ldkit_schema: dependencies.ldkitSchemaArtifact.exportedObjectName,
                ldkit_list_reader_base_class: baseLdkitListReaderArtifact.exportedObjectName,
                ldkit_list_reader_base_class_path: {
                    from: this._filePath,
                    to: baseLdkitListReaderArtifact.filePath
                },
                ldkit_schema_path: {
                    from: this._filePath,
                    to: dependencies.ldkitSchemaArtifact.filePath
                }
            }
        };

        const ldkitInstanceListReader: string = this._templateRenderer.renderTemplate(instanceListLdkitReaderTemplate);

        const readerInterfaceArtifact: LayerArtifact = {
            sourceText: ldkitInstanceListReader,
            exportedObjectName: listExportedObject,
            filePath: this._filePath,
            dependencies: [baseLdkitListReaderArtifact, dependencies.ldkitSchemaArtifact]
        }

        return readerInterfaceArtifact;
    }
}