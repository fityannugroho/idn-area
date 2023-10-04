import { Island } from '@prisma/client';
import { AppTester } from './helper/app-tester';
import { islandRegex } from './helper/data-regex';

describe('Island (e2e)', () => {
  const baseUrl = '/islands';
  const testCode = '110140001';
  const badIslandCodes = ['', '12345678', '1234567890', 'abcdefghi'] as const;
  let tester: AppTester;

  beforeAll(async () => {
    tester = await AppTester.make();
    await tester.bootApp();
  });

  describe(`GET ${baseUrl}`, () => {
    it('should return islands', async () => {
      const islands = await tester.expectData<Island[]>(baseUrl);

      islands.forEach((island) => {
        expect(island).toEqual({
          code: expect.stringMatching(islandRegex.code),
          coordinate: expect.stringMatching(islandRegex.coordinate),
          isOutermostSmall: expect.any(Boolean),
          isPopulated: expect.any(Boolean),
          latitude: expect.any(Number),
          longitude: expect.any(Number),
          name: expect.stringMatching(islandRegex.name),
          regencyCode: island.regencyCode ? island.code.slice(0, 4) : null,
        });
      });
    });

    it('should return 400 if the `name` is empty, less than 3 chars, more than 255 chars, or contains any symbols', async () => {
      const invalidNames = ['', 'ab', 'x'.repeat(256), 's@bang'];

      for (const name of invalidNames) {
        await tester.expectBadRequest(`${baseUrl}?name=${name}`);
      }
    });

    it('should return 400 if any island sort query is invalid', async () => {
      await tester.expectBadSortQuery(
        (sortQueryStr) => `${baseUrl}?${sortQueryStr}`,
        ['', 'unknown'],
      );
    });

    it('should return empty array if there are no any islands match with the `name`', async () => {
      const islands = await tester.expectData<Island[]>(
        `${baseUrl}?name=unknown`,
      );

      expect(islands).toEqual([]);
    });

    it('should return all islands match with the `name`', async () => {
      const testName = 'batu';
      const islands = await tester.expectData<Island[]>(
        `${baseUrl}?name=${testName}`,
      );

      islands.forEach((island) => {
        expect(island).toEqual({
          code: expect.stringMatching(islandRegex.code),
          coordinate: expect.stringMatching(islandRegex.coordinate),
          isOutermostSmall: expect.any(Boolean),
          isPopulated: expect.any(Boolean),
          latitude: expect.any(Number),
          longitude: expect.any(Number),
          name: expect.stringMatching(new RegExp(testName, 'i')),
          regencyCode: island.regencyCode ? island.code.slice(0, 4) : null,
        });
      });
    });

    it('should return all islands match with the `regencyCode`', async () => {
      const testRegencyCode = '1101';
      const islands = await tester.expectData<Island[]>(
        `${baseUrl}?regencyCode=${testRegencyCode}`,
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
          regencyCode: testRegencyCode,
        });
      });
    });

    it('should return all islands that does not belong to any regency', async () => {
      const islands = await tester.expectData<Island[]>(
        `${baseUrl}?regencyCode`,
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
          regencyCode: null,
        });
      });
    });
  });

  describe(`GET ${baseUrl}/{code}`, () => {
    it('should return 400 if the `code` is invalid', async () => {
      await tester.expectBadCode(
        (code) => `${baseUrl}/${code}`,
        badIslandCodes,
      );
    });

    it('should return 404 if the `code` does not exist', async () => {
      await tester.expectNotFound(`${baseUrl}/123456789`);
    });

    it('should return the island with the `code`', async () => {
      const island = await tester.expectData<Island>(`${baseUrl}/${testCode}`);

      expect(island).toEqual({
        code: testCode,
        coordinate: expect.stringMatching(islandRegex.coordinate),
        isOutermostSmall: expect.any(Boolean),
        isPopulated: expect.any(Boolean),
        latitude: expect.any(Number),
        longitude: expect.any(Number),
        name: expect.stringMatching(islandRegex.name),
        regencyCode: island.regencyCode ? island.code.slice(0, 4) : null,
      });
    });
  });

  afterAll(async () => {
    await tester.closeApp();
  });
});
