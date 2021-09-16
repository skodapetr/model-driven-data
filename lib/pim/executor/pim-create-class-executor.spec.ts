import {CoreResourceReader, ReadOnlyMemoryStore} from "../../core";
import {PimCreateClass,PimCreateClassResult} from "../operation";
import {executePimCreateClass} from "./pim-create-class-executor";

test("Create class.", async () => {
  const operation = new PimCreateClass();
  operation.pimInterpretation = "class-type";
  operation.pimTechnicalLabel = "my-class";
  operation.pimHumanLabel = {"en": "Label"};
  operation.pimHumanDescription = {"en": "Desc"};

  const before = {
    "http://schema": {
      "iri": "http://schema",
      "types": ["pim-schema"],
      "pimParts": [],
    },
  };

  let counter = 0;
  const actual = await executePimCreateClass(
    wrapResourcesWithReader(before),
    () => "http://localhost/" + ++counter,
    operation);

  expect(actual.failed).toBeFalsy();
  expect(actual.created).toEqual({
    "http://localhost/1": {
      "iri": "http://localhost/1",
      "types": ["pim-class"],
      "pimInterpretation": operation.pimInterpretation,
      "pimTechnicalLabel": operation.pimTechnicalLabel,
      "pimHumanLabel": operation.pimHumanLabel,
      "pimHumanDescription": operation.pimHumanDescription,
      "pimExtends": [],
    },
  });
  expect(actual.changed).toEqual({
    "http://schema": {
      "iri": "http://schema",
      "types": ["pim-schema"],
      "pimParts": ["http://localhost/1"],
    },
  });
  expect(actual.deleted).toEqual([]);
  expect(PimCreateClassResult.is(actual.operationResult)).toBeTruthy();
  const result = actual.operationResult as PimCreateClassResult;
  expect(result.createdPimClass).toEqual("http://localhost/1");
});

function wrapResourcesWithReader(
  resources: { [iri: string]: any },
): CoreResourceReader {
  return ReadOnlyMemoryStore.create(resources);
}
