import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('health', () => {
    it('should return health status', async () => {
      const result = await controller.health();

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'OK',
      });
    });

    it('should return 200 status code', async () => {
      const result = await controller.health();

      expect(result.statusCode).toBe(200);
    });

    it('should return OK message', async () => {
      const result = await controller.health();

      expect(result.message).toBe('OK');
    });
  });
});
