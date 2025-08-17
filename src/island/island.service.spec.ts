import { Test, TestingModule } from '@nestjs/testing';
import { mockTestData } from '@/../test/fixtures/data.fixtures';
import { createMockPrismaService } from '@/../test/mocks/prisma.mock';
import { extractProvinceCode } from '@/common/utils/code';
import { getDBProviderFeatures } from '@/common/utils/db';
import { PrismaService } from '@/prisma/prisma.service';
import { SortOrder } from '@/sort/sort.dto';
import { IslandService } from './island.service';

describe('IslandService', () => {
  let service: IslandService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IslandService,
        {
          provide: PrismaService,
          useValue: createMockPrismaService(),
        },
      ],
    }).compile();

    service = module.get<IslandService>(IslandService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('find', () => {
    it('should return all islands', async () => {
      const mockData = mockTestData.sampleIslands;
      prismaService.paginator = vi.fn().mockResolvedValue({ data: mockData });

      const result = await service.find();

      expect(prismaService.paginator).toHaveBeenCalledOnce();
      expect(prismaService.paginator).toHaveBeenCalledWith({
        model: 'Island',
        paginate: { page: undefined, limit: undefined },
        args: { where: {} },
      });
      expect(result.data).toEqual(mockData);
    });

    it('should return filtered islands by name', async () => {
      const testName = 'Batu';
      const mockData = mockTestData.sampleIslands.filter((i) =>
        i.name.includes(testName),
      );

      prismaService.paginator = vi.fn().mockResolvedValue({ data: mockData });

      const result = await service.find({ name: testName });

      expect(prismaService.paginator).toHaveBeenCalledOnce();
      expect(prismaService.paginator).toHaveBeenCalledWith({
        model: 'Island',
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

    it('should return islands sorted by name in ascending order', async () => {
      const mockData = [...mockTestData.sampleIslands].sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      prismaService.paginator = vi.fn().mockResolvedValue({ data: mockData });

      const result = await service.find({
        sortBy: 'name',
        sortOrder: SortOrder.ASC,
      });

      expect(prismaService.paginator).toHaveBeenCalledOnce();
      expect(prismaService.paginator).toHaveBeenCalledWith({
        model: 'Island',
        paginate: { page: undefined, limit: undefined },
        args: { where: {}, orderBy: { name: 'asc' } },
      });
      expect(result.data).toEqual(mockData);
    });

    it('should return islands sorted by name in descending order', async () => {
      const mockData = [...mockTestData.sampleIslands].sort((a, b) =>
        b.name.localeCompare(a.name),
      );

      prismaService.paginator = vi.fn().mockResolvedValue({ data: mockData });

      const result = await service.find({
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
      });

      expect(prismaService.paginator).toHaveBeenCalledOnce();
      expect(prismaService.paginator).toHaveBeenCalledWith({
        model: 'Island',
        paginate: { page: undefined, limit: undefined },
        args: { where: {}, orderBy: { name: 'desc' } },
      });
      expect(result.data).toEqual(mockData);
    });

    it('should return filtered islands by regency code', async () => {
      const regencyCode = '32.01';
      const mockData = mockTestData.sampleIslands.filter(
        (i) => i.regencyCode === regencyCode,
      );

      prismaService.paginator = vi.fn().mockResolvedValue({ data: mockData });

      const result = await service.find({ regencyCode });

      expect(prismaService.paginator).toHaveBeenCalledOnce();
      expect(prismaService.paginator).toHaveBeenCalledWith({
        model: 'Island',
        paginate: { page: undefined, limit: undefined },
        args: { where: { regencyCode } },
      });
      expect(result.data).toEqual(mockData);
    });

    it('should return filtered islands that does not belongs to any regency', async () => {
      const regencyCode = '';
      const mockData = mockTestData.sampleIslands.filter(
        (i) => i.regencyCode === null,
      );

      prismaService.paginator = vi.fn().mockResolvedValue({ data: mockData });

      const result = await service.find({ regencyCode });

      expect(prismaService.paginator).toHaveBeenCalledOnce();
      expect(prismaService.paginator).toHaveBeenCalledWith({
        model: 'Island',
        paginate: { page: undefined, limit: undefined },
        args: { where: { regencyCode: null } },
      });
      expect(result.data).toEqual(mockData);
    });

    it('should apply insensitive filtering when supported by provider', async () => {
      const testName = 'test island';
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
    it('should return an island', async () => {
      const testCode = '32.01.40001';
      const expectedIsland =
        mockTestData.sampleIslands.find((i) => i.code === testCode) ||
        mockTestData.sampleIslands[0];
      const expectedRegency =
        mockTestData.westJavaRegencies.find(
          (r) => r.code === expectedIsland.regencyCode,
        ) || mockTestData.westJavaRegencies[0];
      const expectedProvince =
        mockTestData.javaProvinces.find(
          (p) => p.code === expectedRegency.provinceCode,
        ) || mockTestData.javaProvinces[0];

      prismaService.island.findUnique = vi.fn().mockResolvedValue({
        ...expectedIsland,
        regency: { ...expectedRegency, province: expectedProvince },
      });

      const result = await service.findByCode(testCode);

      expect(prismaService.island.findUnique).toHaveBeenCalledOnce();
      expect(prismaService.island.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { code: testCode },
        }),
      );
      expect(result).toEqual({
        ...expectedIsland,
        parent: {
          regency: expectedRegency,
          province: expectedProvince,
        },
      });
    });

    it('should return an island without regency', async () => {
      const testCode = '32.00.40001';
      const expectedIsland = {
        ...mockTestData.sampleIslands[0],
        code: testCode,
        regencyCode: null,
      };
      const expectedProvince =
        mockTestData.javaProvinces.find(
          (p) => p.code === extractProvinceCode(testCode),
        ) || mockTestData.javaProvinces[0];

      prismaService.island.findUnique = vi.fn().mockResolvedValue({
        ...expectedIsland,
        regency: null,
      });

      prismaService.province.findUnique = vi
        .fn()
        .mockResolvedValue(expectedProvince);

      const result = await service.findByCode(testCode);

      expect(prismaService.island.findUnique).toHaveBeenCalledOnce();
      expect(prismaService.island.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { code: testCode },
        }),
      );
      expect(prismaService.province.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { code: extractProvinceCode(testCode) },
        }),
      );
      expect(result).toEqual({
        ...expectedIsland,
        parent: {
          regency: null,
          province: expectedProvince,
        },
      });
    });

    it('should return null if the island is not found', async () => {
      const testCode = '999999999';

      prismaService.island.findUnique = vi.fn().mockResolvedValue(null);

      const result = await service.findByCode(testCode);

      expect(prismaService.island.findUnique).toHaveBeenCalledOnce();
      expect(prismaService.island.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { code: testCode },
        }),
      );
      expect(result).toBeNull();
    });
  });
});
