import { Injectable } from '@nestjs/common';
import { District, Island, Regency } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { getDBProviderFeatures } from '~/utils/db';
import { SortOptions, Sorter } from '~/utils/helpers/sorter';
import { IslandService, IslandSortKeys } from '../island/island.service';

type RegencySortKeys = keyof Regency;

@Injectable()
export class RegencyService {
  private readonly sortHelper: Sorter<RegencySortKeys>;

  constructor(
    private readonly prisma: PrismaService,
    private readonly islandService: IslandService,
  ) {
    this.sortHelper = new Sorter<RegencySortKeys>({
      sortBy: 'code',
      sortOrder: 'asc',
    });
  }

  /**
   * If the name is empty, all regencies will be returned.
   * Otherwise, it will only return the regencies with the matching name.
   * @param name Filter by regency name (optional).
   * @param sort The sort query (optional).
   * @returns The array of regencies.
   */
  async find(
    name = '',
    sort?: SortOptions<RegencySortKeys>,
  ): Promise<Regency[]> {
    return this.prisma.regency.findMany({
      where: {
        name: {
          contains: name,
          ...(getDBProviderFeatures()?.filtering?.insensitive && {
            mode: 'insensitive',
          }),
        },
      },
      orderBy: this.sortHelper.object(sort),
    });
  }

  /**
   * Find a regency by its code.
   * @param code The regency code.
   * @returns An regency, or null if there are no match regency.
   */
  async findByCode(code: string): Promise<Regency> {
    return this.prisma.regency.findUnique({
      where: {
        code: code,
      },
    });
  }

  /**
   * Find all districts in a regency.
   * @param regencyCode The regency code.
   * @param sort The sort query (optional).
   * @returns Array of districts in the match regency, or `false` if there are no regency found.
   */
  async findDistrics(
    regencyCode: string,
    sort?: SortOptions<RegencySortKeys>,
  ): Promise<false | District[]> {
    const districts = await this.prisma.regency
      .findUnique({
        where: {
          code: regencyCode,
        },
      })
      .districts({
        orderBy: this.sortHelper.object(sort),
      });

    return districts ?? false;
  }

  /**
   * Find all islands in a regency.
   * @param regencyCode The regency code.
   * @returns Array of islands in the match regency, or `false` if there are no regency found.
   */
  async findIslands(
    regencyCode: string,
    sort?: SortOptions<IslandSortKeys>,
  ): Promise<false | Island[]> {
    const islands = await this.prisma.regency
      .findUnique({
        where: {
          code: regencyCode,
        },
      })
      .islands({
        orderBy: this.islandService.sortHelper.object(sort),
      });

    if (!islands) {
      return false;
    }

    return islands.map(this.islandService.addDecimalCoordinate);
  }
}
