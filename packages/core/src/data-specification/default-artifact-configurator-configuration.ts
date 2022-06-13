import {DataSpecificationArtefactBuilderConfiguration} from "./model/data-specification-artefact-builder-configuration";
import {CSV_SCHEMA} from "../csv-schema/csv-schema-vocabulary";
import {CsvSchemaGeneratorOptions} from "../csv-schema/csv-schema-generator-options";

type GeneratorOptions = {
  [CSV_SCHEMA.Generator]?: Partial<CsvSchemaGeneratorOptions>;
}

export class DefaultArtifactConfiguratorConfiguration extends DataSpecificationArtefactBuilderConfiguration {
  type = "http://dataspecer.com/vocabulary/artifact-builder-configuration/default";

  /**
   * Options for given generators. Key is the generator type IRI, value is its options object.
   */
  generatorOptions: GeneratorOptions = {};

  static is(configuration: DataSpecificationArtefactBuilderConfiguration): configuration is DefaultArtifactConfiguratorConfiguration {
    return configuration.type === "http://dataspecer.com/vocabulary/artifact-builder-configuration/default";
  }

  static create(from: Partial<DefaultArtifactConfiguratorConfiguration>): DefaultArtifactConfiguratorConfiguration {
    const configuration = new DefaultArtifactConfiguratorConfiguration();
    configuration.generatorOptions[CSV_SCHEMA.Generator] = CsvSchemaGeneratorOptions.getFromConfiguration(from?.generatorOptions?.[CSV_SCHEMA.Generator] ?? {});
    return configuration;
  }
}
