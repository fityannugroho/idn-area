import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '~/src/prisma.service';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';

describe('DistrictService', () => {
  let service: DistrictService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [DistrictController],
      providers: [DistrictService, PrismaService],
    }).compile();

    service = module.get<DistrictService>(DistrictService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
