import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma';
import { Island } from '@prisma/client';
import { SortHelper, SortOptions } from '../common/helper/sort';
import CoordinateConverter from '../common/helper/coordinate-converter';

type IslandSortKeys = keyof Island;

@Injectable()
export class IslandService {
  private readonly sortHelper: SortHelper<IslandSortKeys>;
  private readonly coordinateConverter = new CoordinateConverter();

  constructor(private readonly prisma: PrismaService) {
    this.sortHelper = new SortHelper<IslandSortKeys>({
      sortBy: 'name',
      sortOrder: 'asc',
    });
  }

  /**
   * Add latitude and longitude to the response.
   */
  addLatLong(island: Island) {
    const [latitude, longitude] = this.coordinateConverter.convertToNumber(
      island.coordinate,
    );

    return { ...island, latitude, longitude };
  }

  async find(name = '', sort?: SortOptions<IslandSortKeys>): Promise<Island[]> {
    const islands = await this.prisma.island.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      orderBy: this.sortHelper.object(sort),
    });

    return islands.map(this.addLatLong);
  }

  /**
   * Find an island by its code.
   * @param code The island code.
   * @returns An island, or null if there are no match island.
   */
  async findByCode(code: string, withLatLong = false): Promise<Island | null> {
    const island = await this.prisma.island.findUnique({
      where: {
        code: code,
      },
    });

    if (withLatLong) {
      return this.addLatLong(island);
    }

    return island;
  }
}
