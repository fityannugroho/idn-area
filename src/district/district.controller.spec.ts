import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/prisma.service';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';
import { VillageModule } from '@/village/village.module';

describe('DistrictController', () => {
  let controller: DistrictController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [VillageModule],
      controllers: [DistrictController],
      providers: [DistrictService, PrismaService],
    }).compile();

    controller = module.get<DistrictController>(DistrictController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
