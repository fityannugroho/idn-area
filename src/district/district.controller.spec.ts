import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockTestData } from '@/../test/fixtures/data.fixtures';
import { SortOrder } from '@/sort/sort.dto';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';

describe('DistrictController', () => {
  let controller: DistrictController;
  let districtService: DistrictService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DistrictController],
      providers: [
        {
          provide: DistrictService,
          useValue: {
            find: vi.fn(),
            findByCode: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DistrictController>(DistrictController);
    districtService = module.get<DistrictService>(DistrictService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    it('should return all districts', async () => {
      const mockData = mockTestData.bogorDistricts;
      districtService.find = vi.fn().mockResolvedValue({ data: mockData });

      const { data } = await controller.find();

      expect(districtService.find).toHaveBeenCalledOnce();
      expect(districtService.find).toHaveBeenCalledWith(undefined);
      expect(data).toEqual(mockData);
    });

    it('should return districts filtered by name', async () => {
      const testDistrictName = 'nanggung';
      const mockData = mockTestData.bogorDistricts.filter((d) =>
        d.name.toLowerCase().includes(testDistrictName.toLowerCase()),
      );
      districtService.find = vi.fn().mockResolvedValue({ data: mockData });

      const { data } = await controller.find({ name: testDistrictName });

      expect(districtService.find).toHaveBeenCalledOnce();
      expect(districtService.find).toHaveBeenCalledWith({
        name: testDistrictName,
      });
      expect(data).toEqual(mockData);
    });

    it('should return empty array if there is no district with the corresponding name', async () => {
      districtService.find = vi.fn().mockResolvedValue({ data: [] });

      const { data } = await controller.find({ name: 'unknown district' });

      expect(districtService.find).toHaveBeenCalledOnce();
      expect(data).toEqual([]);
    });

    it('should return districts filtered and sorted by name ascending', async () => {
      const testDistrictName = 'nanggung';
      const mockData = mockTestData.bogorDistricts
        .filter((d) =>
          d.name.toLowerCase().includes(testDistrictName.toLowerCase()),
        )
        .sort((a, b) => a.name.localeCompare(b.name));
      districtService.find = vi.fn().mockResolvedValue({ data: mockData });

      const { data } = await controller.find({
        name: testDistrictName,
        sortBy: 'name',
      });

      expect(districtService.find).toHaveBeenCalledOnce();
      expect(districtService.find).toHaveBeenCalledWith({
        name: testDistrictName,
        sortBy: 'name',
      });
      expect(data).toEqual(mockData);
    });

    it('should return districts filtered and sorted by name descending', async () => {
      const testDistrictName = 'nanggung';
      const mockData = mockTestData.bogorDistricts
        .filter((d) =>
          d.name.toLowerCase().includes(testDistrictName.toLowerCase()),
        )
        .sort((a, b) => b.name.localeCompare(a.name));
      districtService.find = vi.fn().mockResolvedValue({ data: mockData });

      const { data } = await controller.find({
        name: testDistrictName,
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
      });

      expect(districtService.find).toHaveBeenCalledOnce();
      expect(districtService.find).toHaveBeenCalledWith({
        name: testDistrictName,
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
      });
      expect(data).toEqual(mockData);
    });

    it('should return districts filtered by regency code', async () => {
      const regencyCode = '32.01';
      const mockData = mockTestData.bogorDistricts.filter(
        (d) => d.regencyCode === regencyCode,
      );
      districtService.find = vi.fn().mockResolvedValue({ data: mockData });

      const { data } = await controller.find({ regencyCode });

      expect(districtService.find).toHaveBeenCalledOnce();
      expect(districtService.find).toHaveBeenCalledWith({ regencyCode });
      expect(data).toEqual(mockData);
    });
  });

  describe('findByCode', () => {
    it('should return a district with matching code', async () => {
      const testDistrictCode = '32.01.01';
      const expectedDistrict = mockTestData.bogorDistricts.find(
        (d) => d.code === testDistrictCode,
      );
      const mockResult = {
        ...expectedDistrict,
        parent: {
          regency: mockTestData.westJavaRegencies[0],
          province: mockTestData.javaProvinces[0],
        },
      };
      districtService.findByCode = vi.fn().mockResolvedValue(mockResult);

      const result = await controller.findByCode({ code: testDistrictCode });

      expect(districtService.findByCode).toHaveBeenCalledOnce();
      expect(districtService.findByCode).toHaveBeenCalledWith(testDistrictCode);
      expect(result).toEqual(mockResult);
    });

    it('should throw NotFoundException if there is no matching district', async () => {
      const invalidCode = '0000';
      districtService.findByCode = vi.fn().mockResolvedValue(null);

      await expect(
        controller.findByCode({ code: invalidCode }),
      ).rejects.toThrowError(NotFoundException);
      expect(districtService.findByCode).toHaveBeenCalledWith(invalidCode);
    });
  });
});
