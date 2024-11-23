import { getDistricts, getProvinces, getRegencies } from '@/common/utils/data';
import { getDBProviderFeatures } from '@/common/utils/db';
import { mockPrismaService } from '@/prisma/__mocks__/prisma.service';
import { SortOrder } from '@/sort/sort.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { District, Province, Regency } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { DistrictService } from './district.service';

describe('DistrictService', () => {
  let districts: District[];
  let regencies: Regency[];
  let provinces: Province[];
  let service: DistrictService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    districts = await getDistricts();
    regencies = await getRegencies();
    provinces = await getProvinces();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DistrictService,
        {
          provide: PrismaService,
          useValue: mockPrismaService('District', districts),
        },
      ],
    }).compile();

    service = module.get<DistrictService>(DistrictService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    vitest.resetAllMocks();
  });

  describe('find', () => {
    const paginatorOptions = {
      model: 'District',
      paginate: { page: undefined, limit: undefined },
      args: { where: {} },
    };

    it('should return all districts', async () => {
      const paginatorSpy = vitest
        .spyOn(prismaService, 'paginator')
        .mockResolvedValue({ data: [...districts] });

      const result = await service.find();

      expect(paginatorSpy).toHaveBeenCalledTimes(1);
      expect(paginatorSpy).toHaveBeenCalledWith(paginatorOptions);
      expect(result.data).toEqual(districts);
    });

    it('should return districts filtered by name', async () => {
      const testName = 'Kluet';
      const expectedDistricts = districts.filter((d) =>
        d.name.includes(testName),
      );

      const paginatorSpy = vitest
        .spyOn(prismaService, 'paginator')
        .mockResolvedValue({ data: expectedDistricts });

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
      expect(result.data).toEqual(expectedDistricts);
    });

    it('should return districts sorted by name in ascending order', async () => {
      const expectedDistricts = [...districts].sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      const paginatorSpy = vitest
        .spyOn(prismaService, 'paginator')
        .mockResolvedValue({ data: expectedDistricts });

      const result = await service.find({
        sortBy: 'name',
        sortOrder: SortOrder.ASC,
      });

      expect(paginatorSpy).toHaveBeenCalledTimes(1);
      expect(paginatorSpy).toHaveBeenCalledWith({
        ...paginatorOptions,
        args: { where: {}, orderBy: { name: 'asc' } },
      });
      expect(result.data).toEqual(expectedDistricts);
    });

    it('should return districts sorted by name in descending order', async () => {
      const expectedDistricts = [...districts].sort((a, b) =>
        b.name.localeCompare(a.name),
      );

      const paginatorSpy = vitest
        .spyOn(prismaService, 'paginator')
        .mockResolvedValue({ data: expectedDistricts });

      const result = await service.find({
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
      });

      expect(paginatorSpy).toHaveBeenCalledTimes(1);
      expect(paginatorSpy).toHaveBeenCalledWith({
        ...paginatorOptions,
        args: { where: {}, orderBy: { name: 'desc' } },
      });
      expect(result.data).toEqual(expectedDistricts);
    });

    it('should return districts filtered by regency code', async () => {
      const regencyCode = '1101';
      const expectedDistricts = districts.filter(
        (d) => d.regencyCode === regencyCode,
      );

      const paginatorSpy = vitest
        .spyOn(prismaService, 'paginator')
        .mockResolvedValue({ data: expectedDistricts });

      const result = await service.find({ regencyCode });

      expect(paginatorSpy).toHaveBeenCalledTimes(1);
      expect(paginatorSpy).toHaveBeenCalledWith({
        ...paginatorOptions,
        args: { where: { regencyCode } },
      });
      expect(result.data).toEqual(expectedDistricts);
    });
  });

  describe('findByCode', () => {
    it('should return null if there is no match district', async () => {
      const testCode = '999999';

      const findUniqueSpy = vitest
        .spyOn(prismaService.district, 'findUnique')
        .mockResolvedValue(null);

      const result = await service.findByCode(testCode);

      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(findUniqueSpy).toHaveBeenCalledWith(
        expect.objectContaining({ where: { code: testCode } }),
      );
      expect(result).toBeNull();
    });

    it('should return a district', async () => {
      const testCode = '110101';
      const expectedDistrict = districts.find((d) => d.code === testCode);
      const expectedRegency = regencies.find(
        (r) => r.code === expectedDistrict?.regencyCode,
      );
      const expectedProvince = provinces.find(
        (p) => p.code === expectedRegency?.provinceCode,
      );

      const findUniqueSpy = vitest
        .spyOn(prismaService.district, 'findUnique')
        .mockResolvedValue({
          ...expectedDistrict,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          regency: {
            ...expectedRegency,
            province: expectedProvince,
          },
        });

      const result = await service.findByCode(testCode);

      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(findUniqueSpy).toHaveBeenCalledWith(
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
