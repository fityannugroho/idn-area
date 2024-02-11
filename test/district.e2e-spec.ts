import { District } from '@prisma/client';
import { AppTester } from './helper/app-tester';
import { districtRegex } from './helper/data-regex';
import { getEncodedSymbols } from './helper/utils';

describe('District (e2e)', () => {
  const baseUrl = '/districts';
  const testCode = '327325';
  const badDistrictCodes = ['', '1234', '1234567', 'abcdef'] as const;
  let tester: AppTester;

  beforeAll(async () => {
    tester = await AppTester.make();
    await tester.bootApp();
  });

  describe(`GET ${baseUrl}`, () => {
    it('should return districts', async () => {
      const districts = await tester.expectData<District[]>(baseUrl);

      districts.forEach((district) => {
        expect(district).toEqual({
          code: expect.stringMatching(districtRegex.code),
          name: expect.stringMatching(districtRegex.name),
          regencyCode: district.code.slice(0, 4),
        });
      });
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

      districts.forEach((district) => {
        expect(district).toEqual({
          code: expect.stringMatching(districtRegex.code),
          name: expect.stringMatching(new RegExp(testName, 'i')),
          regencyCode: district.code.slice(0, 4),
        });
      });
    });

    it('should return all districts match with the `regencyCode`', async () => {
      const regencyCode = '1101';
      const districts = await tester.expectData<District[]>(
        `${baseUrl}?regencyCode=${regencyCode}`,
      );

      districts.forEach((district) => {
        expect(district).toEqual({
          code: expect.stringMatching(districtRegex.code),
          name: expect.stringMatching(districtRegex.name),
          regencyCode,
        });
      });
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
      await tester.expectNotFound(`${baseUrl}/000000`);
    });

    it('should return the district with the `code`', async () => {
      const district = await tester.expectData<District>(
        `${baseUrl}/${testCode}`,
      );

      expect(district).toEqual({
        code: testCode,
        name: expect.stringMatching(districtRegex.name),
        regencyCode: testCode.slice(0, 4),
      });
    });
  });

  afterAll(async () => {
    await tester.closeApp();
  });
});
