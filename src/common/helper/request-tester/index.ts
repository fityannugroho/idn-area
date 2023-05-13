import * as request from 'supertest';

type HttpMethods = 'get' | 'post' | 'put' | 'patch' | 'delete';

export class RequestTester {
  constructor(private readonly app: any) {}

  /**
   * Expect the response to have Content-Type: application/json.
   */
  expectJson(url: string, method: HttpMethods = 'get') {
    return request(this.app)[method](url).expect('Content-Type', /json/);
  }

  /**
   * Expect the response to have status code `200`.
   */
  expectOk(url: string, method: HttpMethods = 'get') {
    return this.expectJson(url, method).expect(200);
  }

  /**
   * Expect the response to have status code `400`.
   */
  expectBadRequest(url: string, method: HttpMethods = 'get') {
    return this.expectJson(url, method)
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            error: 'Bad Request',
            message: expect.any(Array<string>),
          }),
        );
      });
  }

  /**
   * Expect the response to have status code `404`.
   */
  expectNotFound(url: string, method: HttpMethods = 'get') {
    return this.expectJson(url, method)
      .expect(404)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            statusCode: 404,
            error: 'Not Found',
            message: expect.any(String),
          }),
        );
      });
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
  expectBadCode(url: (code: string) => string, badCodes: string[]) {
    return Promise.all(
      badCodes.map((code) => this.expectBadRequest(url(code))),
    );
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

    const sortQueries = badSortBy.map((sortBy) =>
      badSortOrder.map(
        (sortOrder) => `sortBy=${sortBy}&sortOrder=${sortOrder}`,
      ),
    );

    const sortQueryStr = sortQueries.reduce(
      (acc, curr) => acc.concat(curr),
      [],
    );

    return Promise.all(
      sortQueryStr.map((sortQueryStr) =>
        this.expectBadRequest(url(sortQueryStr)),
      ),
    );
  }
}
