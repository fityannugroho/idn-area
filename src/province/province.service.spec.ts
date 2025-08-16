import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/prisma.service';
import { SortOrder } from '@/sort/sort.dto';
import { mockTestData } from '../../test/fixtures/data.fixtures';

// ✅ Use shared test utilities
import { createMockPrismaService } from '../../test/mocks/prisma.mock';
import { ProvinceService } from './province.service';

// Use test data from fixtures
const mockProvinces = mockTestData.javaProvinces;

describe('ProvinceService', () => {
  let service: ProvinceService;
  let mockPrismaService: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    mockPrismaService = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProvinceService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get(ProvinceService);

    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  describe('find', () => {
    it('should return all provinces', async () => {
      // Setup: Mock the response we expect from paginator
      const expectedResponse = { data: mockProvinces };
      mockPrismaService.paginator.mockResolvedValue(expectedResponse);

      // Execute: Call the service method
      const result = await service.find();

      // Assert: Check the result matches our expectation
      expect(result).toEqual(expectedResponse);
      expect(mockPrismaService.paginator).toHaveBeenCalledWith({
        model: 'Province',
        paginate: { limit: undefined, page: undefined },
        args: {},
      });
    });

    it('should filter provinces by name', async () => {
      const testName = 'jawa';
      const filteredProvinces = mockProvinces.filter((p) =>
        p.name.toLowerCase().includes(testName.toLowerCase()),
      );
      const expectedResponse = { data: filteredProvinces };

      mockPrismaService.paginator.mockResolvedValue(expectedResponse);

      const result = await service.find({ name: testName });

      expect(result).toEqual(expectedResponse);
      // Verify that paginator was called with the name filter
      expect(mockPrismaService.paginator).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'Province',
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

    it('should sort provinces by name in ascending order', async () => {
      const sortedProvinces = [...mockProvinces].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      const expectedResponse = { data: sortedProvinces };

      mockPrismaService.paginator.mockResolvedValue(expectedResponse);

      const result = await service.find({ sortBy: 'name' });

      expect(result).toEqual(expectedResponse);
      expect(mockPrismaService.paginator).toHaveBeenCalledWith({
        model: 'Province',
        paginate: { limit: undefined, page: undefined },
        args: { orderBy: { name: 'asc' } },
      });
    });

    it('should sort provinces by name in descending order', async () => {
      const sortedProvinces = [...mockProvinces].sort((a, b) =>
        b.name.localeCompare(a.name),
      );
      const expectedResponse = { data: sortedProvinces };

      mockPrismaService.paginator.mockResolvedValue(expectedResponse);

      const result = await service.find({
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
      });

      expect(result).toEqual(expectedResponse);
      expect(mockPrismaService.paginator).toHaveBeenCalledWith({
        model: 'Province',
        paginate: { limit: undefined, page: undefined },
        args: { orderBy: { name: 'desc' } },
      });
    });
  });

  describe('findByCode', () => {
    it('should return a province when given a valid code', async () => {
      const testCode = '11';
      const expectedProvince =
        mockProvinces.find((p) => p.code === testCode) ?? null;

      mockPrismaService.province.findUnique.mockResolvedValue(expectedProvince);

      const result = await service.findByCode(testCode);

      expect(result).toEqual(expectedProvince);
      expect(mockPrismaService.province.findUnique).toHaveBeenCalledWith({
        where: { code: testCode },
      });
    });

    it('should return null when given an invalid code', async () => {
      const testCode = '9999';

      mockPrismaService.province.findUnique.mockResolvedValue(null);

      const result = await service.findByCode(testCode);

      expect(result).toBeNull();
      expect(mockPrismaService.province.findUnique).toHaveBeenCalledWith({
        where: { code: testCode },
      });
    });
  });
});
