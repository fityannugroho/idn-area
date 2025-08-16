import { Test, TestingModule } from '@nestjs/testing';
import { Province } from '@prisma/client';
import { getProvinces } from '@/common/utils/data';
import { getDBProviderFeatures } from '@/common/utils/db';
import { mockPrismaService } from '@/prisma/__mocks__/prisma.service';
import { PrismaService } from '@/prisma/prisma.service';
import { SortOrder } from '@/sort/sort.dto';
import { ProvinceService } from './province.service';

describe('ProvinceService', () => {
  let provinces: readonly Province[];
  let provinceService: ProvinceService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    provinces = await getProvinces();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProvinceService,
        {
          provide: PrismaService,
          useValue: mockPrismaService('Province', provinces),
        },
      ],
    }).compile();

    provinceService = module.get<ProvinceService>(ProvinceService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    vitest.resetAllMocks();
  });

  describe('find', () => {
    const paginatorOptions = {
      model: 'Province',
      paginate: { limit: undefined, page: undefined },
      args: {},
    };

    it('should return all provinces', async () => {
      const paginatorSpy = vitest
        .spyOn(prismaService, 'paginator')
        .mockResolvedValue({ data: [...provinces] });

      const result = await provinceService.find();

      expect(paginatorSpy).toHaveBeenCalledTimes(1);
      expect(paginatorSpy).toHaveBeenCalledWith(paginatorOptions);
      expect(result.data).toEqual(provinces);
    });

    it('should return provinces filtered by name', async () => {
      const testName = 'jawa';
      const expectedProvinces = provinces.filter((p) =>
        p.name.toLowerCase().includes(testName),
      );

      const paginatorSpy = vitest
        .spyOn(prismaService, 'paginator')
        .mockResolvedValue({ data: expectedProvinces });

      const result = await provinceService.find({ name: testName });

      expect(paginatorSpy).toHaveBeenCalledTimes(1);
      expect(paginatorSpy).toHaveBeenCalledWith({
        ...paginatorOptions,
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
      expect(result.data).toEqual(expectedProvinces);
    });

    it('should return provinces sorted by name in ascending order', async () => {
      const expectedProvinces = [...provinces].sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      const paginatorSpy = vitest
        .spyOn(prismaService, 'paginator')
        .mockResolvedValue({ data: expectedProvinces });

      const result = await provinceService.find({
        sortBy: 'name',
      });

      expect(paginatorSpy).toHaveBeenCalledTimes(1);
      expect(paginatorSpy).toHaveBeenCalledWith({
        ...paginatorOptions,
        args: { orderBy: { name: 'asc' } },
      });
      expect(result.data).toEqual(expectedProvinces);
    });

    it('should return provinces sorted by name in descending order', async () => {
      const expectedProvinces = [...provinces].sort((a, b) =>
        b.name.localeCompare(a.name),
      );

      const paginatorSpy = vitest
        .spyOn(prismaService, 'paginator')
        .mockResolvedValue({ data: expectedProvinces });

      const result = await provinceService.find({
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
      });

      expect(paginatorSpy).toHaveBeenCalledTimes(1);
      expect(paginatorSpy).toHaveBeenCalledWith({
        ...paginatorOptions,
        args: { orderBy: { name: 'desc' } },
      });
      expect(result.data).toEqual(expectedProvinces);
    });
  });

  describe('findByCode', () => {
    it('should return a province when given a valid code', async () => {
      const testCode = '11';
      const expectedProvince =
        provinces.find((p) => p.code === testCode) ?? null;

      const findUniqueSpy = vitest
        .spyOn(prismaService.province, 'findUnique')
        .mockResolvedValue(expectedProvince);

      const result = await provinceService.findByCode(testCode);

      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { code: testCode },
      });
      expect(result).toEqual(expectedProvince);
    });

    it('should return null when given an invalid code', async () => {
      const testCode = '9999';

      const findUniqueSpy = vitest
        .spyOn(prismaService.province, 'findUnique')
        .mockResolvedValue(null);

      const result = await provinceService.findByCode(testCode);

      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { code: testCode },
      });
      expect(result).toBeNull();
    });
  });
});
