import { Test } from '@nestjs/testing';
import { Province } from '@prisma/client';
import { appConfig } from '@/common/config/app';
import { PaginatorOptions } from './prisma.interface';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    vi.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    // Must implement OnModuleInit interface
    expect(service.onModuleInit).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect to database', async () => {
      const connectSpy = vi.spyOn(service, '$connect').mockResolvedValue();

      await service.onModuleInit();

      expect(connectSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw error if failed to connect', async () => {
      const connectSpy = vitest
        .spyOn(service, '$connect')
        .mockRejectedValueOnce(new Error("Can't connect to database"));

      await expect(service.onModuleInit()).rejects.toThrowError(
        "Can't connect to database",
      );

      expect(connectSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('paginator', () => {
    const { defaultPageSize, maxPageSize } = appConfig.pagination;

    const provinces: readonly Province[] = [
      { code: '11', name: 'Aceh' },
      { code: '12', name: 'Sumatera Utara' },
      { code: '32', name: 'Jawa Barat' },
      { code: '33', name: 'Jawa Tengah' },
      { code: '34', name: 'Daerah Istimewa Yogyakarta' },
      { code: '35', name: 'Jawa Timur' },
    ] as const;

    const requiredOptions: PaginatorOptions<'Province'> = {
      model: 'Province',
      paginate: {},
    };

    beforeEach(() => {
      // Mock the province property directly since PrismaClient properties
      // are dynamically created and may be undefined without a DB connection
      Object.defineProperty(service, 'province', {
        value: {
          findMany: vi.fn().mockResolvedValue([...provinces]),
          count: vi.fn().mockResolvedValue(provinces.length),
        },
        writable: true,
        configurable: true,
      });
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    test('call only with required params', async () => {
      const result = await service.paginator(requiredOptions);

      expect(service.province.findMany).toHaveBeenCalledTimes(1);
      expect(service.province.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: defaultPageSize || maxPageSize,
      });

      expect(service.province.count).toHaveBeenCalledTimes(1);
      expect(service.province.count).toHaveBeenCalledWith({});

      expect(result).toEqual({
        data: provinces,
        meta: {
          total: provinces.length,
          pages: { first: 1, last: 1, current: 1, previous: null, next: null },
        },
      });
    });

    test('call with custom `limit`', async () => {
      const result = await service.paginator({
        ...requiredOptions,
        paginate: { limit: 2 },
      });

      expect(service.province.findMany).toHaveBeenCalledTimes(1);
      expect(service.province.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 2,
      });

      expect(result).toEqual({
        data: provinces,
        meta: {
          total: provinces.length,
          pages: { first: 1, last: 3, current: 1, previous: null, next: 2 },
        },
      });
    });

    test('call with custom `page`', async () => {
      const result = await service.paginator({
        ...requiredOptions,
        paginate: { page: 2, limit: 2 },
      });

      expect(service.province.findMany).toHaveBeenCalledTimes(1);
      expect(service.province.findMany).toHaveBeenCalledWith({
        skip: 2,
        take: 2,
      });

      expect(result).toEqual({
        data: provinces,
        meta: {
          total: provinces.length,
          pages: { first: 1, last: 3, current: 2, previous: 1, next: 3 },
        },
      });
    });

    test('call the last `page`', async () => {
      const result = await service.paginator({
        ...requiredOptions,
        paginate: { page: 3, limit: 2 },
      });

      expect(service.province.findMany).toHaveBeenCalledTimes(1);
      expect(service.province.findMany).toHaveBeenCalledWith({
        skip: 4,
        take: 2,
      });

      expect(result).toEqual({
        data: provinces,
        meta: {
          total: provinces.length,
          pages: { first: 1, last: 3, current: 3, previous: 2, next: null },
        },
      });
    });

    test('call unexist page', async () => {
      const result = await service.paginator({
        ...requiredOptions,
        paginate: { page: 4, limit: 2 },
      });

      expect(service.province.findMany).toHaveBeenCalledTimes(1);
      expect(service.province.findMany).toHaveBeenCalledWith({
        skip: 6,
        take: 2,
      });

      expect(result).toEqual({
        data: provinces,
        meta: {
          total: provinces.length,
          pages: {
            first: 1,
            last: 3,
            current: null,
            previous: null,
            next: null,
          },
        },
      });
    });

    test('call with `args`', async () => {
      const args = { where: { name: 'Aceh' } };
      await service.paginator({ ...requiredOptions, args });

      expect(service.province.findMany).toHaveBeenCalledTimes(1);
      expect(service.province.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: defaultPageSize || maxPageSize,
        ...args,
      });

      expect(service.province.count).toHaveBeenCalledTimes(1);
      expect(service.province.count).toHaveBeenCalledWith(args);
    });
  });
});
