import { AppTester } from './helper/app-tester';

describe('Regency (e2e)', () => {
  const baseUrl = '/regencies';
  const testCode = '3273';
  let tester: AppTester;

  const expectBadRegencyCode = async (url: (code: string) => string) => {
    await tester.expectBadCode(url, ['', '123', '12345', 'abcd']);
  };

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
      const res = await tester.expectOk(`${baseUrl}?name=unknown`);

      expect(res.json()).toEqual([]);
    });

    it('should return all regencies match with the `name`', async () => {
      const testName = 'bandung';
      const res = await tester.expectOk(`${baseUrl}?name=${testName}`);

      expect(res.json()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: expect.any(String),
            name: expect.stringMatching(new RegExp(testName, 'i')),
            provinceCode: expect.any(String),
          }),
        ]),
      );
    });
  });

  describe(`GET ${baseUrl}/{code}`, () => {
    it('should return 400 if the `code` is invalid', async () => {
      await expectBadRegencyCode((code) => `${baseUrl}/${code}`);
    });

    it('should return 404 if the `code` does not match with any regency', async () => {
      await tester.expectNotFound(`${baseUrl}/0000`);
    });

    it('should return a regency that match with the `code`', async () => {
      const res = await tester.expectOk(`${baseUrl}/${testCode}`);

      expect(res.json()).toEqual(
        expect.objectContaining({
          code: testCode,
          name: expect.any(String),
          provinceCode: expect.any(String),
        }),
      );
    });
  });

  describe(`GET ${baseUrl}/{code}/districts`, () => {
    it('should return 400 if the `code` is invalid', async () => {
      await expectBadRegencyCode((code) => `${baseUrl}/${code}/districts`);
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
      const res = await tester.expectOk(`${baseUrl}/${testCode}/districts`);

      expect(res.json()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: expect.any(String),
            name: expect.any(String),
            regencyCode: testCode,
          }),
        ]),
      );
    });
  });

  describe(`GET ${baseUrl}/{code}/islands`, () => {
    it('should return 400 if the `code` is invalid', async () => {
      await expectBadRegencyCode((code) => `${baseUrl}/${code}/islands`);
    });

    it('should return 404 if the `code` does not match with any regency', async () => {
      await tester.expectNotFound(`${baseUrl}/0000/islands`);
    });

    it('should return all islands from specific regency', async () => {
      const res = await tester.expectOk(`${baseUrl}/1101/islands`);

      expect(res.json()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: expect.any(String),
            coordinate: expect.any(String),
            isOutermostSmall: expect.any(Boolean),
            isPopulated: expect.any(Boolean),
            latitude: expect.any(Number),
            longitude: expect.any(Number),
            name: expect.any(String),
            regencyCode: '1101',
          }),
        ]),
      );
    });

    it('should return empty array if there are no any island in the regency', async () => {
      const res = await tester.expectOk(`${baseUrl}/1102/islands`);

      expect(res.json()).toEqual([]);
    });
  });

  afterAll(async () => {
    await tester.closeApp();
  });
});
