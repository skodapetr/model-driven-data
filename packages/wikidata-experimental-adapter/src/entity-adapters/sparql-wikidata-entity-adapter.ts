import { RdfObject, RdfSourceWrap } from "@dataspecer/core/core/adapter/rdf";
import { PimResource } from "@dataspecer/core/pim/model";
import { LanguageString } from "@dataspecer/core/core";
import { RDFS, SCHEMA } from "../vocabulary";
import { IriProvider } from "@dataspecer/core/cim";

export async function loadWikidataEntityToResource(
  entity: RdfSourceWrap,
  idProvider: IriProvider,
  resource: PimResource
): Promise<void> {
  const prefLabel = await entity.property(RDFS.label);
  resource.pimHumanLabel = rdfObjectsToLanguageString(prefLabel);
  const definition = await entity.property(SCHEMA.description);
  resource.pimHumanDescription = rdfObjectsToLanguageString(definition);
  resource.pimInterpretation = entity.iri;
  resource.iri = idProvider.cimToPim(resource.pimInterpretation);
}

function rdfObjectsToLanguageString(objects: RdfObject[]): LanguageString {
  return Object.fromEntries(objects.map((o) => [o.language, o.value]));
}
