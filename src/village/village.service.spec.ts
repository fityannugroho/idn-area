import { Test } from '@nestjs/testing';
import { mockTestData } from '@/../test/fixtures/data.fixtures';
import { createMockPrismaService } from '@/../test/mocks/prisma.mock';
import { getDBProviderFeatures } from '@/common/utils/db';
import { PrismaService } from '@/prisma/prisma.service';
import { SortOrder } from '@/sort/sort.dto';
import { VillageService } from './village.service';

describe('VillageService', () => {
  let service: VillageService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        VillageService,
        {
          provide: PrismaService,
          useValue: createMockPrismaService(),
        },
      ],
    }).compile();

    service = module.get<VillageService>(VillageService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('find', () => {
    it('should return all villages', async () => {
      const mockData = mockTestData.sampleVillages;
      prismaService.paginator = vi.fn().mockResolvedValue({ data: mockData });

      const result = await service.find();

      expect(prismaService.paginator).toHaveBeenCalledOnce();
      expect(prismaService.paginator).toHaveBeenCalledWith({
        model: 'Village',
        paginate: { page: undefined, limit: undefined },
        args: { where: {} },
      });
      expect(result.data).toEqual(mockData);
    });

    it('should return filtered villages by name', async () => {
      const testName = 'Desa';
      const mockData = mockTestData.sampleVillages.filter((v) =>
        v.name.includes(testName),
      );

      prismaService.paginator = vi.fn().mockResolvedValue({ data: mockData });

      const result = await service.find({ name: testName });

      expect(prismaService.paginator).toHaveBeenCalledOnce();
      expect(prismaService.paginator).toHaveBeenCalledWith({
        model: 'Village',
        paginate: { page: undefined, limit: undefined },
        args: {
          where: {
            name: {
              contains: testName,
              ...(getDBProviderFeatures()?.filtering?.insensitive && {
                mode: 'insensitive',
              }),
            },
          },
        },
      });
      expect(result.data).toEqual(mockData);
    });

    it('should return all villages sorted by name in ascending order', async () => {
      const mockData = [...mockTestData.sampleVillages].sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      prismaService.paginator = vi.fn().mockResolvedValue({ data: mockData });

      const result = await service.find({ sortBy: 'name' });
      const result2 = await service.find({
        sortBy: 'name',
        sortOrder: SortOrder.ASC,
      });

      expect(prismaService.paginator).toHaveBeenCalledTimes(2);
      expect(prismaService.paginator).toHaveBeenCalledWith({
        model: 'Village',
        paginate: { page: undefined, limit: undefined },
        args: { where: {}, orderBy: { name: 'asc' } },
      });
      expect(result).toEqual(result2);
      expect(result.data).toEqual(mockData);
    });

    it('should return all villages sorted by name in descending order', async () => {
      const mockData = [...mockTestData.sampleVillages]
        .sort((a, b) => a.name.localeCompare(b.name))
        .reverse();

      prismaService.paginator = vi.fn().mockResolvedValue({ data: mockData });

      const result = await service.find({
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
      });

      expect(prismaService.paginator).toHaveBeenCalledOnce();
      expect(prismaService.paginator).toHaveBeenCalledWith({
        model: 'Village',
        paginate: { page: undefined, limit: undefined },
        args: { where: {}, orderBy: { name: 'desc' } },
      });
      expect(result.data).toEqual(mockData);
    });

    it('should return filtered villages by district code', async () => {
      const districtCode = '32.01.01.02';
      const mockData = mockTestData.sampleVillages.filter(
        (v) => v.districtCode === districtCode,
      );

      prismaService.paginator = vi.fn().mockResolvedValue({ data: mockData });

      const result = await service.find({ districtCode });

      expect(prismaService.paginator).toHaveBeenCalledOnce();
      expect(prismaService.paginator).toHaveBeenCalledWith({
        model: 'Village',
        paginate: { page: undefined, limit: undefined },
        args: { where: { districtCode } },
      });
      expect(result.data).toEqual(mockData);
    });

    it('should apply insensitive filtering when supported by provider', async () => {
      const testName = 'test village';
      const expectedResponse = { data: [] };

      // Mock getDBProviderFeatures to return filtering with insensitive mode
      const getDBProviderFeatures = await import('@/common/utils/db');
      const spy = vi
        .spyOn(getDBProviderFeatures, 'getDBProviderFeatures')
        .mockReturnValue({
          filtering: { insensitive: true },
        });

      prismaService.paginator = vi.fn().mockResolvedValue(expectedResponse);

      const result = await service.find({ name: testName });

      expect(result).toEqual(expectedResponse);
      expect(prismaService.paginator).toHaveBeenCalledWith(
        expect.objectContaining({
          args: expect.objectContaining({
            where: expect.objectContaining({
              name: expect.objectContaining({
                contains: testName,
                mode: 'insensitive',
              }),
            }),
          }),
        }),
      );

      // Clean up
      spy.mockRestore();
    });
  });

  describe('findByCode', () => {
    it('should return null when village with the provided code does not exist', async () => {
      prismaService.village.findUnique = vi.fn().mockResolvedValue(null);

      const testCode = 'invalid-code';
      const result = await service.findByCode(testCode);

      expect(prismaService.village.findUnique).toHaveBeenCalledOnce();
      expect(prismaService.village.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { code: testCode } }),
      );
      expect(result).toBeNull();
    });

    it('should return the village with the provided code', async () => {
      const testCode = '32.01.01.02.2001';
      const expectedVillage =
        mockTestData.sampleVillages.find((v) => v.code === testCode) ||
        mockTestData.sampleVillages[0];
      const expectedDistrict =
        mockTestData.bogorDistricts.find(
          (d) => d.code === expectedVillage.districtCode,
        ) || mockTestData.bogorDistricts[0];
      const expectedRegency =
        mockTestData.westJavaRegencies.find(
          (r) => r.code === expectedDistrict.regencyCode,
        ) || mockTestData.westJavaRegencies[0];
      const expectedProvince =
        mockTestData.javaProvinces.find(
          (p) => p.code === expectedRegency.provinceCode,
        ) || mockTestData.javaProvinces[0];

      prismaService.village.findUnique = vi.fn().mockResolvedValue({
        ...expectedVillage,
        district: {
          ...expectedDistrict,
          regency: {
            ...expectedRegency,
            province: expectedProvince,
          },
        },
      });

      const result = await service.findByCode(testCode);

      expect(prismaService.village.findUnique).toHaveBeenCalledOnce();
      expect(prismaService.village.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { code: testCode } }),
      );
      expect(result).toEqual({
        ...expectedVillage,
        parent: {
          district: expectedDistrict,
          regency: expectedRegency,
          province: expectedProvince,
        },
      });
    });
  });
});
