import { ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '@/app.controller';
import { TransformedResponse } from '@/common/interceptor/transform.interceptor';
import { DistrictModule } from '@/district/district.module';
import { IslandModule } from '@/island/island.module';
import { ProvinceModule } from '@/province/province.module';
import { RegencyModule } from '@/regency/regency.module';
import { VillageModule } from '@/village/village.module';

export type HttpMethods =
  | 'DELETE'
  | 'delete'
  | 'GET'
  | 'get'
  | 'HEAD'
  | 'head'
  | 'PATCH'
  | 'patch'
  | 'POST'
  | 'post'
  | 'PUT'
  | 'put'
  | 'OPTIONS'
  | 'options';

type BadRequestResponse = Awaited<ReturnType<AppTester['expectBadRequest']>>;

export class AppTester {
  constructor(readonly app: NestFastifyApplication) {}

  static async make() {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        ProvinceModule,
        RegencyModule,
        DistrictModule,
        VillageModule,
        IslandModule,
      ],
      controllers: [AppController],
    }).compile();

    const app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    return new AppTester(app);
  }

  /**
   * Only boot after all app settings (like enabling CORS, etc) has already done.
   *
   * This function also automatically enable validation pipe globally.
   */
  async bootApp() {
    this.app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    await this.app.init();
    await this.app.getHttpAdapter().getInstance().ready();
  }

  async closeApp() {
    await this.app.close();
  }

  async request(url: string, method: HttpMethods = 'GET') {
    return await this.app.inject({
      method,
      url,
    });
  }

  /**
   * Expect the HTTP response to have Content-Type: application/json.
   */
  async expectJson(url: string, method: HttpMethods = 'GET') {
    const res = await this.request(url, method);

    expect(res.headers['content-type']).toEqual(
      expect.stringContaining('application/json'),
    );

    return res;
  }

  /**
   * Expect the HTTP response to have status code `200`.
   */
  async expectOk(url: string, method: HttpMethods = 'GET') {
    const res = await this.expectJson(url, method);

    expect(res.statusCode).toEqual(200);
    expect(res.json().statusCode).toEqual(200);

    return res;
  }

  /**
   * Expect the HTTP response to have status code `200` and the `data` property.
   *
   * If the `data` is an array, it also expect the `total` property.
   */
  async expectData<T>(url: string, method: HttpMethods = 'GET') {
    const res = await this.expectOk(url, method);
    const resJson = res.json<TransformedResponse<T>>();

    expect(resJson.data).toBeDefined();

    if (Array.isArray(resJson.data)) {
      expect(resJson.meta.total).toEqual(resJson.data.length);
    }

    return resJson.data;
  }

  /**
   * Expect the HTTP response to have status code `400`.
   */
  async expectBadRequest(url: string, method: HttpMethods = 'GET') {
    const res = await this.expectJson(url, method);

    expect(res.statusCode).toEqual(400);

    expect(res.json()).toEqual(
      expect.objectContaining({
        statusCode: 400,
        error: 'Bad Request',
        message: expect.any(Array<string>),
      }),
    );

    return res;
  }

  /**
   * Expect the HTTP response to have status code `404`.
   */
  async expectNotFound(url: string, method: HttpMethods = 'GET') {
    const res = await this.expectJson(url, method);

    expect(res.statusCode).toEqual(404);

    expect(res.json()).toEqual(
      expect.objectContaining({
        statusCode: 404,
        error: 'Not Found',
        message: expect.any(String),
      }),
    );

    return res;
  }

  /**
   * Expect the Bad Request response because of invalid `code` in the url.
   *
   * If this test fail, that means the endpoint is not validating the `code`
   * properly.
   *
   * @param url A function that returns the url.
   * The `code` param is placeholder to inject the bad code into the url.
   *
   * @param badCodes List of invalid `code` samples to test.
   */
  async expectBadCode(
    url: (code: string) => string,
    badCodes: readonly string[],
  ) {
    const promises: Promise<BadRequestResponse>[] = [];

    for (const code of badCodes) {
      promises.push(this.expectBadRequest(url(code)));
    }

    await Promise.all(promises);
  }

  /**
   * Expect the Bad Request response because of invalid `sortBy` or `sortOrder`
   * in the url.
   *
   * If this test fail, that means the endpoint is not validating the `sortBy`
   * or `sortOrder` properly.
   *
   * @param url A function that returns the url.
   * The `sortQueryStr` param is placeholder to inject the `sortBy={badSortBy}&sortOrder={badSortOrder}` query into the url.
   *
   * @param badSortBy List of invalid `sortBy` samples to test.
   */
  async expectBadSortQuery(
    url: (sortQueryStr: string) => string,
    badSortBy: string[],
  ) {
    const badSortOrder = ['', 'ASC', 'DESC', 'unknown'];
    const promises: Promise<BadRequestResponse>[] = [];

    for (const sortBy of badSortBy) {
      for (const sortOrder of badSortOrder) {
        promises.push(
          this.expectBadRequest(url(`sortBy=${sortBy}&sortOrder=${sortOrder}`)),
        );
      }
    }

    await Promise.all(promises);
  }
}
