import{ JSONSchemaFaker } from "json-schema-faker";
import * as jsonld from 'jsonld';
import * as Support from "./testSupport";
import * as N3 from "n3";
import * as fs from "fs";

// TODO: Parsing raw Json data to Nquads changes simple decimal containing floating point to number containing exponent E, which is not a decimal number

  export async function generate(fileName : string) : Promise<String> {
    const schema = fs.readFileSync(fileName,
    { encoding: 'utf8', flag: 'r' });
    const json = JSON.parse(schema);
    JSONSchemaFaker.option({requiredOnly: true});
    const generatedJson = await JSONSchemaFaker.resolve(json);
    
    if(generatedJson == null){
      return "";
    } else {
      return JSON.stringify(generatedJson, null, 2);
    }
  }

  export async function fromRawJsonDataToNquads(rawJsonData : string, testType : string) : Promise<String> {
      const doc3 = rawJsonData;
      const context3 = fs.readFileSync('./src/tests/data/' + testType + 'Context.json',{ encoding: 'utf8', flag: 'r' });

      const compacted3 = context3.slice(0, -1) + "," + doc3.substr(1);

      const parsed = JSON.parse(compacted3);
      const nquads = await jsonld.toRDF(parsed, {format: 'application/n-quads'});
      const written = await Support.syncWriteFile("../data/" + testType + "FakeData.ttl", nquads);

      return nquads.toString();
  }

  export async function fromJsonToTurtle(rawJsonData : string, testType : string) : Promise<void> {
    const nquadsData = fromRawJsonDataToNquads(rawJsonData, testType);
    // TODO
     //UNQUOTE ONCE DECIMAL number changing into numbers containing exponent is resolved
    // Parsing Nquads to Turtle format from one file to other
      var access = fs.createWriteStream('./src/tests/data/' + testType + 'FakeDataTurtle.ttl');
      const streamParser = new N3.StreamParser({ format: 'application/n-quads' }),
      inputStream = fs.createReadStream('./src/tests/data/' + testType + 'FakeData.ttl'), 
      streamWriter = new N3.StreamWriter();
      inputStream.pipe(streamParser);
      streamParser.pipe(streamWriter);
      streamWriter.pipe(access);
    
    // End of enriching keys
  }

  export default generate;