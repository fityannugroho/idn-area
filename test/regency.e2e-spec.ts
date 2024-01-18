import { Regency } from '@prisma/client';
import { AppTester } from './helper/app-tester';
import { regencyRegex } from './helper/data-regex';

describe('Regency (e2e)', () => {
  const baseUrl = '/regencies';
  const testCode = '3273';
  const badRegencyCodes = ['', '123', '12345', 'abcd'] as const;
  let tester: AppTester;

  beforeAll(async () => {
    tester = await AppTester.make();
    await tester.bootApp();
  });

  describe(`GET ${baseUrl}`, () => {
    it('should return regencies', async () => {
      const regencies = await tester.expectData<Regency[]>(baseUrl);

      regencies.forEach((regency) => {
        expect(regency).toEqual({
          code: expect.stringMatching(regencyRegex.code),
          name: expect.stringMatching(regencyRegex.name),
          provinceCode: expect.stringMatching(regencyRegex.provinceCode),
        });
      });
    });

    it('should return 400 if the `name` is more than 100 chars, or contains any symbols', async () => {
      const invalidNames = ['x'.repeat(101), 'b@ndung'];

      for (const name of invalidNames) {
        await tester.expectBadRequest(`${baseUrl}?name=${name}`);
      }
    });

    it('should return 400 if any regency sort query is invalid', async () => {
      await tester.expectBadSortQuery(
        (sortQueryStr) => `${baseUrl}?${sortQueryStr}`,
        ['', 'unknown'],
      );
    });

    it('should return empty array if there are no any regencies match with the `name`', async () => {
      const regencies = await tester.expectData<Regency[]>(
        `${baseUrl}?name=unknown`,
      );

      expect(regencies).toEqual([]);
    });

    it('should return all regencies match with the `name`', async () => {
      const testName = 'bandung';
      const regencies = await tester.expectData<Regency[]>(
        `${baseUrl}?name=${testName}`,
      );

      regencies.forEach((regency) => {
        expect(regency).toEqual({
          code: expect.stringMatching(regencyRegex.code),
          name: expect.stringMatching(new RegExp(testName, 'i')),
          provinceCode: expect.stringMatching(regencyRegex.provinceCode),
        });
      });
    });
  });

  describe(`GET ${baseUrl}/{code}`, () => {
    it('should return 400 if the `code` is invalid', async () => {
      await tester.expectBadCode(
        (code) => `${baseUrl}/${code}`,
        badRegencyCodes,
      );
    });

    it('should return 404 if the `code` does not match with any regency', async () => {
      await tester.expectNotFound(`${baseUrl}/0000`);
    });

    it('should return a regency that match with the `code`', async () => {
      const regency = await tester.expectData<Regency>(
        `${baseUrl}/${testCode}`,
      );

      expect(regency).toEqual({
        code: testCode,
        name: expect.stringMatching(regencyRegex.name),
        provinceCode: testCode.slice(0, 2),
      });
    });
  });

  afterAll(async () => {
    await tester.closeApp();
  });
});
