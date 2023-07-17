import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/prisma.service';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';
import { VillageModule } from '@/village/village.module';

describe('DistrictService', () => {
  let service: DistrictService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [VillageModule],
      controllers: [DistrictController],
      providers: [DistrictService, PrismaService],
    }).compile();

    service = module.get<DistrictService>(DistrictService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
