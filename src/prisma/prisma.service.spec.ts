import { Test } from '@nestjs/testing';
import { PaginatorOptions, PrismaService } from './prisma.service';
import { PrismaClient, Province } from '@prisma/client';
import { appConfig } from '@/common/config/app';

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
    // Must extend PrismaClient
    expect(service).toBeInstanceOf(PrismaClient);
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
      { code: '11', name: 'ACEH' },
      { code: '12', name: 'SUMATERA UTARA' },
      { code: '32', name: 'JAWA BARAT' },
      { code: '33', name: 'JAWA TENGAH' },
      { code: '34', name: 'DI YOGYAKARTA' },
      { code: '35', name: 'JAWA TIMUR' },
    ] as const;

    const requiredOptions: PaginatorOptions<'Province'> = {
      model: 'Province',
      paginate: {},
    };

    beforeEach(() => {
      vi.spyOn(service.province, 'findMany').mockResolvedValue([...provinces]);

      vi.spyOn(service.province, 'count').mockResolvedValue(provinces.length);
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
          first: expect.any(String),
          last: expect.any(String),
          current: expect.any(String),
          previous: null,
          next: null,
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
          first: expect.stringContaining('page=1'),
          last: expect.stringContaining('page=3'),
          current: expect.stringContaining('page=1'),
          previous: null,
          next: expect.stringContaining('page=2'),
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
          first: expect.stringContaining('page=1'),
          last: expect.stringContaining('page=3'),
          current: expect.stringContaining('page=2'),
          previous: expect.stringContaining('page=1'),
          next: expect.stringContaining('page=3'),
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
          first: expect.stringContaining('page=1'),
          last: expect.stringContaining('page=3'),
          current: expect.stringContaining('page=3'),
          previous: expect.stringContaining('page=2'),
          next: null,
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
          first: expect.stringContaining('page=1'),
          last: expect.stringContaining('page=3'),
          current: null,
          previous: null,
          next: null,
        },
      });
    });

    test('call with `args`', async () => {
      const args = { where: { name: 'ACEH' } };
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

    test('call with `pathTemplate`', async () => {
      const result = await service.paginator({
        ...requiredOptions,
        pathTemplate: '/provinces',
      });

      expect(result.meta).toEqual({
        first: expect.stringContaining('/provinces?page=1'),
        last: expect.stringContaining('/provinces'),
        current: expect.stringContaining('/provinces'),
        previous: null,
        next: null,
      });
    });

    test('call with `params`', async () => {
      const result = await service.paginator({
        ...requiredOptions,
        paginate: { page: 2, limit: 2 },
        params: { sortOrder: 'desc' },
      });

      expect(result.meta).toEqual({
        first: expect.stringContaining('page=1&limit=2&sortOrder=desc'),
        last: expect.stringContaining('page=3&limit=2&sortOrder=desc'),
        current: expect.stringContaining('page=2&limit=2&sortOrder=desc'),
        previous: expect.stringContaining('page=1&limit=2&sortOrder=desc'),
        next: expect.stringContaining('page=3&limit=2&sortOrder=desc'),
      });
    });
  });
});
