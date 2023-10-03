import { District, Village } from '@prisma/client';
import { AppTester } from './helper/app-tester';
import { districtRegex, villageRegex } from './helper/data-regex';

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

    it("should return 400 if the `name` is empty, less than 3 chars, more than 255 chars, or contains any other symbols besides '()-./", async () => {
      const invalidNames = ['', 'ab', 'x'.repeat(256), 'b@ndung'];

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

  describe(`GET ${baseUrl}/{code}/villages`, () => {
    it('should return 400 if the `code` is invalid', async () => {
      await tester.expectBadCode(
        (code) => `${baseUrl}/${code}/villages`,
        badDistrictCodes,
      );
    });

    it('should return 400 if any villages sort query is invalid', async () => {
      await tester.expectBadSortQuery(
        (sortQueryStr) => `${baseUrl}?${sortQueryStr}`,
        ['', 'unknown'],
      );
    });

    it('should return 404 if the `code` does not exist', async () => {
      await tester.expectNotFound(`${baseUrl}/000000/villages`);
    });

    it('should return all villages in the district with the `code`', async () => {
      const villages = await tester.expectData<Village[]>(
        `${baseUrl}/${testCode}/villages`,
      );

      villages.forEach((village) => {
        expect(village).toEqual({
          code: expect.stringMatching(villageRegex.code),
          name: expect.stringMatching(villageRegex.name),
          districtCode: testCode,
        });
      });
    });
  });

  afterAll(async () => {
    await tester.closeApp();
  });
});
