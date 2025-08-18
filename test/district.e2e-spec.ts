import { ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { District } from '@prisma/client';
import { DistrictModule } from '@/district/district.module';

describe('District (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DistrictModule],
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

  it('/GET districts', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/districts',
    });

    expect(response.statusCode).toBe(200);

    const data = response.json();
    expect(data).toHaveProperty('statusCode', 200);
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('meta');
    expect(data.data).toBeInstanceOf(Array);
    expect(data.meta).toHaveProperty('total');

    // Validate structure of first district if exists
    if (data.data.length > 0) {
      const district: District = data.data[0];
      expect(district).toHaveProperty('code');
      expect(district).toHaveProperty('name');
      expect(district).toHaveProperty('regencyCode');
      expect(typeof district.code).toBe('string');
      expect(typeof district.name).toBe('string');
      expect(typeof district.regencyCode).toBe('string');
    }
  });

  it('/GET districts with name filter', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/districts?name=bandung',
    });

    expect(response.statusCode).toBe(200);

    const data = response.json();
    expect(data.data).toBeInstanceOf(Array);

    // All results should contain 'bandung' in name (case insensitive)
    data.data.forEach((district: District) => {
      expect(district.name.toLowerCase()).toContain('bandung');
    });
  });

  it('/GET districts/:code', async () => {
    // First get a valid district code
    const listResponse = await app.inject({
      method: 'GET',
      url: '/districts',
    });

    const listData = listResponse.json();
    if (listData.data.length > 0) {
      const testCode = listData.data[0].code;

      const response = await app.inject({
        method: 'GET',
        url: `/districts/${testCode}`,
      });

      expect(response.statusCode).toBe(200);

      const data = response.json();
      expect(data.data).toHaveProperty('code', testCode);
      expect(data.data).toHaveProperty('name');
      expect(data.data).toHaveProperty('regencyCode');
      expect(data.data).toHaveProperty('parent');
      expect(data.data.parent).toHaveProperty('regency');
      expect(data.data.parent).toHaveProperty('province');
    }
  });

  it('/GET districts/:code with invalid code should return 400', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/districts/invalid',
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('statusCode', 400);
    expect(response.json()).toHaveProperty('error', 'Bad Request');
  });

  it('/GET districts/:code with non-existent code should return 404', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/districts/99.99.99',
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toHaveProperty('statusCode', 404);
    expect(response.json()).toHaveProperty('error', 'Not Found');
  });
});
