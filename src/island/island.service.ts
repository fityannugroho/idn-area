import { Injectable } from '@nestjs/common';
import { Island } from '@prisma/client';
import { PaginatedReturn } from '@/common/interceptor/paginate.interceptor';
import { extractProvinceCode } from '@/common/utils/code';
import { convertCoordinate } from '@/common/utils/coordinate';
import { getDBProviderFeatures } from '@/common/utils/db';
import { PrismaService } from '@/prisma/prisma.service';
import { SortService } from '@/sort/sort.service';
import {
  Island as IslandDTO,
  IslandFindQueries,
  IslandWithParent,
} from './island.dto';

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
  private _addDecimalCoordinate(island: Island): IslandDTO {
    const islandDTO = island as IslandDTO;

    try {
      const [latitude, longitude] = convertCoordinate(island.coordinate);
      islandDTO.latitude = latitude;
      islandDTO.longitude = longitude;
    } catch (error) {
      // Log the error for debugging but provide fallback values
      console.warn(
        `Invalid coordinate format for island ${island.code}: ${island.coordinate}`,
        error,
      );
      islandDTO.latitude = null;
      islandDTO.longitude = null;
    }

    return islandDTO;
  }

  async find(options?: IslandFindQueries): Promise<PaginatedReturn<IslandDTO>> {
    const { page, limit, name, regencyCode, sortBy, sortOrder } = options ?? {};

    const result = await this.prisma.paginator({
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

    // Optimize memory usage by modifying objects in place
    // instead of creating new array with map()
    const islands = result.data;
    for (let i = 0; i < islands.length; i++) {
      islands[i] = this._addDecimalCoordinate(islands[i]);
    }

    return {
      ...result,
      data: islands as IslandDTO[],
    };
  }

  async findByCode(code: string): Promise<IslandWithParent | null> {
    const res = await this.prisma.island.findUnique({
      where: { code },
      include: {
        regency: {
          include: {
            province: true,
          },
        },
      },
    });

    if (!res) {
      return null;
    }

    const { regency: regencyWithProvince, ...island } = res;

    if (!regencyWithProvince) {
      return {
        ...this._addDecimalCoordinate(island),
        parent: {
          regency: null,
          province: (await this.prisma.province.findUnique({
            where: {
              code: extractProvinceCode(code),
            },
          })) as NonNullable<IslandWithParent['parent']['province']>,
        },
      };
    }

    const { province, ...regency } = regencyWithProvince;

    return {
      ...this._addDecimalCoordinate(island),
      parent: { regency, province },
    };
  }
}
