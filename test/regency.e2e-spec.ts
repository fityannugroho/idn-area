import { District, Island, Regency } from '@prisma/client';
import { AppTester } from './helper/app-tester';
import { districtRegex, islandRegex, regencyRegex } from './helper/data-regex';

describe('Regency (e2e)', () => {
  const baseUrl = '/regencies';
  const testCode = '3273';
  const badRegencyCodes = ['', '123', '12345', 'abcd'] as const;
  let tester: AppTester;

  beforeAll(async () => {
    tester = await AppTester.make();
    await tester.bootApp();
  });

  describe(`GET ${baseUrl}?name={name}`, () => {
    it('should return 400 if the `name` does not present', async () => {
      await tester.expectBadRequest(`${baseUrl}`);
    });

    it('should return 400 if the `name` is empty, less than 3 chars, more than 255 chars, or contains any symbols', async () => {
      const invalidNames = ['', 'ab', 'x'.repeat(256), 'b@ndung'];

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

  describe(`GET ${baseUrl}/{code}/districts`, () => {
    it('should return 400 if the `code` is invalid', async () => {
      await tester.expectBadCode(
        (code) => `${baseUrl}/${code}/districts`,
        badRegencyCodes,
      );
    });

    it('should return 400 if any districts sort query is invalid', async () => {
      await tester.expectBadSortQuery(
        (sortQueryStr) => `${baseUrl}?${sortQueryStr}`,
        ['', 'unknown'],
      );
    });

    it('should return 404 if the `code` does not match with any regency', async () => {
      await tester.expectNotFound(`${baseUrl}/0000/districts`);
    });

    it('should return all districts from specific regency', async () => {
      const districts = await tester.expectData<District[]>(
        `${baseUrl}/${testCode}/districts`,
      );

      districts.forEach((district) => {
        expect(district).toEqual({
          code: expect.stringMatching(districtRegex.code),
          name: expect.stringMatching(districtRegex.name),
          regencyCode: testCode,
        });
      });
    });
  });

  describe(`GET ${baseUrl}/{code}/islands`, () => {
    it('should return 400 if the `code` is invalid', async () => {
      await tester.expectBadCode(
        (code) => `${baseUrl}/${code}/islands`,
        badRegencyCodes,
      );
    });

    it('should return 404 if the `code` does not match with any regency', async () => {
      await tester.expectNotFound(`${baseUrl}/0000/islands`);
    });

    it('should return all islands from specific regency', async () => {
      const testCode = '1101';
      const islands = await tester.expectData<Island[]>(
        `${baseUrl}/${testCode}/islands`,
      );

      islands.forEach((island) => {
        expect(island).toEqual({
          code: expect.stringMatching(islandRegex.code),
          coordinate: expect.stringMatching(islandRegex.coordinate),
          isOutermostSmall: expect.any(Boolean),
          isPopulated: expect.any(Boolean),
          latitude: expect.any(Number),
          longitude: expect.any(Number),
          name: expect.stringMatching(islandRegex.name),
          regencyCode: testCode,
        });
      });
    });

    it('should return empty array if there are no any island in the regency', async () => {
      const islands = await tester.expectData<Island[]>(
        `${baseUrl}/1102/islands`,
      );

      expect(islands).toEqual([]);
    });
  });

  afterAll(async () => {
    await tester.closeApp();
  });
});
