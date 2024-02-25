import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/prisma.service';
import { RegencyService } from './regency.service';
import { Province, Regency } from '@prisma/client';
import { getDBProviderFeatures } from '@common/utils/db';
import { SortOrder } from '@/sort/sort.dto';
import { getProvinces, getRegencies } from '@common/utils/data';
import { mockPrismaService } from '@/prisma/__mocks__/prisma.service';

describe('RegencyService', () => {
  let regencies: Regency[];
  let provinces: Province[];
  let service: RegencyService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    regencies = await getRegencies();
    provinces = await getProvinces();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegencyService,
        {
          provide: PrismaService,
          useValue: mockPrismaService('Regency', regencies),
        },
      ],
    }).compile();

    service = module.get<RegencyService>(RegencyService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    vitest.resetAllMocks();
  });

  describe('find', () => {
    const paginatorOptions = {
      model: 'Regency',
      paginate: { limit: undefined, page: undefined },
      args: {},
    };

    it('should return all regencies ', async () => {
      const paginatorSpy = vitest
        .spyOn(prismaService, 'paginator')
        .mockResolvedValue({ data: [...regencies] });

      const result = await service.find();

      expect(paginatorSpy).toHaveBeenCalledTimes(1);
      expect(paginatorSpy).toHaveBeenCalledWith({
        ...paginatorOptions,
        args: { where: {} },
      });
      expect(result.data).toEqual(regencies);
    });

    it('should filter regencies by name', async () => {
      const testName = 'aceh';
      const expectedRegencies = regencies.filter((r) =>
        r.name.toLowerCase().includes(testName),
      );

      const paginatorSpy = vitest
        .spyOn(prismaService, 'paginator')
        .mockResolvedValue({ data: expectedRegencies });

      const result = await service.find({ name: testName });

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
      expect(result.data).toEqual(expectedRegencies);
    });

    it('should filter regencies by province code', async () => {
      const provinceCode = '11';
      const expectedRegencies = regencies.filter((r) =>
        r.provinceCode.includes(provinceCode),
      );

      const paginatorSpy = vitest
        .spyOn(prismaService, 'paginator')
        .mockResolvedValue({ data: expectedRegencies });

      const result = await service.find({ provinceCode });

      expect(paginatorSpy).toHaveBeenCalledTimes(1);
      expect(paginatorSpy).toHaveBeenCalledWith({
        ...paginatorOptions,
        args: { where: { provinceCode } },
      });
      expect(result.data).toEqual(expectedRegencies);
    });

    it('should sort regencies by name in ascending order by default', async () => {
      const expectedRegencies = [...regencies].sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      const paginatorSpy = vitest
        .spyOn(prismaService, 'paginator')
        .mockResolvedValue({ data: expectedRegencies });

      const result = await service.find({ sortBy: 'name' });

      expect(paginatorSpy).toHaveBeenCalledTimes(1);
      expect(paginatorSpy).toHaveBeenCalledWith({
        ...paginatorOptions,
        args: { where: {}, orderBy: { name: 'asc' } },
      });
      expect(result.data).toEqual(expectedRegencies);
    });

    it('should sort regencies by name in descending order', async () => {
      const expectedRegencies = [...regencies].sort((a, b) =>
        b.name.localeCompare(a.name),
      );

      const findManySpy = vitest
        .spyOn(prismaService, 'paginator')
        .mockResolvedValue({ data: expectedRegencies });

      const result = await service.find({
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
      });

      expect(findManySpy).toHaveBeenCalledTimes(1);
      expect(findManySpy).toHaveBeenCalledWith({
        ...paginatorOptions,
        args: { where: {}, orderBy: { name: 'desc' } },
      });
      expect(result.data).toEqual(expectedRegencies);
    });
  });

  describe('findByCode', () => {
    it('should return a regency with its province', async () => {
      const expectedRegency = regencies[0];
      const expectedProvince = provinces.find(
        (p) => p.code === expectedRegency.provinceCode,
      );

      const findUniqueSpy = vitest
        .spyOn(prismaService.regency, 'findUnique')
        .mockReturnValue({
          ...expectedRegency,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          province: expectedProvince,
        });

      const result = await service.findByCode(expectedRegency.code);

      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(findUniqueSpy).toHaveBeenCalledWith(
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
      const findUniqueSpy = vitest
        .spyOn(prismaService.regency, 'findUnique')
        .mockResolvedValue(null);

      const result = await service.findByCode(testCode);

      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(findUniqueSpy).toHaveBeenCalledWith(
        expect.objectContaining({ where: { code: testCode } }),
      );
      expect(result).toBeNull();
    });
  });
});
