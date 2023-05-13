import { AppTester } from '~/src/common/helper/app-tester';

describe('District (e2e)', () => {
  const baseUrl = '/districts';
  const testCode = '327325';
  let tester: AppTester;

  const expectBadDistrictCode = async (url: (code: string) => string) => {
    await tester.expectBadCode(url, ['', '1234', '1234567', 'abcdef']);
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
      const res = await tester.expectOk(`${baseUrl}?name=unknown`);

      expect(res.json()).toEqual([]);
    });

    it('should return all districts match with the `name`', async () => {
      const testName = 'bandung';
      const res = await tester.expectOk(`${baseUrl}?name=${testName}`);

      expect(res.json()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: expect.any(String),
            name: expect.stringMatching(new RegExp(testName, 'i')),
            regencyCode: expect.any(String),
          }),
        ]),
      );
    });
  });

  describe(`GET ${baseUrl}/{code}`, () => {
    it('should return 400 if the `code` is invalid', async () => {
      await expectBadDistrictCode((code) => `${baseUrl}/${code}`);
    });

    it('should return 404 if the `code` does not exist', async () => {
      await tester.expectNotFound(`${baseUrl}/000000`);
    });

    it('should return the district with the `code`', async () => {
      const res = await tester.expectOk(`${baseUrl}/${testCode}`);

      expect(res.json()).toEqual(
        expect.objectContaining({
          code: testCode,
          name: expect.any(String),
          regencyCode: expect.any(String),
        }),
      );
    });
  });

  describe(`GET ${baseUrl}/{code}/villages`, () => {
    it('should return 400 if the `code` is invalid', async () => {
      await expectBadDistrictCode((code) => `${baseUrl}/${code}/villages`);
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
      const res = await tester.expectOk(`${baseUrl}/${testCode}/villages`);

      expect(res.json()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: expect.any(String),
            name: expect.any(String),
            districtCode: testCode,
          }),
        ]),
      );
    });
  });

  afterAll(async () => {
    await tester.closeApp();
  });
});
