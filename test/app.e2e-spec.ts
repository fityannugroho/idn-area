import { AppTester } from '~/utils/helpers/app-tester';

describe('AppController (e2e)', () => {
  let tester: AppTester;

  beforeAll(async () => {
    tester = await AppTester.make();
    await tester.bootApp();
  });

  it('/ (GET)', async () => {
    const res = await tester.expectOk('/');

    expect(res.json()).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        version: process.env.npm_package_version,
      }),
    );
  });

  afterAll(async () => {
    await tester.closeApp();
  });
});
