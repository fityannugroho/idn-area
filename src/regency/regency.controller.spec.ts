import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockTestData } from '@/../test/fixtures/data.fixtures';
import { SortOrder } from '@/sort/sort.dto';
import { RegencyController } from './regency.controller';
import { RegencyService } from './regency.service';

describe('RegencyController', () => {
  let controller: RegencyController;
  let regencyService: RegencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegencyController],
      providers: [
        {
          provide: RegencyService,
          useValue: {
            find: vi.fn(),
            findByCode: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RegencyController>(RegencyController);
    regencyService = module.get<RegencyService>(RegencyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    it('should return all regencies', async () => {
      const mockData = mockTestData.westJavaRegencies;
      regencyService.find = vi.fn().mockResolvedValue({ data: mockData });

      const { data } = await controller.find();

      expect(regencyService.find).toHaveBeenCalledOnce();
      expect(regencyService.find).toHaveBeenCalledWith(undefined);
      expect(data).toEqual(mockData);
    });

    it('should return regencies filtered by name', async () => {
      const testRegencyName = 'bogor';
      const mockData = mockTestData.westJavaRegencies.filter((r) =>
        r.name.toLowerCase().includes(testRegencyName.toLowerCase()),
      );
      regencyService.find = vi.fn().mockResolvedValue({ data: mockData });

      const { data } = await controller.find({ name: testRegencyName });

      expect(regencyService.find).toHaveBeenCalledOnce();
      expect(regencyService.find).toHaveBeenCalledWith({
        name: testRegencyName,
      });
      expect(data).toEqual(mockData);
    });

    it('should return empty array if there is no regency with the corresponding name', async () => {
      regencyService.find = vi.fn().mockResolvedValue({ data: [] });

      const { data } = await controller.find({ name: 'unknown regency' });

      expect(regencyService.find).toHaveBeenCalledOnce();
      expect(data).toEqual([]);
    });

    it('should return regencies filtered and sorted by name ascending', async () => {
      const testRegencyName = 'bogor';
      const mockData = mockTestData.westJavaRegencies
        .filter((r) =>
          r.name.toLowerCase().includes(testRegencyName.toLowerCase()),
        )
        .sort((a, b) => a.name.localeCompare(b.name));
      regencyService.find = vi.fn().mockResolvedValue({ data: mockData });

      const { data } = await controller.find({
        name: testRegencyName,
        sortBy: 'name',
      });

      expect(regencyService.find).toHaveBeenCalledOnce();
      expect(regencyService.find).toHaveBeenCalledWith({
        name: testRegencyName,
        sortBy: 'name',
      });
      expect(data).toEqual(mockData);
    });

    it('should return regencies filtered and sorted by name descending', async () => {
      const testRegencyName = 'bogor';
      const mockData = mockTestData.westJavaRegencies
        .filter((r) =>
          r.name.toLowerCase().includes(testRegencyName.toLowerCase()),
        )
        .sort((a, b) => b.name.localeCompare(a.name));
      regencyService.find = vi.fn().mockResolvedValue({ data: mockData });

      const { data } = await controller.find({
        name: testRegencyName,
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
      });

      expect(regencyService.find).toHaveBeenCalledOnce();
      expect(regencyService.find).toHaveBeenCalledWith({
        name: testRegencyName,
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
      });
      expect(data).toEqual(mockData);
    });

    it('should return regencies filtered by province code', async () => {
      const provinceCode = '32';
      const mockData = mockTestData.westJavaRegencies.filter(
        (r) => r.provinceCode === provinceCode,
      );
      regencyService.find = vi.fn().mockResolvedValue({ data: mockData });

      const { data } = await controller.find({ provinceCode });

      expect(regencyService.find).toHaveBeenCalledOnce();
      expect(regencyService.find).toHaveBeenCalledWith({ provinceCode });
      expect(data).toEqual(mockData);
    });
  });

  describe('findByCode', () => {
    it('should return a regency with matching code', async () => {
      const testRegencyCode = '32.01';
      const expectedRegency = mockTestData.westJavaRegencies.find(
        (r) => r.code === testRegencyCode,
      );
      regencyService.findByCode = vi.fn().mockResolvedValue(expectedRegency);

      const result = await controller.findByCode({
        code: testRegencyCode,
      });

      expect(regencyService.findByCode).toHaveBeenCalledOnce();
      expect(regencyService.findByCode).toHaveBeenCalledWith(testRegencyCode);
      expect(result).toEqual(expectedRegency);
    });

    it('should throw NotFoundException if there is no matching regency', async () => {
      const invalidCode = '0000';
      regencyService.findByCode = vi.fn().mockResolvedValue(null);

      await expect(
        controller.findByCode({ code: invalidCode }),
      ).rejects.toThrowError(NotFoundException);
      expect(regencyService.findByCode).toHaveBeenCalledWith(invalidCode);
    });
  });
});
