import { CommonService, FindOptions } from '@/common/common.service';
import { getDBProviderFeatures } from '@/common/utils/db';
import { DistrictService } from '@/district/district.service';
import { Island as IslandDTO } from '@/island/island.dto';
import { IslandService } from '@/island/island.service';
import { PrismaService } from '@/prisma/prisma.service';
import { SortOptions, SortService } from '@/sort/sort.service';
import { Injectable } from '@nestjs/common';
import { District, Island, Regency } from '@prisma/client';

@Injectable()
export class RegencyService implements CommonService<Regency> {
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

  async find({ name, ...sortOptions }: FindOptions<Regency> = {}): Promise<
    Regency[]
  > {
    return this.prisma.regency.findMany({
      where: {
        name: {
          contains: name,
          ...(getDBProviderFeatures()?.filtering?.insensitive && {
            mode: 'insensitive',
          }),
        },
      },
      orderBy: this.sorter.object(sortOptions),
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
   * @param sortOptions The sort options.
   * @returns An array of districts, or `null` if there are no match regency.
   */
  async findDistricts(
    regencyCode: string,
    sortOptions?: SortOptions<District>,
  ): Promise<District[] | null> {
    return this.prisma.regency
      .findUnique({
        where: {
          code: regencyCode,
        },
      })
      .districts({
        orderBy: this.districtService.sorter.object(sortOptions),
      });
  }

  /**
   * Find all islands in a regency.
   * @param regencyCode The regency code.
   * @param sortOptions The sort options.
   * @returns An array of islands, or `null` if there are no match regency.
   */
  async findIslands(
    regencyCode: string,
    sortOptions?: SortOptions<Island>,
  ): Promise<IslandDTO[] | null> {
    const islands = await this.prisma.regency
      .findUnique({
        where: {
          code: regencyCode,
        },
      })
      .islands({
        orderBy: this.islandService.sorter.object(sortOptions),
      });

    if (!islands) {
      return null;
    }

    return islands.map(this.islandService.addDecimalCoordinate);
  }
}
