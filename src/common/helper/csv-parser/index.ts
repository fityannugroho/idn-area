import { createReadStream } from 'fs';
import * as Papa from 'papaparse';

type ParserConfig<T = any> = Omit<
  Papa.ParseLocalConfig<T, Papa.LocalFile>,
  'complete' | 'error'
>;

export class CsvParser<T = any> {
  readonly defaultConfig?: ParserConfig<T>;

  /**
   * Create a new instance of CsvHelper.
   * @param defaultConfig The default options
   */
  constructor(defaultConfig?: ParserConfig<T>) {
    this.defaultConfig = defaultConfig;
  }

  /**
   * Parse CSV file asynchronously.
   *
   * @param path Path to the CSV file.
   * @param config The configuration for the parser.
   */
  static parse<T = any>(
    path: string,
    config?: ParserConfig<T>,
  ): Promise<Papa.ParseResult<T>> {
    const sourceFile = createReadStream(path);

    return new Promise<Papa.ParseResult<T>>((resolve, reject) => {
      Papa.parse<T>(sourceFile, {
        ...config,
        complete: resolve,
        error: reject,
      });
    });
  }

  /**
   * Parse CSV file asynchronously.
   *
   * @param path Path to the CSV file.
   * @param config The configuration for the parser.
   */
  async parse<U extends T = T>(
    path: string,
    config?: ParserConfig<U>,
  ): Promise<Papa.ParseResult<U>> {
    return await CsvParser.parse<U>(path, {
      ...(this.defaultConfig ?? {}),
      ...config,
    });
  }
}
