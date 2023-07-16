import { Injectable } from '@nestjs/common';
import { Island } from '@prisma/client';
import { getDBProviderFeatures } from '@/common/utils/db';
import { convertCoordinate } from '@/common/utils/coordinate';
import { SortService, SortOptions } from '@/sort/sort.service';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class IslandService {
  readonly sortService: SortService<Island>;

  constructor(private readonly prisma: PrismaService) {
    this.sortService = new SortService<Island>({
      sortBy: 'code',
      sortOrder: 'asc',
    });
  }

  /**
   * Add decimal latitude and longitude to the island object.
   */
  addDecimalCoordinate(island: Island) {
    const [latitude, longitude] = convertCoordinate(island.coordinate);

    return { ...island, latitude, longitude };
  }

  async find(name = '', sort?: SortOptions<Island>): Promise<Island[]> {
    const islands = await this.prisma.island.findMany({
      where: {
        name: {
          contains: name,
          ...(getDBProviderFeatures()?.filtering?.insensitive && {
            mode: 'insensitive',
          }),
        },
      },
      orderBy: this.sortService.object(sort),
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
