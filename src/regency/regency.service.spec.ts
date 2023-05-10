import { Test, TestingModule } from '@nestjs/testing';
import { RegencyService } from './regency.service';
import { HelperModule } from 'src/helper/helper.module';
import { PrismaService } from 'src/prisma.service';
import { RegencyController } from './regency.controller';

describe('RegencyService', () => {
  let service: RegencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HelperModule],
      controllers: [RegencyController],
      providers: [PrismaService, RegencyService],
    }).compile();

    service = module.get<RegencyService>(RegencyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
