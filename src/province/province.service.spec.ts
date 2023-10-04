import { getDBProviderFeatures } from '@/common/utils/db';
import { DistrictService } from '@/district/district.service';
import { IslandService } from '@/island/island.service';
import { PrismaService } from '@/prisma/prisma.service';
import { RegencyService } from '@/regency/regency.service';
import { SortOrder } from '@/sort/sort.dto';
import { VillageService } from '@/village/village.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Province, Regency } from '@prisma/client';
import { ProvinceService } from './province.service';

const provinces: readonly Province[] = [
  { code: '11', name: 'ACEH' },
  { code: '12', name: 'SUMATERA UTARA' },
  { code: '32', name: 'JAWA BARAT' },
  { code: '33', name: 'JAWA TENGAH' },
  { code: '34', name: 'DI YOGYAKARTA' },
  { code: '35', name: 'JAWA TIMUR' },
] as const;

const regencies: readonly Regency[] = [
  { code: '1101', name: 'KABUPATEN ACEH SELATAN', provinceCode: '11' },
  { code: '1102', name: 'KABUPATEN ACEH TENGGARA', provinceCode: '11' },
  { code: '1201', name: 'KABUPATEN TAPANULI TENGAH', provinceCode: '12' },
  { code: '1202', name: 'KABUPATEN TAPANULI UTARA', provinceCode: '12' },
  { code: '1271', name: 'KOTA MEDAN', provinceCode: '12' },
] as const;

describe('ProvinceService', () => {
  let provinceService: ProvinceService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProvinceService,
        PrismaService,
        RegencyService,
        DistrictService,
        IslandService,
        VillageService,
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
      const expectedProvince = provinces.find((p) => p.code === testCode);

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

  describe('findRegencies', () => {
    const getPaginatorOptions = (testCode: string) => ({
      model: 'Regency',
      paginate: { limit: undefined, page: undefined },
      args: { where: { provinceCode: testCode }, orderBy: { code: 'asc' } },
    });

    it('should return all regencies in a province', async () => {
      const testCode = '11';
      const expectedRegencies = regencies.filter(
        (r) => r.provinceCode === testCode,
      );

      const paginatorSpy = vitest
        .spyOn(prismaService, 'paginator')
        .mockResolvedValue({ data: expectedRegencies });

      const result = await provinceService.findRegencies(testCode);

      expect(paginatorSpy).toHaveBeenCalledTimes(1);
      expect(paginatorSpy).toHaveBeenCalledWith(getPaginatorOptions(testCode));

      expect(result.data).toEqual(expectedRegencies);
    });

    it('should return empty array if there is no match province code', async () => {
      const testCode = '9999';

      const paginatorSpy = vitest
        .spyOn(prismaService, 'paginator')
        .mockResolvedValue({ data: [] });

      const result = await provinceService.findRegencies(testCode);

      expect(paginatorSpy).toHaveBeenCalledTimes(1);
      expect(paginatorSpy).toHaveBeenCalledWith(getPaginatorOptions(testCode));
      expect(result.data).toEqual([]);
    });

    it.todo(
      'should return regencies sorted by name in ascending order',
      async () => {
        // Test implementation goes here
      },
    );

    it.todo(
      'should return regencies sorted by name in descending order',
      async () => {
        // Test implementation goes here
      },
    );
  });
});
