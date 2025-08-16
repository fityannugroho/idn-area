import { Village } from '@prisma/client';
import { AppTester } from './helper/app-tester';
import {
  extractDistrictCode,
  extractProvinceCode,
  extractRegencyCode,
} from './helper/code-utils';
import {
  districtRegex,
  provinceRegex,
  regencyRegex,
  villageRegex,
} from './helper/data-regex';
import { getEncodedSymbols } from './helper/utils';

describe('Village (e2e)', () => {
  const baseUrl = '/villages';
  const testCode = '32.04.05.2004';
  const badVillageCodes = [
    '',
    '12.34',
    '12.34.56.78910',
    'ab.cd.ef.ghij',
  ] as const;
  let tester: AppTester;

  beforeAll(async () => {
    tester = await AppTester.make();
    await tester.bootApp();
  });

  describe(`GET ${baseUrl}`, () => {
    it('should return villages', async () => {
      const villages = await tester.expectData<Village[]>(baseUrl);

      for (const village of villages) {
        expect(village).toEqual({
          code: expect.stringMatching(villageRegex.code),
          name: expect.stringMatching(villageRegex.name),
          districtCode: extractDistrictCode(village.code),
        });
      }
    });

    it('should return 400 if the `name` more than 100 chars, or contains any other symbols besides \'()-./"*', async () => {
      const invalidNames = [
        'x'.repeat(101),
        ...getEncodedSymbols({ exclude: '\'()-./"*' }),
      ];

      for (const name of invalidNames) {
        await tester.expectBadRequest(`${baseUrl}?name=${name}`);
      }
    });

    it('should return 400 if any village sort query is invalid', async () => {
      await tester.expectBadSortQuery(
        (sortQueryStr) => `${baseUrl}?${sortQueryStr}`,
        ['', 'unknown'],
      );
    });

    it('should return empty array if there are no any villages match with the `name`', async () => {
      const villages = await tester.expectData<Village[]>(
        `${baseUrl}?name=unknown`,
      );

      expect(villages).toEqual([]);
    });

    it('should return all villages match with the `name`', async () => {
      const testName = 'cinunuk';
      const villages = await tester.expectData<Village[]>(
        `${baseUrl}?name=${testName}`,
      );

      for (const village of villages) {
        expect(village).toEqual({
          code: expect.stringMatching(villageRegex.code),
          name: expect.stringMatching(new RegExp(testName, 'i')),
          districtCode: extractDistrictCode(village.code),
        });
      }
    });

    it('should return all villages match with the `districtCode`', async () => {
      const districtCode = '11.01.01';
      const villages = await tester.expectData<Village[]>(
        `${baseUrl}?districtCode=${districtCode}`,
      );

      for (const village of villages) {
        expect(village).toEqual({
          code: expect.stringMatching(villageRegex.code),
          name: expect.stringMatching(villageRegex.name),
          districtCode,
        });
      }
    });
  });

  describe(`GET ${baseUrl}/{code}`, () => {
    it('should return 400 if the `code` is invalid', async () => {
      await tester.expectBadCode(
        (code) => `${baseUrl}/${code}`,
        badVillageCodes,
      );
    });

    it('should return 404 if the `code` does not exist', async () => {
      await tester.expectNotFound(`${baseUrl}/00.00.00.0000`);
    });

    it('should return the village data if the `code` exists', async () => {
      const village = await tester.expectData<Village>(
        `${baseUrl}/${testCode}`,
      );

      expect(village).toEqual({
        code: testCode,
        name: expect.stringMatching(villageRegex.name),
        districtCode: extractDistrictCode(testCode),
        parent: {
          district: {
            code: extractDistrictCode(testCode),
            name: expect.stringMatching(districtRegex.name),
            regencyCode: extractRegencyCode(testCode),
          },
          regency: {
            code: extractRegencyCode(testCode),
            name: expect.stringMatching(regencyRegex.name),
            provinceCode: extractProvinceCode(testCode),
          },
          province: {
            code: extractProvinceCode(testCode),
            name: expect.stringMatching(provinceRegex.name),
          },
        },
      });
    });
  });

  afterAll(async () => {
    await tester.closeApp();
  });
});
