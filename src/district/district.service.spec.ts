import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/prisma.service';
import { SortOrder } from '@/sort/sort.dto';
import { mockTestData } from '../../test/fixtures/data.fixtures';

// ✅ Use shared test utilities
import { createMockPrismaService } from '../../test/mocks/prisma.mock';
import { DistrictService } from './district.service';

// Use test data from fixtures
const mockDistricts = mockTestData.bogorDistricts;
const mockRegencies = mockTestData.westJavaRegencies;
const mockProvinces = mockTestData.javaProvinces;

describe('DistrictService', () => {
  let service: DistrictService;
  let mockPrismaService: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    mockPrismaService = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DistrictService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get(DistrictService);

    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  describe('find', () => {
    it('should return all districts', async () => {
      const expectedResponse = { data: mockDistricts };
      mockPrismaService.paginator.mockResolvedValue(expectedResponse);

      const result = await service.find();

      expect(result).toEqual(expectedResponse);
      expect(mockPrismaService.paginator).toHaveBeenCalledWith({
        model: 'District',
        paginate: { page: undefined, limit: undefined },
        args: { where: {} },
      });
    });

    it('should filter districts by name', async () => {
      const testName = 'nanggung';
      const filteredDistricts = mockDistricts.filter((d) =>
        d.name.toLowerCase().includes(testName.toLowerCase()),
      );
      const expectedResponse = { data: filteredDistricts };

      mockPrismaService.paginator.mockResolvedValue(expectedResponse);

      const result = await service.find({ name: testName });

      expect(result).toEqual(expectedResponse);
      expect(mockPrismaService.paginator).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'District',
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

    it('should filter districts by regency code', async () => {
      const regencyCode = '32.01';
      const filteredDistricts = mockDistricts.filter(
        (d) => d.regencyCode === regencyCode,
      );
      const expectedResponse = { data: filteredDistricts };

      mockPrismaService.paginator.mockResolvedValue(expectedResponse);

      const result = await service.find({ regencyCode });

      expect(result).toEqual(expectedResponse);
      expect(mockPrismaService.paginator).toHaveBeenCalledWith({
        model: 'District',
        paginate: { page: undefined, limit: undefined },
        args: { where: { regencyCode } },
      });
    });

    it('should sort districts by name in ascending order', async () => {
      const sortedDistricts = [...mockDistricts].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      const expectedResponse = { data: sortedDistricts };

      mockPrismaService.paginator.mockResolvedValue(expectedResponse);

      const result = await service.find({
        sortBy: 'name',
        sortOrder: SortOrder.ASC,
      });

      expect(result).toEqual(expectedResponse);
      expect(mockPrismaService.paginator).toHaveBeenCalledWith({
        model: 'District',
        paginate: { page: undefined, limit: undefined },
        args: { where: {}, orderBy: { name: 'asc' } },
      });
    });

    it('should sort districts by name in descending order', async () => {
      const sortedDistricts = [...mockDistricts].sort((a, b) =>
        b.name.localeCompare(a.name),
      );
      const expectedResponse = { data: sortedDistricts };

      mockPrismaService.paginator.mockResolvedValue(expectedResponse);

      const result = await service.find({
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
      });

      expect(result).toEqual(expectedResponse);
      expect(mockPrismaService.paginator).toHaveBeenCalledWith({
        model: 'District',
        paginate: { page: undefined, limit: undefined },
        args: { where: {}, orderBy: { name: 'desc' } },
      });
    });
  });

  describe('findByCode', () => {
    it('should return null if there is no match district', async () => {
      const testCode = '999999';

      mockPrismaService.district.findUnique.mockResolvedValue(null);

      const result = await service.findByCode(testCode);

      expect(mockPrismaService.district.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { code: testCode } }),
      );
      expect(result).toBeNull();
    });

    it('should return a district with parent hierarchy', async () => {
      const testCode = '32.01.01';
      const expectedDistrict = mockDistricts.find((d) => d.code === testCode);
      const expectedRegency = mockRegencies.find(
        (r) => r.code === expectedDistrict?.regencyCode,
      );
      const expectedProvince = mockProvinces.find(
        (p) => p.code === expectedRegency?.provinceCode,
      );

      const districtWithHierarchy = {
        ...expectedDistrict,
        regency: {
          ...expectedRegency,
          province: expectedProvince,
        },
      };

      mockPrismaService.district.findUnique.mockResolvedValue(
        districtWithHierarchy,
      );

      const result = await service.findByCode(testCode);

      expect(mockPrismaService.district.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { code: testCode } }),
      );
      expect(result).toEqual({
        ...expectedDistrict,
        parent: {
          regency: expectedRegency,
          province: expectedProvince,
        },
      });
    });
  });
});
