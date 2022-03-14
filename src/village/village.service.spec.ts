import { Test, TestingModule } from '@nestjs/testing';
import { VillageService } from './village.service';

describe('VillageService', () => {
  let service: VillageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VillageService],
    }).compile();

    service = module.get<VillageService>(VillageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
