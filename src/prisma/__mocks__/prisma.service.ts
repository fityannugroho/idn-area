import { PaginatedReturn } from '@/common/interceptor/paginate.interceptor';
import { Models, Model, PaginatorOptions } from '../prisma.interface';
import { appConfig } from 'common/config/app';

export const mockPrismaService = <M extends Models>(
  model: M,
  data: readonly Model<M>[],
) => ({
  paginator: (
    options: PaginatorOptions<M>,
  ): Promise<PaginatedReturn<Model<M>>> => {
    const { defaultPageSize, maxPageSize } = appConfig.pagination;
    const { page = 1, limit = defaultPageSize || maxPageSize } =
      options.paginate;

    const paginated = data.slice((page - 1) * limit, page * limit);
    const total = data.length;
    const totalPage = Math.ceil(total / limit);

    return Promise.resolve({
      data: paginated,
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
    });
  },

  [model.toLowerCase()]: {
    count: () => Promise.resolve(data.length),
    findMany: () => Promise.resolve(data),
    findUnique: (args: { where: { code: string } }) =>
      Promise.resolve(data.find((item) => item.code === args.where.code)),
  },
});
