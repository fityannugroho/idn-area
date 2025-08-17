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
    const [latitude, longitude] = convertCoordinate(island.coordinate);

    return { ...island, latitude, longitude };
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

    return {
      ...result,
      data: result.data.map((island) => this._addDecimalCoordinate(island)),
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
