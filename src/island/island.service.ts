import { CommonService, FindOptions } from '@/common/common.service';
import { PaginatedReturn } from '@/common/interceptor/paginate.interceptor';
import { convertCoordinate } from '@/common/utils/coordinate';
import { getDBProviderFeatures } from '@/common/utils/db';
import { Island as IslandDTO } from '@/island/island.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { SortService } from '@/sort/sort.service';
import { Injectable } from '@nestjs/common';
import { Island } from '@prisma/client';

@Injectable()
export class IslandService implements CommonService<Island> {
  readonly sorter: SortService<Island>;

  constructor(private readonly prisma: PrismaService) {
    this.sorter = new SortService<Island>({
      sortBy: 'code',
      sortOrder: 'asc',
    });
  }

  /**
   * Add decimal latitude and longitude to the island object.
   */
  addDecimalCoordinate(island: Island): IslandDTO {
    const [latitude, longitude] = convertCoordinate(island.coordinate);

    return { ...island, latitude, longitude };
  }

  async find(options?: FindOptions<Island>): Promise<PaginatedReturn<Island>> {
    const { page, limit, name, sortBy, sortOrder } = options ?? {};

    return this.prisma.paginator({
      model: 'Island',
      paginate: { page, limit },
      args: {
        ...(name && {
          where: {
            name: {
              contains: options.name,
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

  async findByCode(code: string): Promise<Island | null> {
    return this.prisma.island.findUnique({
      where: {
        code: code,
      },
    });
  }
}
