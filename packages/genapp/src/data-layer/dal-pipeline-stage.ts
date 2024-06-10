import { GeneratorStage, type StageGenerationContext } from "../engine/generator-stage-interface";
import { ArtifactSaver } from "../utils/artifact-saver";
import { LayerArtifact, isLayerArtifact } from "../engine/layer-artifact";
import { DalGeneratorStrategy } from "./dal-generator-strategy-interface";
import { LDKitDalGenerator } from "./strategies/ldkit-strategy";
import { DataSourceType, DatasourceConfig } from "../application-config";
import { FileDalGeneratorStrategy } from "./strategies/file-dal-strategy";
import { LocalStorageDalGeneratorStrategy } from "./strategies/localstorage-dal-strategy";

export type DataAccessLayerGeneratorFactory = {
    getDalGeneratorStrategy: (datasourceConfig: DatasourceConfig) => DalGeneratorStrategy;
}

export class DataLayerGeneratorStage implements GeneratorStage {

    artifactSaver: ArtifactSaver;
    private readonly _dalGeneratorStrategy: DalGeneratorStrategy;
    private readonly _datasourceConfig: DatasourceConfig;
    private readonly dalGeneratorFactory: DataAccessLayerGeneratorFactory = {

        getDalGeneratorStrategy(datasourceConfig: DatasourceConfig): DalGeneratorStrategy {
            const generators = {
                [DataSourceType.Rdf]: new LDKitDalGenerator(datasourceConfig),
                [DataSourceType.Json]: new FileDalGeneratorStrategy("json"),
                [DataSourceType.Xml]: new FileDalGeneratorStrategy("xml"),
                [DataSourceType.Csv]: new FileDalGeneratorStrategy("csv"),
                [DataSourceType.Local]: new LocalStorageDalGeneratorStrategy()
            };
    
            const generator = generators[datasourceConfig.format];
    
            if (!generator) {
                throw new Error("No matching data layer generator has been found!");
            }
    
            return generator;
        }
    }

    constructor(datasourceConfig: DatasourceConfig, dalGeneratorFactory?: DataAccessLayerGeneratorFactory) {
        if (dalGeneratorFactory) {
            this.dalGeneratorFactory = dalGeneratorFactory;
        }

        this._datasourceConfig = datasourceConfig;
        this._dalGeneratorStrategy = this.dalGeneratorFactory.getDalGeneratorStrategy(datasourceConfig);
        this.artifactSaver = new ArtifactSaver("/data-layer");
    }

    async generateStage(context: StageGenerationContext): Promise<LayerArtifact> {

        if (this._datasourceConfig.format !== DataSourceType.Local) {
            context._.sparqlEndpointUri = this._datasourceConfig.endpointUri;
        }

        const dalArtifact = await this._dalGeneratorStrategy.generateDataLayer(context);

        if (!isLayerArtifact(dalArtifact)) {
            throw new Error("Could not generate application data layer");
        }
        
        return dalArtifact as LayerArtifact;
    }
}