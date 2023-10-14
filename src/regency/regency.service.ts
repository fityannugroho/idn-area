import { PaginationQuery } from '@/common/dto/pagination.dto';
import { PaginatedReturn } from '@/common/interceptor/paginate.interceptor';
import { getDBProviderFeatures } from '@/common/utils/db';
import { DistrictService } from '@/district/district.service';
import { Island as IslandDTO } from '@/island/island.dto';
import { IslandService } from '@/island/island.service';
import { PrismaService } from '@/prisma/prisma.service';
import { SortOptions, SortService } from '@/sort/sort.service';
import { Injectable } from '@nestjs/common';
import { District, Island, Regency } from '@prisma/client';
import { RegencyFindQueries } from './regency.dto';

@Injectable()
export class RegencyService {
  readonly sorter: SortService<Regency>;

  constructor(
    private readonly prisma: PrismaService,
    private readonly districtService: DistrictService,
    private readonly islandService: IslandService,
  ) {
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

  /**
   * Find all districts in a regency.
   * @param regencyCode The regency code.
   * @param options The options.
   * @returns Paginated array of districts, `[]` if there are no match regency.
   * @deprecated Use `DistrictService.find` instead.
   */
  async findDistricts(
    regencyCode: string,
    options?: SortOptions<District> & PaginationQuery,
  ): Promise<PaginatedReturn<District>> {
    const { page, limit, sortBy, sortOrder } = options ?? {};

    return this.prisma.paginator({
      model: 'District',
      args: {
        where: { regencyCode },
        orderBy: this.districtService.sorter.object({ sortBy, sortOrder }),
      },
      paginate: { page, limit },
    });
  }

  /**
   * Find all islands in a regency.
   * @param regencyCode The regency code.
   * @param options The options.
   * @returns Paginated array of islands, `[]` if there are no match regency.
   * @deprecated Use `IslandService.find` instead.
   */
  async findIslands(
    regencyCode: string,
    options?: SortOptions<Island> & PaginationQuery,
  ): Promise<PaginatedReturn<IslandDTO>> {
    const { page, limit, sortBy, sortOrder } = options ?? {};

    const res = await this.prisma.paginator({
      model: 'Island',
      paginate: { page, limit },
      args: {
        where: { regencyCode },
        orderBy: this.islandService.sorter.object({ sortBy, sortOrder }),
      },
    });

    const islands = res.data.map(this.islandService.addDecimalCoordinate);
    return { ...res, data: islands };
  }
}
