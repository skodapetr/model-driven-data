import { WdClassHierarchyDescOnly } from "../../wikidata-entities/wd-class";

export type WdDomainsOrRanges = 'domains' | 'ranges';
export type WdOwnOrInherited = 'own' | 'inherited';

export interface WdClassPropertyEndpointsResponseResults {
  readonly classes: WdClassHierarchyDescOnly[];
}

export interface WdGetClassPropertyEndpointsResponse {
  readonly results: WdClassPropertyEndpointsResponseResults;
}

export class WdClassPropertyEndpoints {
  readonly classes: WdClassHierarchyDescOnly[];

  constructor(response: WdGetClassPropertyEndpointsResponse) {
    this.classes = response.results.classes;
  }
}