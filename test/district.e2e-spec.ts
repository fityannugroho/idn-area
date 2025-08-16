import { District } from '@prisma/client';
import { AppTester } from './helper/app-tester';
import { extractProvinceCode, extractRegencyCode } from './helper/code-utils';
import {
  districtRegex,
  provinceRegex,
  regencyRegex,
} from './helper/data-regex';
import { getEncodedSymbols } from './helper/utils';

describe('District (e2e)', () => {
  const baseUrl = '/districts';
  const testCode = '32.73.25';
  const badDistrictCodes = ['', '12.34', '12.34.567', 'ab.cd.ef'] as const;
  let tester: AppTester;

  beforeAll(async () => {
    tester = await AppTester.make();
    await tester.bootApp();
  });

  describe(`GET ${baseUrl}`, () => {
    it('should return districts', async () => {
      const districts = await tester.expectData<District[]>(baseUrl);

      for (const district of districts) {
        expect(district).toEqual({
          code: expect.stringMatching(districtRegex.code),
          name: expect.stringMatching(districtRegex.name),
          regencyCode: extractRegencyCode(district.code),
        });
      }
    });

    it("should return 400 if the `name` is more than 100 chars, or contains any other symbols besides '()-./", async () => {
      const invalidNames = [
        'x'.repeat(101),
        ...getEncodedSymbols({ exclude: '()-./' }),
      ];

      for (const name of invalidNames) {
        await tester.expectBadRequest(`${baseUrl}?name=${name}`);
      }
    });

    it('should return 400 if any district sort query is invalid', async () => {
      await tester.expectBadSortQuery(
        (sortQueryStr) => `${baseUrl}?${sortQueryStr}`,
        ['', 'unknown'],
      );
    });

    it('should return empty array if there are no any districts match with the `name`', async () => {
      const districts = await tester.expectData<District[]>(
        `${baseUrl}?name=unknown`,
      );

      expect(districts).toEqual([]);
    });

    it('should return all districts match with the `name`', async () => {
      const testName = 'bandung';
      const districts = await tester.expectData<District[]>(
        `${baseUrl}?name=${testName}`,
      );

      for (const district of districts) {
        expect(district).toEqual({
          code: expect.stringMatching(districtRegex.code),
          name: expect.stringMatching(new RegExp(testName, 'i')),
          regencyCode: extractRegencyCode(district.code),
        });
      }
    });

    it('should return all districts match with the `regencyCode`', async () => {
      const regencyCode = '11.01';
      const districts = await tester.expectData<District[]>(
        `${baseUrl}?regencyCode=${regencyCode}`,
      );

      for (const district of districts) {
        expect(district).toEqual({
          code: expect.stringMatching(districtRegex.code),
          name: expect.stringMatching(districtRegex.name),
          regencyCode,
        });
      }
    });
  });

  describe(`GET ${baseUrl}/{code}`, () => {
    it('should return 400 if the `code` is invalid', async () => {
      await tester.expectBadCode(
        (code) => `${baseUrl}/${code}`,
        badDistrictCodes,
      );
    });

    it('should return 404 if the `code` does not exist', async () => {
      await tester.expectNotFound(`${baseUrl}/00.00.00`);
    });

    it('should return the district with the `code`', async () => {
      const district = await tester.expectData<District>(
        `${baseUrl}/${testCode}`,
      );

      expect(district).toEqual({
        code: testCode,
        name: expect.stringMatching(districtRegex.name),
        regencyCode: extractRegencyCode(testCode),
        parent: {
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
