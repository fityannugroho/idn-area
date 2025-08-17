import { ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { Island } from '@prisma/client';
import { IslandModule } from '@/island/island.module';

describe('Island (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), IslandModule],
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

  it('/GET islands', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/islands',
    });

    expect(response.statusCode).toBe(200);

    const data = response.json();
    expect(data).toHaveProperty('statusCode', 200);
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('meta');
    expect(data.data).toBeInstanceOf(Array);
    expect(data.meta).toHaveProperty('total');

    // Validate structure of first island if exists
    if (data.data.length > 0) {
      const island: Island = data.data[0];
      expect(island).toHaveProperty('code');
      expect(island).toHaveProperty('name');
      expect(typeof island.code).toBe('string');
      expect(typeof island.name).toBe('string');
    }
  });

  it('/GET islands with name filter', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/islands?name=jawa',
    });

    expect(response.statusCode).toBe(200);

    const data = response.json();
    expect(data.data).toBeInstanceOf(Array);

    // All results should contain 'jawa' in name (case insensitive)
    data.data.forEach((island: Island) => {
      expect(island.name.toLowerCase()).toContain('jawa');
    });
  });

  it('/GET islands/:code', async () => {
    // First get a valid island code
    const listResponse = await app.inject({
      method: 'GET',
      url: '/islands',
    });

    const listData = listResponse.json();
    if (listData.data.length > 0) {
      const testCode = listData.data[0].code;

      const response = await app.inject({
        method: 'GET',
        url: `/islands/${testCode}`,
      });

      expect(response.statusCode).toBe(200);

      const data = response.json();
      expect(data.data).toHaveProperty('code', testCode);
      expect(data.data).toHaveProperty('name');
    }
  });

  it('/GET islands/:code with invalid code should return 400', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/islands/invalid-code',
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('statusCode', 400);
    expect(response.json()).toHaveProperty('error', 'Bad Request');
  });

  it('/GET islands/:code with non-existent code should return 404', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/islands/99.99.49999', // Use a valid format but non-existent code
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toHaveProperty('statusCode', 404);
    expect(response.json()).toHaveProperty('error', 'Not Found');
  });
});
