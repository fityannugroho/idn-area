import { getDBProviderFeatures } from '@common/utils/db';
import { PrismaService } from '@/prisma/prisma.service';
import { SortOrder } from '@/sort/sort.dto';
import { Test } from '@nestjs/testing';
import { District, Province, Regency, Village } from '@prisma/client';
import { VillageService } from './village.service';
import { mockPrismaService } from '@/prisma/__mocks__/prisma.service';
import {
  getDistricts,
  getProvinces,
  getRegencies,
  getVillages,
} from '@common/utils/data';

describe('VillageService', () => {
  let villages: Village[];
  let districts: District[];
  let regencies: Regency[];
  let provinces: Province[];
  let service: VillageService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    villages = await getVillages();
    districts = await getDistricts();
    regencies = await getRegencies();
    provinces = await getProvinces();
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        VillageService,
        {
          provide: PrismaService,
          useValue: mockPrismaService('Village', villages),
        },
      ],
    }).compile();

    service = module.get<VillageService>(VillageService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    vitest.resetAllMocks();
  });

  describe('find', () => {
    const paginatorOptions = {
      model: 'Village',
      paginate: { page: undefined, limit: undefined },
      args: { where: {} },
    };

    it('should return all villages', async () => {
      const paginatorSpy = vitest
        .spyOn(prismaService, 'paginator')
        .mockResolvedValue({ data: [...villages] });

      const result = await service.find();

      expect(paginatorSpy).toHaveBeenCalledTimes(1);
      expect(paginatorSpy).toHaveBeenCalledWith(paginatorOptions);
      expect(result.data).toEqual(villages);
    });

    it('should return filtered villages by name', async () => {
      const testName = 'Desa';
      const expectedVillages = villages.filter((v) =>
        v.name.includes(testName),
      );

      const paginatorSpy = vitest
        .spyOn(prismaService, 'paginator')
        .mockResolvedValue({ data: expectedVillages });

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
      expect(result.data).toEqual(expectedVillages);
    });

    it('should return all villages sorted by name in ascending order', async () => {
      const expectedVillages = [...villages].sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      const paginatorSpy = vitest
        .spyOn(prismaService, 'paginator')
        .mockResolvedValue({ data: expectedVillages });

      const result = await service.find({ sortBy: 'name' });
      const result2 = await service.find({
        sortBy: 'name',
        sortOrder: SortOrder.ASC,
      });

      expect(paginatorSpy).toHaveBeenCalledTimes(2);
      expect(paginatorSpy).toHaveBeenCalledWith({
        ...paginatorOptions,
        args: { where: {}, orderBy: { name: 'asc' } },
      });
      expect(result).toEqual(result2);
      expect(result.data).toEqual(expectedVillages);
    });

    it('should return all villages sorted by name in descending order', async () => {
      const expectedVillages = [...villages]
        .sort((a, b) => a.name.localeCompare(b.name))
        .reverse();

      const paginatorSpy = vitest
        .spyOn(prismaService, 'paginator')
        .mockResolvedValue({ data: expectedVillages });

      const result = await service.find({
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
      });

      expect(paginatorSpy).toHaveBeenCalledTimes(1);
      expect(paginatorSpy).toHaveBeenCalledWith({
        ...paginatorOptions,
        args: { where: {}, orderBy: { name: 'desc' } },
      });
      expect(result.data).toEqual(expectedVillages);
    });

    it('should return filtered villages by district code', async () => {
      const districtCode = '110101';
      const expectedVillages = villages.filter(
        (v) => v.districtCode === districtCode,
      );

      const paginatorSpy = vitest
        .spyOn(prismaService, 'paginator')
        .mockResolvedValue({ data: expectedVillages });

      const result = await service.find({ districtCode });

      expect(paginatorSpy).toHaveBeenCalledTimes(1);
      expect(paginatorSpy).toHaveBeenCalledWith({
        ...paginatorOptions,
        args: { where: { districtCode } },
      });
      expect(result.data).toEqual(expectedVillages);
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
      expect(result).toBeNull();
    });

    it('should return the village with the provided code', async () => {
      const testCode = '1101012001';
      const expectedVillage = villages.find((v) => v.code === testCode);
      const expectedDistrict = districts.find(
        (d) => d.code === expectedVillage?.districtCode,
      );
      const expectedRegency = regencies.find(
        (r) => r.code === expectedDistrict?.regencyCode,
      );
      const expectedProvince = provinces.find(
        (p) => p.code === expectedRegency?.provinceCode,
      );

      const findUniqueSpy = vitest
        .spyOn(prismaService.village, 'findUnique')
        .mockResolvedValue({
          ...expectedVillage,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          district: {
            ...expectedDistrict,
            regency: {
              ...expectedRegency,
              province: expectedProvince,
            },
          },
        });

      const result = await service.findByCode(testCode);

      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        ...expectedVillage,
        parent: {
          district: expectedDistrict,
          regency: expectedRegency,
          province: expectedProvince,
        },
      });
    });
  });
});
