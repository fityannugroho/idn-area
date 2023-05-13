import { ValidationPipe } from '@nestjs/common';
import { Province } from '~/prisma/utils';
import { AppTester } from '~/src/common/helper/app-tester';

describe('Province (e2e)', () => {
  const testedProvince: Province = {
    code: '32',
    name: 'JAWA BARAT',
  };

  const expectBadProvinceCode = async (url: (code: string) => string) => {
    await tester.expectBadCode(url, ['x', 'xxx']);
  };

  let tester: AppTester;

  beforeAll(async () => {
    tester = await AppTester.make();

    tester.app.enableCors();
    tester.app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    await tester.bootApp();
  });

  describe('GET /provinces', () => {
    it('should return array of provinces', async () => {
      const res = await tester.expectOk('/provinces');

      expect(res.json()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: expect.any(String),
            name: expect.any(String),
          }),
        ]),
      );
    });

    it('should return 400 if any sort query is invalid', async () => {
      await tester.expectBadSortQuery(
        (sortQueryStr) => `/provinces?${sortQueryStr}`,
        ['', 'unknown'],
      );
    });

    describe('GET /provinces?name=:name', () => {
      it('should return array of provinces with the appropriate `name` (case insensitive)', async () => {
        const res = await tester.expectOk('/provinces?name=jawa');

        expect(res.json()).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              code: expect.any(String),
              name: expect.stringMatching(/jawa/i),
            }),
          ]),
        );
      });

      it('should return empty array when the `name` does not match any provinces', async () => {
        const res = await tester.expectOk('/provinces?name=unknown');

        expect(res.json()).toEqual([]);
      });

      it('should return 400 if the `name` is invalid', async () => {
        const invalidNames = ['xx', 'j@wa'];

        for (const name of invalidNames) {
          await tester.expectBadRequest(`/provinces?name=${name}`);
        }
      });
    });
  });

  describe('GET /provinces/:code', () => {
    it('should return a province', async () => {
      const res = await tester.expectOk(`/provinces/${testedProvince.code}`);

      expect(res.json()).toEqual(
        expect.objectContaining({
          code: testedProvince.code,
          name: expect.any(String),
        }),
      );
    });

    it('should return 400 if the `code` is invalid', async () => {
      await expectBadProvinceCode((code) => `/provinces/${code}`);
    });

    it('should return 404 if the `code` does not exists', async () => {
      await tester.expectNotFound('/provinces/00');
    });
  });

  describe('GET /provinces/:code/regencies', () => {
    it('should return array of regencies from specific province', async () => {
      const res = await tester.expectOk(
        `/provinces/${testedProvince.code}/regencies`,
      );

      expect(res.json()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: expect.any(String),
            name: expect.any(String),
            provinceCode: testedProvince.code,
          }),
        ]),
      );
    });

    it('should return 400 if the `code` is invalid', async () => {
      await expectBadProvinceCode((code) => `/provinces/${code}/regencies`);
    });

    it('should return 400 if sort query is invalid', async () => {
      await tester.expectBadSortQuery(
        (sortQueryStr) =>
          `/provinces/${testedProvince.code}/regencies?${sortQueryStr}`,
        ['', 'unknown'],
      );
    });
  });

  afterAll(async () => {
    await tester.closeApp();
  });
});
