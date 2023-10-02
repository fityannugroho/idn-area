import { CommonService, FindOptions } from '@/common/common.service';
import { PaginatedReturn } from '@/common/interceptor/paginate.interceptor';
import { getDBProviderFeatures } from '@/common/utils/db';
import { PrismaService } from '@/prisma/prisma.service';
import { SortService } from '@/sort/sort.service';
import { Injectable } from '@nestjs/common';
import { Village } from '@prisma/client';

@Injectable()
export class VillageService implements CommonService<Village> {
  readonly sorter: SortService<Village>;

  constructor(private readonly prisma: PrismaService) {
    this.sorter = new SortService<Village>({
      sortBy: 'code',
      sortOrder: 'asc',
    });
  }

  async find(
    options?: FindOptions<Village>,
  ): Promise<PaginatedReturn<Village>> {
    const { name, page, limit, sortBy, sortOrder } = options ?? {};

    return this.prisma.paginator({
      model: 'Village',
      paginate: { page, limit },
      args: {
        ...(name && {
          where: {
            name: {
              contains: name,
              ...(getDBProviderFeatures()?.filtering?.insensitive && {
                mode: 'insensitive',
              }),
            },
          },
        }),
        ...((sortBy || sortOrder) && {
          orderBy: this.sorter.object({ sortBy, sortOrder }),
        }),
      },
    });
  }

  async findByCode(code: string): Promise<Village | null> {
    return this.prisma.village.findUnique({
      where: { code },
    });
  }
}
