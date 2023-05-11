import { join } from 'path';
import { parseCsvFromLocal } from '~/prisma/helper';
import {
  AreaByCollection,
  Collection,
  District,
  Province,
  Regency,
  Village,
} from '~/prisma/types';

/**
 * Get data from local CSV file.
 *
 * @param collection The collection name
 */
const getData = async <C extends Collection>(
  collection: C,
): Promise<AreaByCollection<C>[]> => {
  const filePath = join(__dirname, `../data/${collection}.csv`);
  const result = await parseCsvFromLocal<AreaByCollection<C>>(filePath, {
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
