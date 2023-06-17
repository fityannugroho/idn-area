import { AppTester } from '~/utils/helpers/app-tester';

describe('Village (e2e)', () => {
  const baseUrl = '/villages';
  const testCode = '3204052004';
  let tester: AppTester;

  const expectBadVillageCode = async (url: (code: string) => string) => {
    await tester.expectBadCode(url, ['', '1234', '12345678910', 'abcdefghij']);
  };

  beforeAll(async () => {
    tester = await AppTester.make();
    await tester.bootApp();
  });

  describe(`GET ${baseUrl}?name={name}`, () => {
    it('should return 400 if the `name` does not present', async () => {
      await tester.expectBadRequest(`${baseUrl}`);
    });

    it("should return 400 if the `name` is empty, less than 3 chars, more than 255 chars, or contains any other symbols besides '()-./", async () => {
      const invalidNames = ['', 'ab', 'x'.repeat(256), 'c!nunuk'];

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
      const res = await tester.expectOk(`${baseUrl}?name=unknown`);

      expect(res.json()).toEqual([]);
    });

    it('should return all villages match with the `name`', async () => {
      const testName = 'cinunuk';
      const res = await tester.expectOk(`${baseUrl}?name=${testName}`);

      expect(res.json()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: expect.any(String),
            name: expect.stringMatching(new RegExp(testName, 'i')),
            districtCode: expect.any(String),
          }),
        ]),
      );
    });
  });

  describe(`GET ${baseUrl}/{code}`, () => {
    it('should return 400 if the `code` is invalid', async () => {
      await expectBadVillageCode((code) => `${baseUrl}/${code}`);
    });

    it('should return 404 if the `code` does not exist', async () => {
      await tester.expectNotFound(`${baseUrl}/0000000000`);
    });

    it('should return the village data if the `code` exists', async () => {
      const res = await tester.expectOk(`${baseUrl}/${testCode}`);

      expect(res.json()).toEqual(
        expect.objectContaining({
          code: testCode,
          name: expect.any(String),
          districtCode: expect.any(String),
        }),
      );
    });
  });

  afterAll(async () => {
    await tester.closeApp();
  });
});
