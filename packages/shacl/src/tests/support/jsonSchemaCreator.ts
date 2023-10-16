import { structureModelToJsonSchema } from "../../../../json/src/json-schema/json-schema-model-adapter";
import {OutputStream} from "@dataspecer/core/io/stream/output-stream";
import * as Support from "./testSupport";
import {
    StructureModel,
    StructureModelClass,
    StructureModelType,
    StructureModelComplexType,
    StructureModelProperty,
    StructureModelPrimitiveType,
    StructureModelCustomType,
    StructureModelSchemaRoot,
  } from "@dataspecer/core/structure-model/model";
  import {
    assert,
    assertFailed,
    assertNot,
    defaultStringSelector,
    StringSelector,
  } from "@dataspecer/core/core";
  import { DataSpecificationArtefact } from "@dataspecer/core/data-specification/model";
  import { DataSpecificationSchema } from "@dataspecer/core/data-specification/model";
  import { DataSpecification } from "@dataspecer/core/data-specification/model/data-specification";
  import { DefaultJsonConfiguration } from "../../../../json/src/configuration";
  import { JsonConfiguration } from "../../../../json/src/configuration";
  import { ShaclAdapter } from "../../shacl-adapter";
  import  ModelCreator  from "./SimpleObjectModelCreator";
  import  ConceptualModelCreator  from "./conceptualModelCreator";
  import {ArtefactGenerator, ArtefactGeneratorContext, StructureClassLocation} from "@dataspecer/core/generator";
import { JsonSchema } from "../../../../json/src/json-schema/json-schema-model";
import { CoreResourceReader } from "@dataspecer/core/core/core-reader";
import { JsonLdGenerator } from "../../../../json/src/json-ld/json-ld-generator";
import { JsonSchemaGenerator } from "../../../../json/src/json-schema/json-schema-generator";
import {StreamDictionary} from "@dataspecer/core/io/stream/stream-dictionary";
import {MemoryStreamDictionary} from "@dataspecer/core/io/stream/memory-stream-dictionary";
import { MemoryOutputStream } from "@dataspecer/core/io/stream/memory-output-stream";
import { ConceptualModelClass } from "@dataspecer/core/conceptual-model";
import { writeJsonSchema } from "../../../../json/src/json-schema/json-schema-writer";
import * as path from 'path';


interface Context {
    /**
     * Active specification.
     */
    specification: DataSpecification;
  
    /**
     * All specifications.
     */
    specifications: { [iri: string]: DataSpecification };
  
    /**
     * String selector.
     */
    stringSelector: StringSelector;
  
    /**
     * Current structural model we are generating for.
     */
    model: StructureModel;
  
    artefact: DataSpecificationArtefact;
  
    configuration: JsonConfiguration;
  }

class JsonSchemaCreator{
    async createJsonSchema(smc : StructureModel ) : Promise<String> {
        const structureModelClass = new ModelCreator;
        const conceptualModelClass = new ConceptualModelCreator;
        const jsonconfig = DefaultJsonConfiguration;
        jsonconfig.dereferenceSchema = true;
        jsonconfig.jsonIdRequired
        const spec = new DataSpecification();
        spec.pim = "https://example.com/class1/mojePimIri";
        const jsonschemagen = new JsonSchemaGenerator();
        var artefact = new DataSpecificationSchema();
        artefact.psm = "https://example.com/class1/mojePimIri"
        artefact.outputPath = path.resolve("data-json-ld-generated.json");
        var customConfig = DefaultJsonConfiguration;
        customConfig.dereferenceSchema = true;
        artefact.configuration = customConfig;
        //console.log(artefact.outputPath);
        const output: StreamDictionary =  new MemoryStreamDictionary();
        const coreResourceReader : CoreResourceReader = {} as CoreResourceReader;
        const context: ArtefactGeneratorContext = {
            specifications: { ["https://example.com/class1/mojePimIri"]: spec },
            conceptualModels: { ["https://example.com/class1/mojePimIri"]: conceptualModelClass.createModel(), ["https://example.com/mojePimIriadresa"]: conceptualModelClass.createModel()},
            structureModels: { ["https://example.com/class1/mojePimIri"]: smc },
            reader: coreResourceReader,
            createGenerator(iri: string): Promise<ArtefactGenerator | null> { return null as any;},
            findStructureClass(iri: string): StructureClassLocation | null {return null}
          };

        const model = await jsonschemagen.generateToObject(context, artefact, spec);
        //const stream = output.writePath(artefact.outputPath);
        //assert((await output.exists(artefact.outputPath)).valueOf(), "dOESNT EXIST");

        const specification = new DataSpecification();
        specification.iri = "root;";
        const actual = structureModelToJsonSchema(
          { root: specification },
          specification,
          smc,
          DefaultJsonConfiguration,
          {} as DataSpecificationArtefact,
          defaultStringSelector
        );

//Snaha napsat generovani podle Stepanovy rady
const memoryStream = new MemoryStreamDictionary();
      jsonschemagen.generateToStream(context,artefact,specification,memoryStream);
      //await memoryStream.readPath().read();
      memoryStream.list();


        console.log("Model .... " + JSON.stringify(model, null, 2));
      console.log("Actual .... " + JSON.stringify(actual, null, 2));
      console.log(model);
      console.log(actual);
      const stream = new MemoryOutputStream();
      // FOR SCHEMA OUTPUT TO STDOUT
        await writeJsonSchema(actual, stream);
        //console.log(stream.getContent());
      // FOR JSONLD OUTPUT TO STDOUT
        Support.syncWriteFile('../data/schema.json', JSON.stringify(model, null, 2));
        await writeJsonLd(model, stream);
        await stream.close();
        const jsonSchemaGenerator = structureModelToJsonSchema({ ["https://example.com/class1/mojePimIri"]: spec }, spec, structureModelClass.createModel(), jsonconfig, new DataSpecificationArtefact());
        //return jsonSchemaGenerator;
        return JSON.stringify(model, null, 2);
    }
}

async function writeJsonLd(
    schema: object,
    stream: OutputStream
  ): Promise<void> {
    await stream.write(JSON.stringify(schema, undefined, 2));
    await stream.close();
  }

export default JsonSchemaCreator;