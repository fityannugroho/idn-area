import { join } from 'path';
import {
  AreaByCollection,
  Collection,
  District,
  Island,
  Province,
  Regency,
  Village,
} from '~/prisma/utils';
import { CsvParser } from '~/src/common/helper/csv-parser';

/**
 * Get data from local CSV file.
 *
 * @param collection The collection name
 */
const getData = async <C extends Collection>(
  collection: C,
): Promise<AreaByCollection<C>[]> => {
  const filePath = join(__dirname, `../data/${collection}.csv`);
  const result = await CsvParser.parse<AreaByCollection<C>>(filePath, {
    header: true,
  });

  return result.data;
};

/**
 * Check if a string is a number and has a specific length.
 *
 * @param value The string to be checked
 * @param digits The length of the string
 */
const isStrNumber = (value: string, digits?: number): value is string =>
  /^\d+$/.test(value) && (!digits || value.length === digits);

/**
 * Check if a string is a boolean ("true" or "false").
 *
 * @param value The string to be checked
 */
const isStrBoolean = (value: string): value is string =>
  ['true', 'false', '0', '1'].includes(value.toLowerCase());

/**
 * Check if the coordinate is valid.
 *
 * Valid format: `{a}°{b}'{c}" {d} {w}°{x}'{y}" {z}`
 * - `{a}` should be 2 digit integer from 00 to 90
 * - `{b}` should be 2 digit integer from 00 to 60
 * - `{c}` should be 2 digit integer with 2 decimal points from 00.00 to 60.00
 * - `{d}` should be N or S
 * - `{w}` should be 3 digit integer from 000 to 180
 * - `{x}` should be 2 digit integer from 00 to 60
 * - `{y}` should be 2 digit integer with 2 decimal points from 00.00 to 60.00
 * - `{z}` should be E or W
 *
 * Tested here: https://regex101.com/r/GQe8WT
 */
const isValidCoordinate = (coordinate: string) => {
  const regex =
    /^([0-8][0-9]|90)°([0-5][0-9]|60)'(([0-5][0-9].[0-9]{2})|60.00)"\s(N|S)\s(0\d{2}|1([0-7][0-9]|80))°([0-5][0-9]|60)'(([0-5][0-9].[0-9]{2})|60.00)"\s(E|W)$/;
  return regex.test(coordinate);
};

// Test provinces data
let provinces: Province[];

describe('provinces data', () => {
  beforeAll(async () => {
    provinces = await getData('provinces');
  });

  it('should be defined', () => {
    expect(provinces).toBeDefined();
  });

  it('should have valid code (2 digits number)', () => {
    const ids = provinces.map((province) => province.code);
    const validIds = ids.filter((id) => isStrNumber(id, 2));

    expect(ids).toEqual(validIds);
    expect(validIds.length).toBeGreaterThan(0);
  });

  it('should have unique code', () => {
    const ids = provinces.map((province) => province.code);
    const uniqueIds = [...new Set(ids)];

    expect(ids).toEqual(uniqueIds);
  });
});

// Test regencies data
let regencies: Regency[];

describe('regencies data', () => {
  beforeAll(async () => {
    regencies = await getData('regencies');
  });

  it('should be defined', () => {
    expect(regencies).toBeDefined();
  });

  it('should have valid code (4 digits number)', () => {
    const ids = regencies.map((regency) => regency.code);
    const validIds = ids.filter((id) => isStrNumber(id, 4));

    expect(ids).toEqual(validIds);
    expect(validIds.length).toBeGreaterThan(0);
  });

  it('should have unique code', () => {
    const ids = regencies.map((regency) => regency.code);
    const uniqueIds = [...new Set(ids)];

    expect(ids).toEqual(uniqueIds);
  });

  it('should have valid province code', () => {
    const provinceCodes = provinces.map((province) => province.code).sort();
    const uniqueRegencyProvinceCodes = [
      ...new Set(regencies.map((regency) => regency.province_code)),
    ].sort();

    expect(uniqueRegencyProvinceCodes).toEqual(provinceCodes);
  });
});

// Test districts data
let districts: District[];

describe('districts data', () => {
  beforeAll(async () => {
    districts = await getData('districts');
  });

  it('should be defined', () => {
    expect(districts).toBeDefined();
  });

  it('should have valid code (6 digits number)', () => {
    const ids = districts.map((district) => district.code);
    const validIds = ids.filter((id) => isStrNumber(id, 6));

    expect(ids).toEqual(validIds);
    expect(validIds.length).toBeGreaterThan(0);
  });

  it('should have unique code', () => {
    const ids = districts.map((district) => district.code);
    const uniqueIds = [...new Set(ids)];

    expect(ids).toEqual(uniqueIds);
  });

  it('should have valid regency code', () => {
    const regencyCodes = regencies.map((regency) => regency.code).sort();
    const uniqueDistrictRegencyCodes = [
      ...new Set(districts.map((district) => district.regency_code)),
    ].sort();

    expect(uniqueDistrictRegencyCodes).toEqual(regencyCodes);
  });
});

// Test villages data\
let villages: Village[];

describe('villages data', () => {
  beforeAll(async () => {
    villages = await getData('villages');
  });

  it('should be defined', () => {
    expect(villages).toBeDefined();
  });

  it('should have valid code (10 digits number)', () => {
    const ids = villages.map((village) => village.code);
    const validIds = ids.filter((id) => isStrNumber(id, 10));

    expect(ids).toEqual(validIds);
    expect(validIds.length).toBeGreaterThan(0);
  });

  it('should have unique code', () => {
    const ids = villages.map((village) => village.code);
    const uniqueIds = [...new Set(ids)];

    expect(ids).toEqual(uniqueIds);
  });

  it('should have valid district code', () => {
    const districtCodes = districts.map((district) => district.code).sort();
    const uniqueVillageDistrictCodes = [
      ...new Set(villages.map((village) => village.district_code)),
    ].sort();

    expect(uniqueVillageDistrictCodes).toEqual(districtCodes);
  });
});

// Test islands data
let islands: Island[];

describe('islands data', () => {
  beforeAll(async () => {
    islands = await getData('islands');
  });

  it('should be defined', () => {
    expect(islands).toBeDefined();
  });

  it('should have valid island object', () => {
    const regencyCodes = regencies.map((regency) => regency.code);
    const validIslands = islands.filter(
      (island) =>
        isStrNumber(island.code, 9) &&
        isStrNumber(island.regency_code, 4) &&
        regencyCodes.includes(island.regency_code) &&
        isValidCoordinate(island.coordinate) &&
        isStrBoolean(island.is_populated) &&
        isStrBoolean(island.is_outermost_small) &&
        !!island.name,
    );

    expect(islands).toEqual(validIslands);
    expect(validIslands.length).toBeGreaterThan(0);
  });

  it('should have unique code', () => {
    const codes = islands.map((island) => island.code);
    const uniqueIds = [...new Set(codes)];

    expect(codes).toEqual(uniqueIds);
  });
});
