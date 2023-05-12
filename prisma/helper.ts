import { createReadStream } from 'fs';
import * as Papa from 'papaparse';

/**
 * Parse CSV from local file asynchronously.
 *
 * @param path Path to the CSV file.
 * @param config The configuration for the parser.
 */
export const parseCsvFromLocal = <T = any>(
  path: string,
  config?: Omit<Papa.ParseLocalConfig<T, Papa.LocalFile>, 'complete' | 'error'>,
): Promise<Papa.ParseResult<T>> => {
  const sourceFile = createReadStream(path);

  return new Promise<Papa.ParseResult<T>>((resolve, reject) => {
    Papa.parse<T>(sourceFile, {
      ...config,
      complete: resolve,
      error: reject,
    });
  });
};
