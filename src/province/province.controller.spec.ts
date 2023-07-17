import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/prisma.service';
import { ProvinceController } from './province.controller';
import { ProvinceService } from './province.service';
import { RegencyModule } from '@/regency/regency.module';

describe('ProvinceController', () => {
  let controller: ProvinceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RegencyModule],
      controllers: [ProvinceController],
      providers: [PrismaService, ProvinceService],
    }).compile();

    controller = module.get<ProvinceController>(ProvinceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
