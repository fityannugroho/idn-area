import { Test, TestingModule } from '@nestjs/testing';
import { IslandService } from './island.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Island } from '@prisma/client';
import { getDBProviderFeatures } from '@/common/utils/db';

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

describe('IslandService', () => {
  let service: IslandService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IslandService, PrismaService],
    }).compile();

    service = module.get<IslandService>(IslandService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    vitest.resetAllMocks();
  });

  describe('find', () => {
    const paginatorOptions = {
      model: 'Island',
      paginate: { page: undefined, limit: undefined },
      args: {},
    };

    it('should return all islands', async () => {
      const paginatorSpy = vitest
        .spyOn(prismaService, 'paginator')
        .mockResolvedValue({ data: [...islands] });

      const result = await service.find();

      expect(paginatorSpy).toHaveBeenCalledTimes(1);
      expect(paginatorSpy).toHaveBeenCalledWith(paginatorOptions);
      expect(result.data).toEqual(islands);
    });

    it('should return filtered islands by name', async () => {
      const testName = 'Batu';
      const expectedIslands = islands.filter((i) => i.name.includes(testName));

      const paginatorSpy = vitest
        .spyOn(prismaService, 'paginator')
        .mockResolvedValue({ data: expectedIslands });

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
      expect(result.data).toEqual(expectedIslands);
    });

    it('should return islands sorted by name in ascending order', async () => {
      const expectedIslands = [...islands].sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      const paginatorSpy = vitest
        .spyOn(prismaService, 'paginator')
        .mockResolvedValue({ data: expectedIslands });

      const result = await service.find({ sortBy: 'name', sortOrder: 'asc' });

      expect(paginatorSpy).toHaveBeenCalledTimes(1);
      expect(paginatorSpy).toHaveBeenCalledWith({
        ...paginatorOptions,
        args: { orderBy: { name: 'asc' } },
      });
      expect(result.data).toEqual(expectedIslands);
    });

    it('should return islands sorted by name in descending order', async () => {
      const expectedIslands = [...islands].sort((a, b) =>
        b.name.localeCompare(a.name),
      );

      const paginatorSpy = vitest
        .spyOn(prismaService, 'paginator')
        .mockResolvedValue({ data: expectedIslands });

      const result = await service.find({ sortBy: 'name', sortOrder: 'desc' });

      expect(paginatorSpy).toHaveBeenCalledTimes(1);
      expect(paginatorSpy).toHaveBeenCalledWith({
        ...paginatorOptions,
        args: { orderBy: { name: 'desc' } },
      });
      expect(result.data).toEqual(expectedIslands);
    });
  });

  describe('findByCode', () => {
    it('should return an island', async () => {
      const testCode = '110140001';
      const expectedIsland = islands.find((i) => i.code === testCode);

      const findUniqueSpy = vitest
        .spyOn(prismaService.island, 'findUnique')
        .mockResolvedValue(expectedIsland);

      const result = await service.findByCode(testCode);

      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { code: testCode },
      });
      expect(result).toEqual(expectedIsland);
    });

    it('should return null if the island is not found', async () => {
      const testCode = '999999999';

      const findUniqueSpy = vitest
        .spyOn(prismaService.island, 'findUnique')
        .mockResolvedValue(null);

      const result = await service.findByCode(testCode);

      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { code: testCode },
      });
      expect(result).toBeNull();
    });
  });

  describe('addDecimalCoordinate', () => {
    it('should return an island with decimal latitude and longitude', () => {
      const testIsland = islands[0];
      const result = service.addDecimalCoordinate(testIsland);

      expect(result).toEqual({
        ...testIsland,
        latitude: expect.any(Number),
        longitude: expect.any(Number),
      });
    });
  });
});
