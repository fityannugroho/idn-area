import { appConfig } from '@/common/config/app';
import { PaginatedReturn } from '@/common/interceptor/paginate.interceptor';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  ArgsType,
  MethodDelegate,
  Model,
  Models,
  PaginatorOptions,
} from './prisma.interface';

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

    return {
      data,
      meta: {
        total,
        pages: {
          first: 1,
          last: totalPage,
          current: page > totalPage ? null : page,
          previous: page > 1 && page <= totalPage ? page - 1 : null,
          next: page < totalPage ? page + 1 : null,
        },
      },
    };
  }
}
