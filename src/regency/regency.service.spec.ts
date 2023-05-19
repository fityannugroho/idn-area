import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '~/src/common/services/prisma';
import { RegencyController } from './regency.controller';
import { RegencyService } from './regency.service';
import { IslandModule } from '../island/island.module';

describe('RegencyService', () => {
  let service: RegencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [IslandModule],
      controllers: [RegencyController],
      providers: [PrismaService, RegencyService],
    }).compile();

    service = module.get<RegencyService>(RegencyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
