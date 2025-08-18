import { ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { Village } from '@prisma/client';
import { VillageModule } from '@/village/village.module';

describe('Village (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), VillageModule],
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

  it('/GET villages', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/villages',
    });

    expect(response.statusCode).toBe(200);

    const data = response.json();
    expect(data).toHaveProperty('statusCode', 200);
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('meta');
    expect(data.data).toBeInstanceOf(Array);
    expect(data.meta).toHaveProperty('total');

    // Validate structure of first village if exists
    if (data.data.length > 0) {
      const village: Village = data.data[0];
      expect(village).toHaveProperty('code');
      expect(village).toHaveProperty('name');
      expect(village).toHaveProperty('districtCode');
      expect(typeof village.code).toBe('string');
      expect(typeof village.name).toBe('string');
      expect(typeof village.districtCode).toBe('string');
    }
  });

  it('/GET villages with name filter', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/villages?name=desa',
    });

    expect(response.statusCode).toBe(200);

    const data = response.json();
    expect(data.data).toBeInstanceOf(Array);

    // All results should contain 'desa' in name (case insensitive)
    data.data.forEach((village: Village) => {
      expect(village.name.toLowerCase()).toContain('desa');
    });
  });

  it('/GET villages/:code', async () => {
    // First get a valid village code
    const listResponse = await app.inject({
      method: 'GET',
      url: '/villages?limit=1',
    });

    const listData = listResponse.json();
    if (listData.data.length > 0) {
      const testCode = listData.data[0].code;

      const response = await app.inject({
        method: 'GET',
        url: `/villages/${testCode}`,
      });

      expect(response.statusCode).toBe(200);

      const data = response.json();
      expect(data.data).toHaveProperty('code', testCode);
      expect(data.data).toHaveProperty('name');
      expect(data.data).toHaveProperty('districtCode');
      expect(data.data).toHaveProperty('parent');
      expect(data.data.parent).toHaveProperty('district');
      expect(data.data.parent).toHaveProperty('regency');
      expect(data.data.parent).toHaveProperty('province');
    }
  });

  it('/GET villages/:code with invalid code should return 400', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/villages/invalid',
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('statusCode', 400);
    expect(response.json()).toHaveProperty('error', 'Bad Request');
  });

  it('/GET villages/:code with non-existent code should return 404', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/villages/99.99.99.9999',
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toHaveProperty('statusCode', 404);
    expect(response.json()).toHaveProperty('error', 'Not Found');
  });
});
