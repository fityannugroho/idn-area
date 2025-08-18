import { ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { Province } from '@prisma/client';
import { ProvinceModule } from '@/province/province.module';

describe('Province (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), ProvinceModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/GET provinces', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/provinces',
    });

    expect(response.statusCode).toBe(200);

    const data = response.json();
    expect(data).toHaveProperty('statusCode', 200);
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('meta');
    expect(data.data).toBeInstanceOf(Array);
    expect(data.meta).toHaveProperty('total');

    // Validate structure of first province if exists
    if (data.data.length > 0) {
      const province: Province = data.data[0];
      expect(province).toHaveProperty('code');
      expect(province).toHaveProperty('name');
      expect(typeof province.code).toBe('string');
      expect(typeof province.name).toBe('string');
    }
  });

  it('/GET provinces with name filter', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/provinces?name=jawa',
    });

    expect(response.statusCode).toBe(200);

    const data = response.json();
    expect(data.data).toBeInstanceOf(Array);

    // All results should contain 'jawa' in name (case insensitive)
    data.data.forEach((province: Province) => {
      expect(province.name.toLowerCase()).toContain('jawa');
    });
  });

  it('/GET provinces/:code', async () => {
    // First get a valid province code
    const listResponse = await app.inject({
      method: 'GET',
      url: '/provinces',
    });

    const listData = listResponse.json();
    if (listData.data.length > 0) {
      const testCode = listData.data[0].code;

      const response = await app.inject({
        method: 'GET',
        url: `/provinces/${testCode}`,
      });

      expect(response.statusCode).toBe(200);

      const data = response.json();
      expect(data.data).toHaveProperty('code', testCode);
      expect(data.data).toHaveProperty('name');
    }
  });

  it('/GET provinces/:code with invalid code should return 400', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/provinces/invalid-code',
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('statusCode', 400);
    expect(response.json()).toHaveProperty('error', 'Bad Request');
  });

  it('/GET provinces/:code with non-existent code should return 404', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/provinces/99',
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toHaveProperty('statusCode', 404);
    expect(response.json()).toHaveProperty('error', 'Not Found');
  });
});
