import { Test, TestingModule } from '@nestjs/testing';
import { DistrictService } from './district.service';
import { HelperModule } from 'src/helper/helper.module';
import { PrismaService } from 'src/prisma.service';
import { DistrictController } from './district.controller';

describe('DistrictService', () => {
  let service: DistrictService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HelperModule],
      controllers: [DistrictController],
      providers: [DistrictService, PrismaService],
    }).compile();

    service = module.get<DistrictService>(DistrictService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
