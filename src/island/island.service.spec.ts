import { Test, TestingModule } from '@nestjs/testing';
import { IslandService } from './island.service';
import { PrismaService } from '@/prisma/prisma.service';
import { IslandController } from './island.controller';

describe('IslandService', () => {
  let service: IslandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IslandController],
      providers: [IslandService, PrismaService],
    }).compile();

    service = module.get<IslandService>(IslandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
