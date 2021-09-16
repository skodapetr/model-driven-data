import {CoreResourceReader, ReadOnlyMemoryStore} from "../../core";
import {DataPsmCreateClass} from "../operation";
import {
  executeDataPsmCreateClass,
} from "./data-psm-create-class-executor";

test("Create data PSM class.", async () => {
  const operation = new DataPsmCreateClass();
  operation.dataPsmInterpretation = "class";
  operation.dataPsmTechnicalLabel = "name";
  operation.dataPsmHumanLabel = {"en": "Label"};
  operation.dataPsmHumanDescription = {"en": "Desc"};
  operation.dataPsmExtends = ["http://base"];

  const before = {
    "http://schema": {
      "iri": "http://schema",
      "types": ["data-psm-schema"],
      "dataPsmParts": ["http://base"],
    },
    "http://base": {
      "iri": "http://base",
      "types": ["data-psm-class"],
    },
  };

  let counter = 0;
  const actual = await executeDataPsmCreateClass(
    wrapResourcesWithReader(before),
    () => "http://localhost/" + ++counter,
    operation);

  expect(actual.failed).toBeFalsy();
  expect(actual.created).toEqual({
    "http://localhost/1": {
      "iri": "http://localhost/1",
      "types": ["data-psm-class"],
      "dataPsmInterpretation": operation.dataPsmInterpretation,
      "dataPsmTechnicalLabel": operation.dataPsmTechnicalLabel,
      "dataPsmHumanLabel": operation.dataPsmHumanLabel,
      "dataPsmHumanDescription": operation.dataPsmHumanDescription,
      "dataPsmExtends": operation.dataPsmExtends,
      "dataPsmParts": [],
    },
  });
  expect(actual.changed).toEqual({
    "http://schema": {
      "iri": "http://schema",
      "types": ["data-psm-schema"],
      "dataPsmParts": [
        "http://base", "http://localhost/1",
      ],
    },
  });
  expect(actual.deleted).toEqual([]);
});

function wrapResourcesWithReader(
  resources: { [iri: string]: any },
): CoreResourceReader {
  return ReadOnlyMemoryStore.create(resources);
}
