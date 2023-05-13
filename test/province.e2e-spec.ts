import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { Province } from '~/prisma/utils';
import { AppModule } from '~/src/app.module';
import { RequestTester } from '~/src/common/helper/request-tester';

describe('Province (e2e)', () => {
  const testedProvince: Province = {
    code: '32',
    name: 'JAWA BARAT',
  };

  const expectBadProvinceCode = (url: (code: string) => string) => {
    return tester.expectBadCode(url, ['x', 'xxx']);
  };

  let tester: RequestTester;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    app.enableCors();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    tester = new RequestTester(app.getHttpServer());
  });

  describe('GET /provinces', () => {
    it('should return array of provinces', () => {
      return tester.expectOk('/provinces').expect((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              code: expect.any(String),
              name: expect.any(String),
            }),
          ]),
        );
      });
    });

    it('should return 400 if any sort query is invalid', () => {
      tester.expectBadSortQuery(
        (sortQueryStr) => `/provinces?${sortQueryStr}`,
        ['', 'unknown'],
      );
    });

    describe('GET /provinces?name=:name', () => {
      it('should return array of provinces with the appropriate `name` (case insensitive)', () => {
        return tester.expectOk('/provinces?name=jawa').expect((res) => {
          expect(res.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                code: expect.any(String),
                name: expect.stringMatching(/jawa/i),
              }),
            ]),
          );
        });
      });

      it('should return empty array when the `name` does not match any provinces', () => {
        return tester.expectOk('/provinces?name=unknown').expect([]);
      });

      it('should return 400 if the `name` is invalid', () => {
        const invalidNames = ['xx', 'j@wa'];

        return Promise.all(
          invalidNames.map((invalidName) =>
            tester.expectBadRequest(`/provinces?name=${invalidName}`),
          ),
        );
      });
    });
  });

  describe('GET /provinces/:code', () => {
    it('should return a province', () => {
      return tester
        .expectOk(`/provinces/${testedProvince.code}`)
        .expect((res) => {
          expect(res.body).toEqual(
            expect.objectContaining({
              code: expect.any(String),
              name: expect.any(String),
            }),
          );

          expect(res.body.code).toEqual(testedProvince.code);
        });
    });

    it('should return 400 if the `code` is invalid', () => {
      return expectBadProvinceCode((code) => `/provinces/${code}`);
    });

    it('should return 404 if the `code` does not exists', () => {
      return tester.expectNotFound('/provinces/00');
    });
  });

  describe('GET /provinces/:code/regencies', () => {
    it('should return array of regencies from specific province', () => {
      return tester
        .expectOk(`/provinces/${testedProvince.code}/regencies`)
        .expect((res) => {
          expect(res.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                code: expect.any(String),
                name: expect.any(String),
                provinceCode: testedProvince.code,
              }),
            ]),
          );
        });
    });

    it('should return 400 if the `code` is invalid', () => {
      return expectBadProvinceCode((code) => `/provinces/${code}/regencies`);
    });

    it('should return 400 if sort query is invalid', () => {
      tester.expectBadSortQuery(
        (sortQueryStr) =>
          `/provinces/${testedProvince.code}/regencies?${sortQueryStr}`,
        ['', 'unknown'],
      );
    });
  });
});
