import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockTestData } from '@/../test/fixtures/data.fixtures';
import { SortOrder } from '@/sort/sort.dto';
import { ProvinceController } from './province.controller';
import { ProvinceService } from './province.service';

describe('ProvinceController', () => {
  let controller: ProvinceController;
  let provinceService: ProvinceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProvinceController],
      providers: [
        {
          provide: ProvinceService,
          useValue: {
            find: vi.fn(),
            findByCode: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProvinceController>(ProvinceController);
    provinceService = module.get<ProvinceService>(ProvinceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    it('should return all provinces', async () => {
      const mockData = mockTestData.javaProvinces;
      provinceService.find = vi.fn().mockResolvedValue({ data: mockData });

      const { data } = await controller.find();

      expect(provinceService.find).toHaveBeenCalledOnce();
      expect(provinceService.find).toHaveBeenCalledWith(undefined);
      expect(data).toEqual(mockData);
    });

    it('should return all provinces sorted by name ascending', async () => {
      const mockData = [...mockTestData.javaProvinces].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      provinceService.find = vi.fn().mockResolvedValue({ data: mockData });

      const result = await controller.find({
        sortBy: 'name',
        sortOrder: SortOrder.ASC,
      });

      expect(provinceService.find).toHaveBeenCalledOnce();
      expect(provinceService.find).toHaveBeenCalledWith({
        sortBy: 'name',
        sortOrder: SortOrder.ASC,
      });
      expect(result.data).toEqual(mockData);
    });

    it('should return all provinces sorted by name descending', async () => {
      const mockData = [...mockTestData.javaProvinces].sort((a, b) =>
        b.name.localeCompare(a.name),
      );
      provinceService.find = vi.fn().mockResolvedValue({ data: mockData });

      const result = await controller.find({
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
      });

      expect(provinceService.find).toHaveBeenCalledOnce();
      expect(provinceService.find).toHaveBeenCalledWith({
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
      });
      expect(result.data).toEqual(mockData);
    });

    it('should return all provinces filtered by name', async () => {
      const testProvName = 'jawa';
      const mockData = mockTestData.javaProvinces.filter((p) =>
        p.name.toLowerCase().includes(testProvName.toLowerCase()),
      );
      provinceService.find = vi.fn().mockResolvedValue({ data: mockData });

      const { data } = await controller.find({
        name: testProvName,
      });

      expect(provinceService.find).toHaveBeenCalledOnce();
      expect(provinceService.find).toHaveBeenCalledWith({
        name: testProvName,
      });
      expect(data).toEqual(mockData);
    });
  });

  describe('findByCode', () => {
    it('should return a province with matching code', async () => {
      const testProvCode = '32';
      const expectedProvince = mockTestData.javaProvinces.find(
        (p) => p.code === testProvCode,
      );
      provinceService.findByCode = vi.fn().mockResolvedValue(expectedProvince);

      const result = await controller.findByCode({ code: testProvCode });

      expect(provinceService.findByCode).toHaveBeenCalledOnce();
      expect(provinceService.findByCode).toHaveBeenCalledWith(testProvCode);
      expect(result).toEqual(expectedProvince);
    });

    it('should throw NotFoundException if there is no matching province', async () => {
      const invalidCode = '00';
      provinceService.findByCode = vi.fn().mockResolvedValue(null);

      await expect(
        controller.findByCode({ code: invalidCode }),
      ).rejects.toThrowError(NotFoundException);
      expect(provinceService.findByCode).toHaveBeenCalledWith(invalidCode);
    });
  });
});
