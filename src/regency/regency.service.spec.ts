import { Test, TestingModule } from '@nestjs/testing';
import { RegencyService } from './regency.service';

describe('RegencyService', () => {
  let service: RegencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegencyService],
    }).compile();

    service = module.get<RegencyService>(RegencyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
