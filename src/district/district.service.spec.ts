import { Test, TestingModule } from '@nestjs/testing';
import { DistrictService } from './district.service';

describe('DistrictService', () => {
  let service: DistrictService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DistrictService],
    }).compile();

    service = module.get<DistrictService>(DistrictService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
