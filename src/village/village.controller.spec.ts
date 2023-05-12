import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '~/src/prisma.service';
import { VillageController } from './village.controller';
import { VillageService } from './village.service';

describe('VillageController', () => {
  let controller: VillageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [VillageController],
      providers: [PrismaService, VillageService],
    }).compile();

    controller = module.get<VillageController>(VillageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
