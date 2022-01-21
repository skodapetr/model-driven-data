import {
  DataSpecification,
} from "../data-specification/model";
import {assertNot, CoreResourceReader} from "../core";
import {StreamDictionary} from "../io/stream/stream-dictionary";
import {ArtefactGenerator} from "./artefact-generator";
import {BikeshedGenerator} from "../bikeshed/bikeshed-generator";
import {ArtefactGeneratorContext} from "./artefact-generator-context";
import {coreResourcesToConceptualModel} from "../conceptual-model";
import {coreResourcesToStructuralModel} from "../structure-model";
import {JsonSchemaGenerator} from "../json-schema/json-schema-generator";

export class Generator {

  private readonly specifications: { [iri: string]: DataSpecification } = {};

  private readonly reader: CoreResourceReader;

  private readonly generators: { [iri: string]: ArtefactGenerator } = {};

  constructor(
    specifications: DataSpecification[],
    reader: CoreResourceReader,
  ) {
    for (const specification of specifications) {
      this.specifications[specification.iri] = specification;
    }
    this.reader = reader;
  }

  public async initializeGenerators(): Promise<void> {
    const generators = [
      new BikeshedGenerator(),
      new JsonSchemaGenerator(),
    ];
    for (const generator of generators) {
      this.generators[generator.identifier()] = generator;
    }
  }

  public async generate(
    specificationIri: string,
    output: StreamDictionary,
  ): Promise<void> {
    const specification = this.specifications[specificationIri];
    assertNot(
      specification == undefined,
      `Missing specification ${specificationIri}`);
    const context = await this.createContext();
    for (const artefact of specification.artefacts) {
      const generator = this.generators[artefact.generator];
      assertNot(
        generator == undefined,
        `Missing generator ${artefact.generator}`);
      await generator.generateToStream(
        context, artefact, specification, output);
    }
  }

  private async createContext(): Promise<ArtefactGeneratorContext> {
    const conceptualModels = {};
    const structureModels = {};
    for (const specification of Object.values(this.specifications)) {
      conceptualModels[specification.pim] =
        await coreResourcesToConceptualModel(this.reader, specification.pim);
      for (const iri of specification.psms) {
        structureModels[iri] =
          await coreResourcesToStructuralModel(this.reader, iri);
      }
    }
    return {
      "reader": this.reader,
      "specifications": this.specifications,
      "conceptualModels": conceptualModels,
      "structureModels": structureModels,
      "createGenerator": (iri, type) =>
        Promise.resolve(this.generators[iri] ?? null),
    };
  }

}