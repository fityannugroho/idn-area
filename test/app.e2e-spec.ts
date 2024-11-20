import { AppTester } from './helper/app-tester';

describe('AppController (e2e)', () => {
  let tester: AppTester;

  beforeAll(async () => {
    tester = await AppTester.make();
    await tester.bootApp();
  });

  it('/health (GET)', async () => {
    const res = await tester.expectOk('/health');
    expect(res.json()).toEqual({ statusCode: 200, message: 'OK' });
  });

  afterAll(async () => {
    await tester.closeApp();
  });
});
