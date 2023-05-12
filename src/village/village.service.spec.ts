import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '~/src/prisma.service';
import { VillageController } from './village.controller';
import { VillageService } from './village.service';

describe('VillageService', () => {
  let service: VillageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [VillageController],
      providers: [PrismaService, VillageService],
    }).compile();

    service = module.get<VillageService>(VillageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
