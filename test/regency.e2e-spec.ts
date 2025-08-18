import { ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { Regency } from '@prisma/client';
import { RegencyModule } from '@/regency/regency.module';

describe('Regency (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), RegencyModule],
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

  it('/GET regencies', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/regencies',
    });

    expect(response.statusCode).toBe(200);

    const data = response.json();
    expect(data).toHaveProperty('statusCode', 200);
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('meta');
    expect(data.data).toBeInstanceOf(Array);
    expect(data.meta).toHaveProperty('total');

    // Validate structure of first regency if exists
    if (data.data.length > 0) {
      const regency: Regency = data.data[0];
      expect(regency).toHaveProperty('code');
      expect(regency).toHaveProperty('name');
      expect(regency).toHaveProperty('provinceCode');
      expect(typeof regency.code).toBe('string');
      expect(typeof regency.name).toBe('string');
      expect(typeof regency.provinceCode).toBe('string');
    }
  });

  it('/GET regencies with name filter', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/regencies?name=bandung',
    });

    expect(response.statusCode).toBe(200);

    const data = response.json();
    expect(data.data).toBeInstanceOf(Array);

    // All results should contain 'bandung' in name (case insensitive)
    data.data.forEach((regency: Regency) => {
      expect(regency.name.toLowerCase()).toContain('bandung');
    });
  });

  it('/GET regencies/:code', async () => {
    // First get a valid regency code
    const listResponse = await app.inject({
      method: 'GET',
      url: '/regencies',
    });

    const listData = listResponse.json();
    if (listData.data.length > 0) {
      const testCode = listData.data[0].code;

      const response = await app.inject({
        method: 'GET',
        url: `/regencies/${testCode}`,
      });

      expect(response.statusCode).toBe(200);

      const data = response.json();
      expect(data.data).toHaveProperty('code', testCode);
      expect(data.data).toHaveProperty('name');
      expect(data.data).toHaveProperty('provinceCode');
      expect(data.data).toHaveProperty('parent');
      expect(data.data.parent).toHaveProperty('province');
    }
  });

  it('/GET regencies/:code with invalid code should return 400', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/regencies/invalid',
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('statusCode', 400);
    expect(response.json()).toHaveProperty('error', 'Bad Request');
  });

  it('/GET regencies/:code with non-existent code should return 404', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/regencies/99.99',
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toHaveProperty('statusCode', 404);
    expect(response.json()).toHaveProperty('error', 'Not Found');
  });
});
