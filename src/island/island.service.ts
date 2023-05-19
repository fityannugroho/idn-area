import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma';
import { Island } from '@prisma/client';
import { SortHelper, SortOptions } from '../common/helper/sort';
import CoordinateConverter from '../common/helper/coordinate-converter';

type IslandSortKeys = keyof Island;

@Injectable()
export class IslandService {
  private readonly sortHelper: SortHelper<IslandSortKeys>;

  constructor(private readonly prisma: PrismaService) {
    this.sortHelper = new SortHelper<IslandSortKeys>({
      sortBy: 'code',
      sortOrder: 'asc',
    });
  }

  /**
   * Add decimal latitude and longitude to the island object.
   */
  addDecimalCoordinate(island: Island) {
    const coordinateConverter = new CoordinateConverter();
    const [latitude, longitude] = coordinateConverter.convertToNumber(
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

    return islands.map(this.addDecimalCoordinate);
  }

  /**
   * Find an island by its code.
   * @param code The island code.
   * @returns An island, or null if there are no match island.
   */
  async findByCode(code: string): Promise<Island | null> {
    const island = await this.prisma.island.findUnique({
      where: {
        code: code,
      },
    });

    if (island) {
      return this.addDecimalCoordinate(island);
    }

    return null;
  }
}
