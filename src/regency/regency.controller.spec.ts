import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '~/src/common/services/prisma';
import { RegencyController } from './regency.controller';
import { RegencyService } from './regency.service';

describe('RegencyController', () => {
  let controller: RegencyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [RegencyController],
      providers: [PrismaService, RegencyService],
    }).compile();

    controller = module.get<RegencyController>(RegencyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
