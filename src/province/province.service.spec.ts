import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/prisma.service';
import { ProvinceService } from './province.service';
import { RegencyService } from '@/regency/regency.service';
import { Province, Regency } from '@prisma/client';
import { getDBProviderFeatures } from '@/common/utils/db';
import { DistrictService } from '@/district/district.service';
import { IslandService } from '@/island/island.service';
import { VillageService } from '@/village/village.service';

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
    it('should return all provinces', async () => {
      const findManySpy = vitest
        .spyOn(prismaService.province, 'findMany')
        .mockResolvedValue([...provinces]);

      const result = await provinceService.find();

      expect(findManySpy).toHaveBeenCalledTimes(1);
      expect(findManySpy).toHaveBeenCalledWith({});
      expect(result).toEqual(provinces);
    });

    it('should return provinces filtered by name', async () => {
      const testName = 'jawa';
      const expectedProvinces = provinces.filter((p) =>
        p.name.toLowerCase().includes(testName),
      );

      const findManySpy = vitest
        .spyOn(prismaService.province, 'findMany')
        .mockResolvedValue(expectedProvinces);

      const result = await provinceService.find({ name: testName });

      expect(findManySpy).toHaveBeenCalledTimes(1);
      expect(findManySpy).toHaveBeenCalledWith({
        where: {
          name: {
            contains: testName,
            ...(getDBProviderFeatures()?.filtering?.insensitive && {
              mode: 'insensitive',
            }),
          },
        },
      });
      expect(result).toEqual(expectedProvinces);
    });

    it('should return provinces sorted by name in ascending order', async () => {
      const expectedProvinces = [...provinces].sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      const findManySpy = vitest
        .spyOn(prismaService.province, 'findMany')
        .mockResolvedValue(expectedProvinces);

      const result = await provinceService.find({
        sortBy: 'name',
      });

      expect(findManySpy).toHaveBeenCalledTimes(1);
      expect(findManySpy).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      });
      expect(result).toEqual(expectedProvinces);
    });

    it('should return provinces sorted by name in descending order', async () => {
      const expectedProvinces = [...provinces].sort((a, b) =>
        b.name.localeCompare(a.name),
      );

      const findManySpy = vitest
        .spyOn(prismaService.province, 'findMany')
        .mockResolvedValue(expectedProvinces);

      const result = await provinceService.find({
        sortBy: 'name',
        sortOrder: 'desc',
      });

      expect(findManySpy).toHaveBeenCalledTimes(1);
      expect(findManySpy).toHaveBeenCalledWith({
        orderBy: { name: 'desc' },
      });
      expect(result).toEqual(expectedProvinces);
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
    it('should return all regencies in a province', async () => {
      const testCode = '11';
      const expectedRegencies = regencies.filter(
        (r) => r.provinceCode === testCode,
      );

      const findUniqueSpy = vitest
        .spyOn(prismaService.province, 'findUnique')
        .mockReturnValue({
          regencies: vitest.fn().mockResolvedValue(expectedRegencies),
        } as any);

      const result = await provinceService.findRegencies(testCode);

      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { code: testCode },
      });
      expect(result).toEqual(expectedRegencies);
    });

    it('should return null if there is no match province code', async () => {
      const testCode = '9999';

      const findUniqueSpy = vitest
        .spyOn(prismaService.province, 'findUnique')
        .mockReturnValue({
          regencies: vitest.fn().mockResolvedValue(null),
        } as any);

      const result = await provinceService.findRegencies(testCode);

      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { code: testCode },
      });
      expect(result).toBeNull();
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
