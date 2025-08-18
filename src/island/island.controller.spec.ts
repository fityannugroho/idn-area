import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockTestData } from '@/../test/fixtures/data.fixtures';
import { SortOrder } from '@/sort/sort.dto';
import { IslandController } from './island.controller';
import { Island } from './island.dto';
import { IslandService } from './island.service';

describe('IslandController', () => {
  let controller: IslandController;
  let islandService: IslandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IslandController],
      providers: [
        {
          provide: IslandService,
          useValue: {
            find: vi.fn(),
            findByCode: vi.fn(),
            _addDecimalCoordinate: vi.fn((island: Island) => island),
          },
        },
      ],
    }).compile();

    controller = module.get<IslandController>(IslandController);
    islandService = module.get<IslandService>(IslandService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    it('should return all islands', async () => {
      const mockData = mockTestData.sampleIslands;
      islandService.find = vi.fn().mockResolvedValue({ data: mockData });

      const result = await controller.find();
      const { data } = result;

      expect(islandService.find).toHaveBeenCalledOnce();
      expect(islandService.find).toHaveBeenCalledWith(undefined);
      expect(data).toEqual(mockData);
    });

    it('should return islands filtered by name', async () => {
      const testIslandName = 'PULAU';
      const mockData = mockTestData.sampleIslands.filter((i) =>
        i.name.toUpperCase().includes(testIslandName.toUpperCase()),
      );
      islandService.find = vi.fn().mockResolvedValue({ data: mockData });

      const result = await controller.find({ name: testIslandName });
      const { data } = result;

      expect(islandService.find).toHaveBeenCalledOnce();
      expect(islandService.find).toHaveBeenCalledWith({ name: testIslandName });
      expect(data).toEqual(mockData);
    });

    it('should return empty array if there is no island with the corresponding name', async () => {
      islandService.find = vi.fn().mockResolvedValue({ data: [] });

      const { data } = await controller.find({ name: 'unknown island' });

      expect(islandService.find).toHaveBeenCalledOnce();
      expect(data).toEqual([]);
    });

    it('should return islands filtered and sorted by name ascending', async () => {
      const testName = 'PULAU';
      const mockData = mockTestData.sampleIslands
        .filter((i) => i.name.toUpperCase().includes(testName.toUpperCase()))
        .sort((a, b) => a.name.localeCompare(b.name));
      islandService.find = vi.fn().mockResolvedValue({ data: mockData });

      const result = await controller.find({
        name: testName,
        sortBy: 'name',
      });
      const { data } = result;

      expect(islandService.find).toHaveBeenCalledWith({
        name: testName,
        sortBy: 'name',
      });
      expect(data).toEqual(mockData);
    });

    it('should return islands filtered and sorted by name descending', async () => {
      const testName = 'PULAU';
      const mockData = mockTestData.sampleIslands
        .filter((i) => i.name.toUpperCase().includes(testName.toUpperCase()))
        .sort((a, b) => b.name.localeCompare(a.name));
      islandService.find = vi.fn().mockResolvedValue({ data: mockData });

      const result = await controller.find({
        name: testName,
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
      });
      const { data } = result;

      expect(islandService.find).toHaveBeenCalledWith({
        name: testName,
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
      });
      expect(data).toEqual(mockData);
    });

    it('should return islands filtered by regency code', async () => {
      const regencyCode = '32.01';
      const mockData = mockTestData.sampleIslands.filter(
        (i) => i.regencyCode === regencyCode,
      );
      islandService.find = vi.fn().mockResolvedValue({ data: mockData });

      const { data } = await controller.find({ regencyCode });

      expect(islandService.find).toHaveBeenCalledOnce();
      expect(islandService.find).toHaveBeenCalledWith({ regencyCode });
      expect(data).toEqual(mockData);
    });

    it('should return islands that do not belong to any regency', async () => {
      const regencyCode = '';
      const mockData = mockTestData.sampleIslands.filter(
        (i) => i.regencyCode === null,
      );
      islandService.find = vi.fn().mockResolvedValue({ data: mockData });

      const { data } = await controller.find({ regencyCode });

      expect(islandService.find).toHaveBeenCalledOnce();
      expect(islandService.find).toHaveBeenCalledWith({ regencyCode });
      expect(data).toEqual(mockData);
    });
  });

  describe('findByCode', () => {
    it('should return an island with matching code', async () => {
      const testIslandCode = '32.01.40001';
      const expectedIsland = mockTestData.sampleIslands.find(
        (i) => i.code === testIslandCode,
      );
      const mockResult = {
        ...expectedIsland,
        parent: {
          regency: mockTestData.westJavaRegencies[0],
          province: mockTestData.javaProvinces[0],
        },
      };
      islandService.findByCode = vi.fn().mockResolvedValue(mockResult);

      const result = await controller.findByCode({ code: testIslandCode });

      expect(islandService.findByCode).toHaveBeenCalledOnce();
      expect(islandService.findByCode).toHaveBeenCalledWith(testIslandCode);
      expect(result).toEqual(mockResult);
    });

    it('should return an island without regency', async () => {
      const testIslandCode = '32.00.40001';
      const expectedIsland = mockTestData.sampleIslands.find(
        (i) => i.regencyCode === null,
      );
      const mockResult = {
        ...expectedIsland,
        parent: {
          regency: null,
          province: mockTestData.javaProvinces[0],
        },
      };
      islandService.findByCode = vi.fn().mockResolvedValue(mockResult);

      const result = await controller.findByCode({ code: testIslandCode });

      expect(islandService.findByCode).toHaveBeenCalledOnce();
      expect(islandService.findByCode).toHaveBeenCalledWith(testIslandCode);
      expect(result).toEqual(mockResult);
    });

    it('should throw NotFoundException if there is no matching island', async () => {
      const invalidCode = '0000';
      islandService.findByCode = vi.fn().mockResolvedValue(null);

      await expect(
        controller.findByCode({ code: invalidCode }),
      ).rejects.toThrowError(NotFoundException);
      expect(islandService.findByCode).toHaveBeenCalledWith(invalidCode);
    });
  });
});
