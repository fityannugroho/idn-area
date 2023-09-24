import { Test, TestingModule } from '@nestjs/testing';
import { District, Village } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { DistrictService } from './district.service';
import { VillageService } from '@/village/village.service';
import { getDBProviderFeatures } from '@/common/utils/db';

const districts: readonly District[] = [
  { code: '110101', name: 'Bakongan', regencyCode: '1101' },
  { code: '110102', name: 'Kluet Utara', regencyCode: '1101' },
  { code: '110103', name: 'Kluet Selatan', regencyCode: '1101' },
];

const villages: readonly Village[] = [
  { code: '1101012001', name: 'Desa 1', districtCode: '110101' },
  { code: '1101012002', name: 'Desa 2', districtCode: '110101' },
  { code: '1212121001', name: 'Kampung Karet', districtCode: '121212' },
  { code: '1212121002', name: 'Kampung Berkah', districtCode: '121212' },
] as const;

describe('DistrictService', () => {
  let service: DistrictService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DistrictService, PrismaService, VillageService],
    }).compile();

    service = module.get<DistrictService>(DistrictService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    vitest.resetAllMocks();
  });

  describe('find', () => {
    it('should return all districts', async () => {
      const findManySpy = vitest
        .spyOn(prismaService.district, 'findMany')
        .mockResolvedValue([...districts]);

      const result = await service.find();

      expect(findManySpy).toHaveBeenCalledTimes(1);
      expect(findManySpy).toHaveBeenCalledWith({});
      expect(result).toEqual(districts);
    });

    it('should return districts filtered by name', async () => {
      const testName = 'Kluet';
      const expectedDistricts = districts.filter((d) =>
        d.name.includes(testName),
      );

      const findManySpy = vitest
        .spyOn(prismaService.district, 'findMany')
        .mockResolvedValue(expectedDistricts);

      const result = await service.find({ name: testName });

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
      expect(result).toEqual(expectedDistricts);
    });

    it('should return districts sorted by name in ascending order', async () => {
      const expectedDistricts = [...districts].sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      const findManySpy = vitest
        .spyOn(prismaService.district, 'findMany')
        .mockResolvedValue(expectedDistricts);

      const result = await service.find({ sortBy: 'name', sortOrder: 'asc' });

      expect(findManySpy).toHaveBeenCalledTimes(1);
      expect(findManySpy).toHaveBeenCalledWith({
        orderBy: {
          name: 'asc',
        },
      });
      expect(result).toEqual(expectedDistricts);
    });

    it('should return districts sorted by name in descending order', async () => {
      const expectedDistricts = [...districts].sort((a, b) =>
        b.name.localeCompare(a.name),
      );

      const findManySpy = vitest
        .spyOn(prismaService.district, 'findMany')
        .mockResolvedValue(expectedDistricts);

      const result = await service.find({ sortBy: 'name', sortOrder: 'desc' });

      expect(findManySpy).toHaveBeenCalledTimes(1);
      expect(findManySpy).toHaveBeenCalledWith({
        orderBy: {
          name: 'desc',
        },
      });
      expect(result).toEqual(expectedDistricts);
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
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: {
          code: testCode,
        },
      });
      expect(result).toBeNull();
    });

    it('should return a district', async () => {
      const testCode = '110101';
      const expectedDistrict = districts.find((d) => d.code === testCode);

      const findUniqueSpy = vitest
        .spyOn(prismaService.district, 'findUnique')
        .mockResolvedValue(expectedDistrict);

      const result = await service.findByCode(testCode);

      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: {
          code: testCode,
        },
      });
      expect(result).toEqual(expectedDistrict);
    });
  });

  describe('findVillages', async () => {
    it('should return null if there is no match district code', async () => {
      const testCode = '999999';

      const findUniqueSpy = vitest
        .spyOn(prismaService.district, 'findUnique')
        .mockReturnValueOnce({
          villages: vitest.fn().mockResolvedValue(null),
        } as any);

      const result = await service.findVillages(testCode);

      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { code: testCode },
      });
      expect(result).toBeNull();
    });

    it('should return all villages in a district', async () => {
      const testCode = '110101';
      const expectedVillages = villages.filter(
        (v) => v.districtCode === testCode,
      );

      const findUniqueSpy = vitest
        .spyOn(prismaService.district, 'findUnique')
        .mockReturnValueOnce({
          villages: vitest.fn().mockResolvedValue(expectedVillages),
        } as any);

      const result = await service.findVillages(testCode);

      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { code: testCode },
      });
      expect(result).toEqual(expectedVillages);
    });
  });
});
