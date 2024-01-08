import { PaginatedReturn } from '@/common/interceptor/paginate.interceptor';
import { getDBProviderFeatures } from '@common/utils/db';
import { PrismaService } from '@/prisma/prisma.service';
import { SortService } from '@/sort/sort.service';
import { Injectable } from '@nestjs/common';
import { District } from '@prisma/client';
import { DistrictFindQueries } from './district.dto';

@Injectable()
export class DistrictService {
  readonly sorter: SortService<District>;

  constructor(private readonly prisma: PrismaService) {
    this.sorter = new SortService<District>({
      sortBy: 'code',
      sortOrder: 'asc',
    });
  }

  async find(
    options?: DistrictFindQueries,
  ): Promise<PaginatedReturn<District>> {
    const { name, regencyCode, page, limit, sortBy, sortOrder } = options ?? {};

    return this.prisma.paginator({
      model: 'District',
      paginate: { page, limit },
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
          ...(regencyCode && { regencyCode }),
        },
        ...((sortBy || sortOrder) && {
          orderBy: this.sorter.object({ sortBy, sortOrder }),
        }),
      },
    });
  }

  async findByCode(code: string): Promise<District | null> {
    return this.prisma.district.findUnique({
      where: { code },
    });
  }
}
