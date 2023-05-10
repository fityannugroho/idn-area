import { Test, TestingModule } from '@nestjs/testing';
import { RegencyController } from './regency.controller';
import { HelperModule } from 'src/helper/helper.module';
import { PrismaService } from 'src/prisma.service';
import { RegencyService } from './regency.service';

describe('RegencyController', () => {
  let controller: RegencyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HelperModule],
      controllers: [RegencyController],
      providers: [PrismaService, RegencyService],
    }).compile();

    controller = module.get<RegencyController>(RegencyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
