import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockTestData } from '@/../test/fixtures/data.fixtures';
import { SortOrder } from '@/sort/sort.dto';
import { VillageController } from './village.controller';
import { VillageService } from './village.service';

describe('VillageController', () => {
  let controller: VillageController;
  let villageService: VillageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VillageController],
      providers: [
        {
          provide: VillageService,
          useValue: {
            find: vi.fn(),
            findByCode: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VillageController>(VillageController);
    villageService = module.get<VillageService>(VillageService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    it('should return all villages', async () => {
      const mockData = mockTestData.sampleVillages;
      villageService.find = vi.fn().mockResolvedValue({ data: mockData });

      const { data } = await controller.find();

      expect(villageService.find).toHaveBeenCalledOnce();
      expect(villageService.find).toHaveBeenCalledWith(undefined);
      expect(data).toEqual(mockData);
    });

    it('should return villages filtered by name', async () => {
      const testVillageName = 'bantarjati';
      const mockData = mockTestData.sampleVillages.filter((v) =>
        v.name.toLowerCase().includes(testVillageName.toLowerCase()),
      );
      villageService.find = vi.fn().mockResolvedValue({ data: mockData });

      const { data } = await controller.find({ name: testVillageName });

      expect(villageService.find).toHaveBeenCalledOnce();
      expect(villageService.find).toHaveBeenCalledWith({
        name: testVillageName,
      });
      expect(data).toEqual(mockData);
    });

    it('should return empty array if there is no village with the corresponding name', async () => {
      villageService.find = vi.fn().mockResolvedValue({ data: [] });

      const { data } = await controller.find({ name: 'unknown village' });

      expect(villageService.find).toHaveBeenCalledOnce();
      expect(data).toEqual([]);
    });

    it('should return villages filtered and sorted by name ascending', async () => {
      const testVillageName = 'bantarjati';
      const mockData = mockTestData.sampleVillages
        .filter((v) =>
          v.name.toLowerCase().includes(testVillageName.toLowerCase()),
        )
        .sort((a, b) => a.name.localeCompare(b.name));
      villageService.find = vi.fn().mockResolvedValue({ data: mockData });

      const { data } = await controller.find({
        name: testVillageName,
        sortBy: 'name',
      });

      expect(villageService.find).toHaveBeenCalledOnce();
      expect(villageService.find).toHaveBeenCalledWith({
        name: testVillageName,
        sortBy: 'name',
      });
      expect(data).toEqual(mockData);
    });

    it('should return villages filtered and sorted by name descending', async () => {
      const testVillageName = 'bantarjati';
      const mockData = mockTestData.sampleVillages
        .filter((v) =>
          v.name.toLowerCase().includes(testVillageName.toLowerCase()),
        )
        .sort((a, b) => b.name.localeCompare(a.name));
      villageService.find = vi.fn().mockResolvedValue({ data: mockData });

      const { data } = await controller.find({
        name: testVillageName,
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
      });

      expect(villageService.find).toHaveBeenCalledOnce();
      expect(villageService.find).toHaveBeenCalledWith({
        name: testVillageName,
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
      });
      expect(data).toEqual(mockData);
    });

    it('should return villages filtered by district code', async () => {
      const districtCode = '32.01.01';
      const mockData = mockTestData.sampleVillages.filter(
        (v) => v.districtCode === districtCode,
      );
      villageService.find = vi.fn().mockResolvedValue({ data: mockData });

      const { data } = await controller.find({ districtCode });

      expect(villageService.find).toHaveBeenCalledOnce();
      expect(villageService.find).toHaveBeenCalledWith({ districtCode });
      expect(data).toEqual(mockData);
    });
  });

  describe('findByCode', () => {
    it('should return a village with matching code', async () => {
      const testVillageCode = '32.01.01.2001';
      const expectedVillage = mockTestData.sampleVillages.find(
        (v) => v.code === testVillageCode,
      );
      const mockResult = {
        ...expectedVillage,
        parent: {
          district: mockTestData.bogorDistricts[0],
          regency: mockTestData.westJavaRegencies[0],
          province: mockTestData.javaProvinces[0],
        },
      };
      villageService.findByCode = vi.fn().mockResolvedValue(mockResult);

      const result = await controller.findByCode({ code: testVillageCode });

      expect(villageService.findByCode).toHaveBeenCalledOnce();
      expect(villageService.findByCode).toHaveBeenCalledWith(testVillageCode);
      expect(result).toEqual(mockResult);
    });

    it('should throw NotFoundException if there is no matching village', async () => {
      const invalidCode = '0000';
      villageService.findByCode = vi.fn().mockResolvedValue(null);

      await expect(
        controller.findByCode({ code: invalidCode }),
      ).rejects.toThrowError(NotFoundException);
      expect(villageService.findByCode).toHaveBeenCalledWith(invalidCode);
    });
  });
});
