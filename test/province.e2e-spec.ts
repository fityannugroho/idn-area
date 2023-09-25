import { Province, Regency } from '@prisma/client';
import { AppTester } from './helper/app-tester';
import { provinceRegex, regencyRegex } from './helper/data-regex';

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

      provinces.forEach((province) => {
        expect(province).toEqual({
          code: expect.stringMatching(provinceRegex.code),
          name: expect.stringMatching(provinceRegex.name),
        });
      });
    });
  });

  describe(`GET ${baseUrl}?name={name}`, () => {
    it('should return 400 if the `name` is empty, less than 3 chars, more than 255 chars, or contains any symbols', async () => {
      const invalidNames = ['', 'ab', 'x'.repeat(256), 'j@wa'];

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
      const testName = 'jawa';
      const provinces = await tester.expectData<Province[]>(
        `${baseUrl}?name=${testName}`,
      );

      provinces.forEach((province) => {
        expect(province).toEqual({
          code: expect.stringMatching(provinceRegex.code),
          name: expect.stringMatching(new RegExp(testName, 'i')),
        });
      });
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

      expect(province).toEqual({
        code: testCode,
        name: expect.stringMatching(provinceRegex.name),
      });
    });
  });

  describe(`GET ${baseUrl}/{code}/regencies`, () => {
    it('should return 400 if the `code` is invalid', async () => {
      await tester.expectBadCode(
        (code) => `${baseUrl}/${code}/regencies`,
        badProvinceCodes,
      );
    });

    it('should return 400 if regencies sort query is invalid', async () => {
      await tester.expectBadSortQuery(
        (sortQueryStr) => `${baseUrl}/${testCode}/regencies?${sortQueryStr}`,
        ['', 'unknown'],
      );
    });

    it('should return all regencies from specific province', async () => {
      const regencies = await tester.expectData<Regency[]>(
        `${baseUrl}/${testCode}/regencies`,
      );

      regencies.forEach((regency) => {
        expect(regency).toEqual({
          code: expect.stringMatching(regencyRegex.code),
          name: expect.stringMatching(regencyRegex.name),
          provinceCode: testCode,
        });
      });
    });
  });

  afterAll(async () => {
    await tester.closeApp();
  });
});
