import { VillageService } from './village.service';
import { Village } from '@prisma/client';
import { getDBProviderFeatures } from '@/common/utils/db';
import { PrismaService } from '@/prisma/prisma.service';
import { Test } from '@nestjs/testing';

const villages: readonly Village[] = [
  { code: '1101012001', name: 'Desa 1', districtCode: '110101' },
  { code: '1101012002', name: 'Desa 2', districtCode: '110101' },
  { code: '1212121001', name: 'Kampung Karet', districtCode: '121212' },
  { code: '1212121002', name: 'Kampung Berkah', districtCode: '121212' },
] as const;

describe('VillageService', () => {
  let service: VillageService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [VillageService, PrismaService],
    }).compile();

    service = module.get<VillageService>(VillageService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    vitest.resetAllMocks();
  });

  describe('find', () => {
    it('should return all villages', async () => {
      const findManySpy = vitest
        .spyOn(prismaService.village, 'findMany')
        .mockResolvedValue([...villages]);

      const result = await service.find();

      expect(findManySpy).toHaveBeenCalledTimes(1);
      expect(findManySpy).toHaveBeenCalledWith({});
      expect(result).toEqual(villages);
    });

    it('should return filtered villages by name', async () => {
      const testName = 'Desa';
      const expectedVillages = villages.filter((v) =>
        v.name.includes(testName),
      );

      const findManySpy = vitest
        .spyOn(prismaService.village, 'findMany')
        .mockResolvedValue(expectedVillages);

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
      expect(result).toEqual(expectedVillages);
    });

    it('should return all villages sorted by name in ascending order', async () => {
      const expectedVillages = [...villages].sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      const findManySpy = vitest
        .spyOn(prismaService.village, 'findMany')
        .mockResolvedValue(expectedVillages);

      const result = await service.find({ sortBy: 'name' });
      const result2 = await service.find({
        sortBy: 'name',
        sortOrder: 'asc',
      });

      expect(findManySpy).toHaveBeenCalledTimes(2);
      expect(findManySpy).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      });
      expect(result).toEqual(result2);
      expect(result).toEqual(expectedVillages);
    });

    it('should return all villages sorted by name in descending order', async () => {
      const expectedVillages = [...villages]
        .sort((a, b) => a.name.localeCompare(b.name))
        .reverse();

      const findManySpy = vitest
        .spyOn(prismaService.village, 'findMany')
        .mockResolvedValue(expectedVillages);

      const result = await service.find({
        sortBy: 'name',
        sortOrder: 'desc',
      });

      expect(findManySpy).toHaveBeenCalledTimes(1);
      expect(findManySpy).toHaveBeenCalledWith({
        orderBy: { name: 'desc' },
      });
      expect(result).toEqual(expectedVillages);
    });
  });

  describe('findByCode', () => {
    it('should return null when village with the provided code does not exist', async () => {
      const findUniqueSpy = vitest
        .spyOn(prismaService.village, 'findUnique')
        .mockResolvedValue(null);

      const testCode = 'invalid-code';
      const result = await service.findByCode(testCode);

      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { code: testCode },
      });
      expect(result).toBeNull();
    });

    it('should return the village with the provided code', async () => {
      const testCode = '1101012001';
      const expectedVillage = villages.find((v) => v.code === testCode);

      const findUniqueSpy = vitest
        .spyOn(prismaService.village, 'findUnique')
        .mockResolvedValue(expectedVillage);

      const result = await service.findByCode(testCode);

      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { code: testCode },
      });
      expect(result).toEqual(expectedVillage);
    });
  });
});
