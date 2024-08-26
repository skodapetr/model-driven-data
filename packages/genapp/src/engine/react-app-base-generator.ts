import { LayerArtifact } from "./layer-artifact";
import { ImportRelativePath, TemplateDescription } from "./eta-template-renderer";
import { TemplateConsumer, TemplateDependencyMap, TemplateMetadata } from "../templates/template-consumer";
import { CopyTemplateProcessor } from "../capabilities/template-generators/capability-interface-generator";
import { SidebarComponentTemplateProcessor } from "../presentation-layer/template-generators/sidebar-template.processor";

interface ReactAppBaseTemplate extends TemplateDescription {
    placeholders: {
        error_component_name: string,
        error_component_path: ImportRelativePath,
        main_component: string,
        main_component_path: ImportRelativePath,
        page_template_component: string,
        page_template_component_path: ImportRelativePath,
        import_statements: string[],
        artifacts_map: AggregateCapabilitiesReactRouteComponentsMap
    }
}

export type ReactRouteComponentDescription = {
    componentName: string,
    props: { [propName: string]: string }
    relativePath: string
}

export type AggregateCapabilitiesReactRouteComponentsMap = {
    [aggregateName: string]: {
        [capabilityName: string]: ReactRouteComponentDescription
    }
}


interface ReactAppBaseTemplateDependencyMap extends TemplateDependencyMap {
    artifacts: AggregateCapabilitiesReactRouteComponentsMap
}

export class ReactApplicationBaseGenerator extends TemplateConsumer<ReactAppBaseTemplate> {

    // <% for (let aggregateName in it.artifacts_map) { %><% for (let capabilityName in it.artifacts_map[aggregateName]) { %><% let item = it.artifacts_map[aggregateName][capabilityName] %>
    //     import <%= item.componentName %> from <%~ item.filepath %>;<% } %><% } %>
    constructor(templateMetadata: TemplateMetadata) {
        super(templateMetadata)
    }

    private getImportStatements(artifactsMap: AggregateCapabilitiesReactRouteComponentsMap): Set<string> {

        const importStatements = Object.values(artifactsMap)
            .reduce<string[]>((acc, capabilityArtifactsMap) => {
                const aggregateImports = Object.values(capabilityArtifactsMap)
                    .map(artifact => `import ${artifact.componentName} from "${artifact.relativePath}";`);
                return acc.concat(aggregateImports);
            }, []);

        return new Set<string>(importStatements);
    }

    processTemplate(dependencies: ReactAppBaseTemplateDependencyMap): LayerArtifact {

        const errorPageArtifact = new CopyTemplateProcessor({
            filePath: "./ErrorPage.tsx",
            templatePath: "./scaffolding/ErrorPage",
            queryExportedObjectName: "ErrorPage"
        }).processTemplate();

        const mainComponentArtifact = new CopyTemplateProcessor({
            templatePath: "./scaffolding/Main",
            filePath: "./Main.tsx",
            queryExportedObjectName: "Main"
        }).processTemplate();

        const pageTemplateComponentArtifact = new CopyTemplateProcessor({
            templatePath: "./scaffolding/PageTemplate",
            filePath: "./PageTemplate.tsx",
            queryExportedObjectName: "PageTemplate"
        }).processTemplate();

        const sidebarComponentArtifact = new SidebarComponentTemplateProcessor({
            filePath: "./Sidebar.tsx",
            templatePath: "./scaffolding/Sidebar"
        }).processTemplate({ aggregateCapabilitiesMap: dependencies.artifacts });

        let toCopy: LayerArtifact[] = [];
        ["Content", "Footer", "TopBar", "index"].forEach(name => {
            const componentArtifact = new CopyTemplateProcessor({
                templatePath: `./scaffolding/${name}`,
                filePath: `./${name}.tsx`,
                queryExportedObjectName: name
            }).processTemplate();

            toCopy.push(componentArtifact);
        });

        toCopy = toCopy.concat([
            {
                templatePath: "./scaffolding/index_css",
                filePath: "./index.css",
                queryExportedObjectName: "index.css"
            },
            {
                templatePath: "./scaffolding/App_css",
                filePath: "./App.css",
                queryExportedObjectName: "App.css",
            },
            {
                templatePath: "./scaffolding/package",
                filePath: "../package.json",
                queryExportedObjectName: "package"
            },
            {
                templatePath: "./scaffolding/tsconfig",
                filePath: "../tsconfig.json",
                queryExportedObjectName: "tsconfig"
            },
            {
                templatePath: "./scaffolding/reportWebVitals",
                filePath: "./reportWebVitals.ts",
                queryExportedObjectName:  "reportWebVitals"
            }
        ].map(templateMetadata => new CopyTemplateProcessor(templateMetadata).processTemplate())
        );

        const reactAppComponentTemplate: ReactAppBaseTemplate = {
            templatePath: this._templatePath,
            placeholders: {
                artifacts_map: dependencies.artifacts,
                import_statements: [...this.getImportStatements(dependencies.artifacts)],
                error_component_path: {
                    from: this._filePath,
                    to: errorPageArtifact.filePath
                },
                page_template_component: pageTemplateComponentArtifact.exportedObjectName,
                page_template_component_path: {
                    from: this._filePath,
                    to: pageTemplateComponentArtifact.filePath
                },
                error_component_name: errorPageArtifact.exportedObjectName,
                main_component: mainComponentArtifact.exportedObjectName,
                main_component_path: {
                    from: this._filePath,
                    to: mainComponentArtifact.filePath
                }
            }
        };
        const render = this._templateRenderer.renderTemplate(reactAppComponentTemplate);

        const layerArtifact: LayerArtifact = {
            exportedObjectName: "App",
            filePath: this._filePath,
            sourceText: render,
            dependencies: [
                errorPageArtifact,
                mainComponentArtifact,
                pageTemplateComponentArtifact,
                sidebarComponentArtifact,
                ...toCopy
            ]
        }

        return layerArtifact;
    }
}