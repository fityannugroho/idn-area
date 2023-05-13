import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '~/src/app.module';

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

export class AppTester {
  constructor(readonly app: NestFastifyApplication) {}

  static async make() {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    return new AppTester(app);
  }

  /**
   * Only boot after all app settings
   * like enabling CORS and set global pipes has already done.
   */
  async bootApp() {
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

    return res;
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
  async expectBadCode(url: (code: string) => string, badCodes: string[]) {
    for (const code of badCodes) {
      await this.expectBadRequest(url(code));
    }
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

    for (const sortBy of badSortBy) {
      for (const sortOrder of badSortOrder) {
        await this.expectBadRequest(
          url(`sortBy=${sortBy}&sortOrder=${sortOrder}`),
        );
      }
    }
  }
}
