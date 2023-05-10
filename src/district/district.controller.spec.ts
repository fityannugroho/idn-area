import { Test, TestingModule } from '@nestjs/testing';
import { HelperModule } from '~/src/helper/helper.module';
import { PrismaService } from '~/src/prisma.service';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';

describe('DistrictController', () => {
  let controller: DistrictController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HelperModule],
      controllers: [DistrictController],
      providers: [DistrictService, PrismaService],
    }).compile();

    controller = module.get<DistrictController>(DistrictController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
