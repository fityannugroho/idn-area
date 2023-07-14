import { AppTester } from './helper/app-tester';

describe('Island (e2e)', () => {
  const baseUrl = '/islands';
  const testCode = '110140001';
  let tester: AppTester;

  const expectBadIslandCode = async (url: (code: string) => string) => {
    await tester.expectBadCode(url, [
      '',
      '12345678',
      '1234567890',
      'abcdefghi',
    ]);
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
      const res = await tester.expectOk(`${baseUrl}?name=unknown`);

      expect(res.json()).toEqual([]);
    });

    it('should return all islands match with the `name`', async () => {
      const testName = 'batu';
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

  describe(`GET ${baseUrl}/{code}`, () => {
    it('should return 400 if the `code` is invalid', async () => {
      await expectBadIslandCode((code) => `${baseUrl}/${code}`);
    });

    it('should return 404 if the `code` does not exist', async () => {
      await tester.expectNotFound(`${baseUrl}/123456789`);
    });

    it('should return the island with the `code`', async () => {
      const res = await tester.expectOk(`${baseUrl}/${testCode}`);

      expect(res.json()).toEqual(
        expect.objectContaining({
          code: testCode,
          coordinate: expect.any(String),
          isOutermostSmall: expect.any(Boolean),
          isPopulated: expect.any(Boolean),
          latitude: expect.any(Number),
          longitude: expect.any(Number),
          name: expect.any(String),
          regencyCode: expect.any(String),
        }),
      );

      expect(testCode.includes(res.json().regencyCode)).toBeTruthy();
    });
  });

  afterAll(async () => {
    await tester.closeApp();
  });
});
