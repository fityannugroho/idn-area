import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/prisma.service';
import { RegencyService } from './regency.service';
import { DistrictService } from '@/district/district.service';
import { IslandService } from '@/island/island.service';
import { District, Island, Regency } from '@prisma/client';
import { VillageService } from '@/village/village.service';
import { getDBProviderFeatures } from '@/common/utils/db';

const regencies: readonly Regency[] = [
  { code: '1101', name: 'KABUPATEN ACEH SELATAN', provinceCode: '11' },
  { code: '1102', name: 'KABUPATEN ACEH TENGGARA', provinceCode: '11' },
  { code: '1201', name: 'KABUPATEN TAPANULI TENGAH', provinceCode: '12' },
  { code: '1202', name: 'KABUPATEN TAPANULI UTARA', provinceCode: '12' },
  { code: '1271', name: 'KOTA MEDAN', provinceCode: '12' },
] as const;

const districts: readonly District[] = [
  { code: '110101', name: 'Bakongan', regencyCode: '1101' },
  { code: '110102', name: 'Kluet Utara', regencyCode: '1101' },
  { code: '110103', name: 'Kluet Selatan', regencyCode: '1101' },
];

const islands: readonly Island[] = [
  {
    code: '110140001',
    coordinate: '03°19\'03.44" N 097°07\'41.73" E',
    isOutermostSmall: false,
    isPopulated: false,
    name: 'Pulau Batukapal',
    regencyCode: '1101',
  },
  {
    code: '110140002',
    coordinate: '03°24\'55.00" N 097°04\'21.00" E',
    isOutermostSmall: false,
    isPopulated: false,
    name: 'Pulau Batutunggal',
    regencyCode: '1101',
  },
  {
    code: '110140003',
    coordinate: '02°52\'54.99" N 097°31\'07.00" E',
    isOutermostSmall: false,
    isPopulated: false,
    name: 'Pulau Kayee',
    regencyCode: '1101',
  },
  {
    code: '110140004',
    coordinate: '02°54\'25.11" N 097°26\'18.51" E',
    isOutermostSmall: false,
    isPopulated: true,
    name: 'Pulau Mangki Palsu',
    regencyCode: '1101',
  },
  {
    code: '110140005',
    coordinate: '02°53\'16.00" N 097°30\'54.00" E',
    isOutermostSmall: true,
    isPopulated: false,
    name: 'Pulau Tengku Palsu',
    regencyCode: '1101',
  },
] as const;

describe('RegencyService', () => {
  let service: RegencyService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegencyService,
        PrismaService,
        DistrictService,
        IslandService,
        VillageService,
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
      expect(paginatorSpy).toHaveBeenCalledWith(paginatorOptions);
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
        args: { orderBy: { name: 'asc' } },
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

      const result = await service.find({ sortBy: 'name', sortOrder: 'desc' });

      expect(findManySpy).toHaveBeenCalledTimes(1);
      expect(findManySpy).toHaveBeenCalledWith({
        ...paginatorOptions,
        args: { orderBy: { name: 'desc' } },
      });
      expect(result.data).toEqual(expectedRegencies);
    });
  });

  describe('findByCode', () => {
    it('should return a regency', async () => {
      const expectedRegency = regencies[0];

      const findUniqueSpy = vitest
        .spyOn(prismaService.regency, 'findUnique')
        .mockResolvedValue(expectedRegency);

      const result = await service.findByCode(expectedRegency.code);

      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { code: expectedRegency.code },
      });
      expect(result).toEqual(expectedRegency);
    });

    it('should return null when no regency is found', async () => {
      const testCode = '9999';
      const findUniqueSpy = vitest
        .spyOn(prismaService.regency, 'findUnique')
        .mockResolvedValue(null);

      const result = await service.findByCode(testCode);

      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { code: testCode },
      });
      expect(result).toBeNull();
    });
  });

  describe('findDistricts', () => {
    it('should return all districts in a regency', async () => {
      const testCode = '1101';
      const expectedDistricts = districts.filter(
        (d) => d.regencyCode === testCode,
      );

      const findUniqueSpy = vitest
        .spyOn(prismaService.regency, 'findUnique')
        .mockReturnValue({
          districts: vitest.fn().mockResolvedValue(expectedDistricts),
        } as any);

      const result = await service.findDistricts(testCode);

      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { code: testCode },
      });
      expect(result).toEqual(expectedDistricts);
    });

    it('should return null if there is no match regency code', async () => {
      const testCode = '9999';

      const findUniqueSpy = vitest
        .spyOn(prismaService.regency, 'findUnique')
        .mockReturnValue({
          districts: vitest.fn().mockResolvedValue(null),
        } as any);

      const result = await service.findDistricts(testCode);

      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { code: testCode },
      });
      expect(result).toBeNull();
    });

    it.todo('should sort districts by name in ascending order', async () => {
      const testCode = '1101';
      const expectedDistricts = [...districts].sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      const findUniqueSpy = vitest
        .spyOn(prismaService.regency, 'findUnique')
        .mockReturnValue({
          districts: vitest.fn().mockResolvedValue(expectedDistricts),
        } as any);

      const result = await service.findDistricts(testCode, {
        sortBy: 'name',
      });

      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { code: testCode },
      });
      // TODO: test if findUnique().districts() is called with the sort options
      expect(result).toEqual(expectedDistricts);
    });

    it.todo('should sort districts by name in descending order', async () => {
      //
    });
  });

  describe.todo('findIslands', () => {
    it('should return all islands in a regency', async () => {
      const testCode = '1101';
      const expectedIslands = islands.filter((i) => i.regencyCode === testCode);

      const findUniqueSpy = vitest
        .spyOn(prismaService.regency, 'findUnique')
        .mockReturnValue({
          islands: vitest.fn().mockResolvedValue(expectedIslands),
        } as any);

      const result = await service.findIslands(testCode);

      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { code: testCode },
      });
      expect(result).toEqual(expectedIslands);
    });

    it('should return null if there is no match regency code', async () => {
      const testCode = '9999';

      const findUniqueSpy = vitest
        .spyOn(prismaService.regency, 'findUnique')
        .mockReturnValue({
          islands: vitest.fn().mockResolvedValue(null),
        } as any);

      const result = await service.findIslands(testCode);

      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { code: testCode },
      });
      expect(result).toBeNull();
    });

    it.todo('should sort islands by code in ascending order ', async () => {
      //
    });

    it.todo('should sort islands by code in descending order', async () => {
      //
    });
  });
});
