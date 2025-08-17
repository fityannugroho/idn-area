import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/prisma.service';
import { SortOrder } from '@/sort/sort.dto';
import { mockTestData } from '../../test/fixtures/data.fixtures';

// ✅ Use shared test utilities
import { createMockPrismaService } from '../../test/mocks/prisma.mock';
import { RegencyService } from './regency.service';

// Use test data from fixtures
const mockRegencies = mockTestData.westJavaRegencies;
const mockProvinces = mockTestData.javaProvinces;

describe('RegencyService', () => {
  let service: RegencyService;
  let mockPrismaService: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    mockPrismaService = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegencyService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get(RegencyService);

    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  describe('find', () => {
    it('should return all regencies', async () => {
      const expectedResponse = { data: mockRegencies };
      mockPrismaService.paginator.mockResolvedValue(expectedResponse);

      const result = await service.find();

      expect(result).toEqual(expectedResponse);
      expect(mockPrismaService.paginator).toHaveBeenCalledWith({
        model: 'Regency',
        paginate: { limit: undefined, page: undefined },
        args: { where: {} },
      });
    });

    it('should filter regencies by name', async () => {
      const testName = 'bogor';
      const filteredRegencies = mockRegencies.filter((r) =>
        r.name.toLowerCase().includes(testName.toLowerCase()),
      );
      const expectedResponse = { data: filteredRegencies };

      mockPrismaService.paginator.mockResolvedValue(expectedResponse);

      const result = await service.find({ name: testName });

      expect(result).toEqual(expectedResponse);
      expect(mockPrismaService.paginator).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'Regency',
          args: expect.objectContaining({
            where: expect.objectContaining({
              name: expect.objectContaining({
                contains: testName,
              }),
            }),
          }),
        }),
      );
    });

    it('should filter regencies by province code', async () => {
      const provinceCode = '32';
      const filteredRegencies = mockRegencies.filter(
        (r) => r.provinceCode === provinceCode,
      );
      const expectedResponse = { data: filteredRegencies };

      mockPrismaService.paginator.mockResolvedValue(expectedResponse);

      const result = await service.find({ provinceCode });

      expect(result).toEqual(expectedResponse);
      expect(mockPrismaService.paginator).toHaveBeenCalledWith({
        model: 'Regency',
        paginate: { limit: undefined, page: undefined },
        args: { where: { provinceCode } },
      });
    });

    it('should sort regencies by name in ascending order', async () => {
      const sortedRegencies = [...mockRegencies].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      const expectedResponse = { data: sortedRegencies };

      mockPrismaService.paginator.mockResolvedValue(expectedResponse);

      const result = await service.find({ sortBy: 'name' });

      expect(result).toEqual(expectedResponse);
      expect(mockPrismaService.paginator).toHaveBeenCalledWith({
        model: 'Regency',
        paginate: { limit: undefined, page: undefined },
        args: { where: {}, orderBy: { name: 'asc' } },
      });
    });

    it('should sort regencies by name in descending order', async () => {
      const sortedRegencies = [...mockRegencies].sort((a, b) =>
        b.name.localeCompare(a.name),
      );
      const expectedResponse = { data: sortedRegencies };

      mockPrismaService.paginator.mockResolvedValue(expectedResponse);

      const result = await service.find({
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
      });

      expect(result).toEqual(expectedResponse);
      expect(mockPrismaService.paginator).toHaveBeenCalledWith({
        model: 'Regency',
        paginate: { limit: undefined, page: undefined },
        args: { where: {}, orderBy: { name: 'desc' } },
      });
    });

    it('should apply insensitive filtering when supported by provider', async () => {
      const testName = 'test regency';
      const expectedResponse = { data: [] };

      // Mock getDBProviderFeatures to return filtering with insensitive mode
      const getDBProviderFeatures = await import('@/common/utils/db');
      const spy = vi
        .spyOn(getDBProviderFeatures, 'getDBProviderFeatures')
        .mockReturnValue({
          filtering: { insensitive: true },
        });

      mockPrismaService.paginator.mockResolvedValue(expectedResponse);

      const result = await service.find({ name: testName });

      expect(result).toEqual(expectedResponse);
      expect(mockPrismaService.paginator).toHaveBeenCalledWith(
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
    it('should return a regency with its province', async () => {
      const expectedRegency = mockRegencies[0];
      const expectedProvince = mockProvinces.find(
        (p) => p.code === expectedRegency.provinceCode,
      );

      const regencyWithProvince = {
        ...expectedRegency,
        province: expectedProvince,
      };

      mockPrismaService.regency.findUnique.mockResolvedValue(
        regencyWithProvince,
      );

      const result = await service.findByCode(expectedRegency.code);

      expect(mockPrismaService.regency.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { code: expectedRegency.code } }),
      );

      expect(result).toEqual({
        ...expectedRegency,
        parent: {
          province: expectedProvince,
        },
      });
    });

    it('should return null when no regency is found', async () => {
      const testCode = '9999';

      mockPrismaService.regency.findUnique.mockResolvedValue(null);

      const result = await service.findByCode(testCode);

      expect(mockPrismaService.regency.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { code: testCode } }),
      );
      expect(result).toBeNull();
    });
  });
});
