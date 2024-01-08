import { PaginatedReturn } from '@/common/interceptor/paginate.interceptor';
import { convertCoordinate } from '@common/utils/coordinate';
import { getDBProviderFeatures } from '@common/utils/db';
import { Island as IslandDTO, IslandFindQueries } from '@/island/island.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { SortService } from '@/sort/sort.service';
import { Injectable } from '@nestjs/common';
import { Island } from '@prisma/client';

@Injectable()
export class IslandService {
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

  async find(options?: IslandFindQueries): Promise<PaginatedReturn<Island>> {
    const { page, limit, name, regencyCode, sortBy, sortOrder } = options ?? {};

    return this.prisma.paginator({
      model: 'Island',
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
          ...(typeof regencyCode === 'string' && {
            regencyCode: regencyCode === '' ? null : regencyCode,
          }),
        },
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
