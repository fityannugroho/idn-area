import { Province } from '@prisma/client';
import { AppTester } from './helper/app-tester';
import { provinceRegex } from './helper/data-regex';
import { expectIdFromMongo, getEncodedSymbols } from './helper/utils';

describe('Province (e2e)', () => {
  const baseUrl = '/provinces';
  const testCode = '32';
  const badProvinceCodes = ['', '1', '123', 'ab'] as const;
  let tester: AppTester;

  beforeAll(async () => {
    tester = await AppTester.make();
    await tester.bootApp();
  });

  describe(`GET ${baseUrl}`, () => {
    it('should return 400 if any provinces sort query is invalid', async () => {
      await tester.expectBadSortQuery(
        (sortQueryStr) => `${baseUrl}?${sortQueryStr}`,
        ['', 'unknown'],
      );
    });

    it('should return all provinces', async () => {
      const provinces = await tester.expectData<Province[]>(baseUrl);

      for (const province of provinces) {
        expect(province).toEqual(
          expectIdFromMongo({
            code: expect.stringMatching(provinceRegex.code),
            name: expect.stringMatching(provinceRegex.name),
          }),
        );
      }
    });
  });

  describe(`GET ${baseUrl}?name={name}`, () => {
    it('should return 400 if the `name` is more than 100 chars, or contains any symbols', async () => {
      const invalidNames = ['x'.repeat(101), ...getEncodedSymbols()];

      for (const name of invalidNames) {
        await tester.expectBadRequest(`${baseUrl}?name=${name}`);
      }
    });

    it('should return empty array if there are no any provinces match with the `name`', async () => {
      const provinces = await tester.expectData<Province[]>(
        `${baseUrl}?name=unknown`,
      );

      expect(provinces).toEqual([]);
    });

    it('should return array of provinces that match with the `name`', async () => {
      const testName = 'jawa barat';
      const provinces = await tester.expectData<Province[]>(
        `${baseUrl}?name=${testName}`,
      );

      for (const province of provinces) {
        expect(province).toEqual(
          expectIdFromMongo({
            code: expect.stringMatching(provinceRegex.code),
            name: expect.stringMatching(new RegExp(testName, 'i')),
          }),
        );
      }
    });
  });

  describe(`GET ${baseUrl}/{code}`, () => {
    it('should return 400 if the `code` is invalid', async () => {
      await tester.expectBadCode(
        (code) => `${baseUrl}/${code}`,
        badProvinceCodes,
      );
    });

    it('should return 404 if the `code` does not exists', async () => {
      await tester.expectNotFound(`${baseUrl}/00`);
    });

    it('should return a province that match with the `code`', async () => {
      const province = await tester.expectData<Province>(
        `${baseUrl}/${testCode}`,
      );

      expect(province).toEqual(
        expectIdFromMongo({
          code: testCode,
          name: expect.stringMatching(provinceRegex.name),
        }),
      );
    });
  });

  afterAll(async () => {
    await tester.closeApp();
  });
});
