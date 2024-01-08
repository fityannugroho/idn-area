import { PaginatedReturn } from '@/common/interceptor/paginate.interceptor';
import { getDBProviderFeatures } from '@common/utils/db';
import { PrismaService } from '@/prisma/prisma.service';
import { SortService } from '@/sort/sort.service';
import { Injectable } from '@nestjs/common';
import { Regency } from '@prisma/client';
import { RegencyFindQueries } from './regency.dto';

@Injectable()
export class RegencyService {
  readonly sorter: SortService<Regency>;

  constructor(private readonly prisma: PrismaService) {
    this.sorter = new SortService<Regency>({
      sortBy: 'code',
      sortOrder: 'asc',
    });
  }

  async find(options?: RegencyFindQueries): Promise<PaginatedReturn<Regency>> {
    const { name, sortBy, sortOrder, page, limit, provinceCode } =
      options ?? {};

    return this.prisma.paginator({
      model: 'Regency',
      args: {
        where: {
          ...(name && {
            name: {
              contains: name,
              ...(getDBProviderFeatures()?.filtering?.insensitive && {
                mode: 'insensitive',
              }),
            },
          }),
          ...(provinceCode && { provinceCode }),
        },
        ...((sortBy || sortOrder) && {
          orderBy: this.sorter.object({ sortBy, sortOrder }),
        }),
      },
      paginate: { page, limit },
    });
  }

  async findByCode(code: string): Promise<Regency | null> {
    return this.prisma.regency.findUnique({
      where: {
        code: code,
      },
    });
  }
}
