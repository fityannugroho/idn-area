import { Test, TestingModule } from '@nestjs/testing';
import { IslandController } from './island.controller';
import { IslandService } from './island.service';
import { PrismaService } from '@/prisma/prisma.service';

describe('IslandController', () => {
  let controller: IslandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IslandController],
      providers: [IslandService, PrismaService],
    }).compile();

    controller = module.get<IslandController>(IslandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
