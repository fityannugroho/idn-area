import { appConfig } from '@/common/config/app';
import { PaginationQuery } from '@/common/dto/pagination.dto';
import { PaginatedReturn } from '@/common/interceptor/paginate.interceptor';
import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  District,
  Island,
  Prisma,
  PrismaClient,
  Province,
  Regency,
  Village,
} from '@prisma/client';
import urlcat from 'urlcat';

export type Models = keyof typeof Prisma.ModelName;

export type FunctionType<T extends Models> =
  Prisma.TypeMap['model'][T]['operations'];

export type FunctionNames<T extends Models> = keyof FunctionType<T>;

type Model<T extends Models> = T extends 'Province'
  ? Province
  : T extends 'Regency'
  ? Regency
  : T extends 'District'
  ? District
  : T extends 'Village'
  ? Village
  : T extends 'Island'
  ? Island
  : never;

export type ArgsType<
  T extends Models,
  Fn extends FunctionNames<T>,
> = FunctionType<T>[Fn] extends (args: infer U) => any ? U : never;

export type PaginatorOptions<T extends Models> = {
  model: T;
  paginate: PaginationQuery;
  args?: FunctionType<T>['count']['args'];
  pathTemplate?: string;
  params?: Record<string, string | number | null>;
};

export type MethodDelegate<T extends Models> = {
  count: (args?: ArgsType<T, 'count'>) => Promise<number>;
  findMany: (args?: ArgsType<T, 'findMany'>) => Promise<Model<T>[]>;
};

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async paginator<T extends Models>(
    options: PaginatorOptions<T>,
  ): Promise<PaginatedReturn<Model<T>>> {
    const delegate: MethodDelegate<T> = this[options.model.toLowerCase()];
    const { defaultPageSize, maxPageSize } = appConfig.pagination;
    const { page = 1, limit = defaultPageSize || maxPageSize } =
      options.paginate;

    const data = await delegate.findMany({
      ...options.args,
      skip: (page - 1) * limit,
      take: limit,
    } as ArgsType<T, 'findMany'>);

    const total = await delegate.count({
      ...options.args,
    } as ArgsType<T, 'count'>);

    const totalPage = Math.ceil(total / limit);

    const generateEndpoint = (page: number) => {
      return urlcat('', options.pathTemplate ?? '/', {
        page,
        limit,
        ...options.params,
      });
    };

    return {
      data,
      meta: {
        first: generateEndpoint(1),
        last: generateEndpoint(totalPage),
        current: page > totalPage ? null : generateEndpoint(page),
        previous:
          page > 1 && page <= totalPage ? generateEndpoint(page - 1) : null,
        next: page < totalPage ? generateEndpoint(page + 1) : null,
      },
    };
  }
}
