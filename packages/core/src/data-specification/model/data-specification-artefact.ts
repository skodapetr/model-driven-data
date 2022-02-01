export class DataSpecificationArtefact {

  iri: string | null = null;

  name: string | null = null;

  /**
   * Determine type of the artefact.
   */
  type: string;

  /**
   * Output path in the file system, se to null to not generate this artefact
   * directly. It can still be used for reference or generated by a generator.
   */
  outputPath: string | null = null;

  /**
   * URL of the published document.
   */
  publicUrl: string | null = null;

  /**
   * Identification of a generator that is used to produce given
   * artefact.
   */
  generator: string | null = null;

  /**
   * Configuration for given generator. While no strict restriction are forced
   * on the configuration values, it is recommended to use primitive values
   * as they are easier to convert to various representations.
   */
  configuration: { [key: string]: unknown } | null = null;

}
