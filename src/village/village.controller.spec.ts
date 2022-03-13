import { Test, TestingModule } from '@nestjs/testing';
import { VillageController } from './village.controller';

describe('VillageController', () => {
  let controller: VillageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VillageController],
    }).compile();

    controller = module.get<VillageController>(VillageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
