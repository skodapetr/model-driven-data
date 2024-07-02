
/**
 * This configuration is not provided via the React context as we
 * do not support change witout applicaiton reload.
 *
 * The idea is to restrict use of context for things we do not
 * need to watch for.
 */
export interface Configuration {

  /**
   * When primary language is missing languages
   * in this list are used.
   *
   * When there is no language from this list we
   * we use anything.
   */
  languagePreferences: string[];

}

/**
 * Read comment for the Configuration interface above!
 */
export const configuration = () : Configuration => {
  return {
    "languagePreferences": ["en", "es", "de", "cs", "sk"]
  };
};
