import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/prisma.service';
import { ProvinceController } from './province.controller';
import { ProvinceService } from './province.service';

describe('ProvinceService', () => {
  let service: ProvinceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [ProvinceController],
      providers: [PrismaService, ProvinceService],
    }).compile();

    service = module.get<ProvinceService>(ProvinceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
