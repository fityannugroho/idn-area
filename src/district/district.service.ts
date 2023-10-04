import { PaginationQuery } from '@/common/dto/pagination.dto';
import { PaginatedReturn } from '@/common/interceptor/paginate.interceptor';
import { getDBProviderFeatures } from '@/common/utils/db';
import { PrismaService } from '@/prisma/prisma.service';
import { SortOptions, SortService } from '@/sort/sort.service';
import { VillageService } from '@/village/village.service';
import { Injectable } from '@nestjs/common';
import { District, Village } from '@prisma/client';
import { DistrictFindQueries } from './district.dto';

@Injectable()
export class DistrictService {
  readonly sorter: SortService<District>;

  constructor(
    private readonly prisma: PrismaService,
    private readonly villageService: VillageService,
  ) {
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

  /**
   * Find all villages in a district.
   * @param districtCode The district code.
   * @param options The options.
   * @returns Paginated array of villages, `[]` if there are no match district.
   */
  async findVillages(
    districtCode: string,
    options?: SortOptions<Village> & PaginationQuery,
  ): Promise<PaginatedReturn<Village>> {
    const { page, limit, sortBy, sortOrder } = options ?? {};

    return this.prisma.paginator({
      model: 'Village',
      paginate: { page, limit },
      args: {
        where: { districtCode },
        ...((sortBy || sortOrder) && {
          orderBy: this.villageService.sorter.object({ sortBy, sortOrder }),
        }),
      },
    });
  }
}
