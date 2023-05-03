import { createReadStream } from 'fs';
import * as Papa from 'papaparse';
import { Areas, District, Regency, Village } from './types';

export const isRegency = (area: Areas): area is Regency =>
  'province_code' in area;

export const isDistrict = (area: Areas): area is District =>
  'regency_code' in area;

export const isVillage = (area: Areas): area is Village =>
  'district_code' in area;

/**
 * Parse CSV from local file.
 *
 * @param path Path to the CSV file.
 * @param onComplete The callback function that will be called when the parsing is complete.
 * @param config The configuration for the parser.
 */
export const parseCsvFromLocal = <T = any>(
  path: string,
  onComplete?: (result: Papa.ParseResult<T>) => void,
  config?: Omit<Papa.ParseLocalConfig<T, Papa.LocalFile>, 'complete'>,
) => {
  const sourceFile = createReadStream(path);

  Papa.parse<T>(sourceFile, {
    header: true,
    complete: onComplete,
    ...config,
  });
};
