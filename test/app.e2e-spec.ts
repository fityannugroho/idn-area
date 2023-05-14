import { AppTester } from '~/src/common/helper/app-tester';

describe('AppController (e2e)', () => {
  let tester: AppTester;

  beforeAll(async () => {
    tester = await AppTester.make();
    await tester.bootApp();
  });

  it('/ (GET)', async () => {
    const res = await tester.expectOk('/');

    expect(res.json()).toEqual({
      message: 'Welcome to Indonesia Area API.',
      version: '1.0.0',
      docs: '/docs',
    });
  });

  afterAll(async () => {
    await tester.closeApp();
  });
});
