import { AppTester } from '~/utils/helpers/app-tester';

describe('Province (e2e)', () => {
  const baseUrl = '/provinces';
  const testCode = '32';
  let tester: AppTester;

  const expectBadProvinceCode = async (url: (code: string) => string) => {
    await tester.expectBadCode(url, ['', '1', '123', 'ab']);
  };

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
      const res = await tester.expectOk(baseUrl);

      expect(res.json()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: expect.any(String),
            name: expect.any(String),
          }),
        ]),
      );
    });

    describe(`GET ${baseUrl}?name={name}`, () => {
      it('should return 400 if the `name` is empty, less than 3 chars, more than 255 chars, or contains any symbols', async () => {
        const invalidNames = ['', 'ab', 'x'.repeat(256), 'j@wa'];

        for (const name of invalidNames) {
          await tester.expectBadRequest(`${baseUrl}?name=${name}`);
        }
      });

      it('should return empty array if there are no any provinces match with the `name`', async () => {
        const res = await tester.expectOk(`${baseUrl}?name=unknown`);

        expect(res.json()).toEqual([]);
      });

      it('should return array of provinces that match with the `name`', async () => {
        const testName = 'jawa';
        const res = await tester.expectOk(`${baseUrl}?name=${testName}`);

        expect(res.json()).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              code: expect.any(String),
              name: expect.stringMatching(new RegExp(testName, 'i')),
            }),
          ]),
        );
      });
    });
  });

  describe(`GET ${baseUrl}/{code}`, () => {
    it('should return 400 if the `code` is invalid', async () => {
      await expectBadProvinceCode((code) => `${baseUrl}/${code}`);
    });

    it('should return 404 if the `code` does not exists', async () => {
      await tester.expectNotFound(`${baseUrl}/00`);
    });

    it('should return a province that match with the `code`', async () => {
      const res = await tester.expectOk(`${baseUrl}/${testCode}`);

      expect(res.json()).toEqual(
        expect.objectContaining({
          code: testCode,
          name: expect.any(String),
        }),
      );
    });
  });

  describe(`GET ${baseUrl}/{code}/regencies`, () => {
    it('should return 400 if the `code` is invalid', async () => {
      await expectBadProvinceCode((code) => `${baseUrl}/${code}/regencies`);
    });

    it('should return 400 if regencies sort query is invalid', async () => {
      await tester.expectBadSortQuery(
        (sortQueryStr) => `${baseUrl}/${testCode}/regencies?${sortQueryStr}`,
        ['', 'unknown'],
      );
    });

    it('should return all regencies from specific province', async () => {
      const res = await tester.expectOk(`${baseUrl}/${testCode}/regencies`);

      expect(res.json()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: expect.any(String),
            name: expect.any(String),
            provinceCode: testCode,
          }),
        ]),
      );
    });
  });

  afterAll(async () => {
    await tester.closeApp();
  });
});
