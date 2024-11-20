import { PaginatedReturn } from '@/common/interceptor/paginate.interceptor';
import { getDBProviderFeatures } from '@/common/utils/db';
import { PrismaService } from '@/prisma/prisma.service';
import { SortService } from '@/sort/sort.service';
import { Injectable } from '@nestjs/common';
import { Village } from '@prisma/client';
import { VillageFindQueries, VillageWithParent } from './village.dto';

@Injectable()
export class VillageService {
  readonly sorter: SortService<Village>;

  constructor(private readonly prisma: PrismaService) {
    this.sorter = new SortService<Village>({
      sortBy: 'code',
      sortOrder: 'asc',
    });
  }

  async find(options?: VillageFindQueries): Promise<PaginatedReturn<Village>> {
    const { name, districtCode, page, limit, sortBy, sortOrder } =
      options ?? {};

    return this.prisma.paginator({
      model: 'Village',
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
          ...(districtCode && { districtCode }),
        },
        ...((sortBy || sortOrder) && {
          orderBy: this.sorter.object({ sortBy, sortOrder }),
        }),
      },
    });
  }

  async findByCode(code: string): Promise<VillageWithParent | null> {
    const res = await this.prisma.village.findUnique({
      where: { code },
      include: {
        district: {
          include: {
            regency: {
              include: {
                province: true,
              },
            },
          },
        },
      },
    });

    if (!res) {
      return null;
    }

    const {
      district: {
        regency: { province, ...regency },
        ...district
      },
      ...village
    } = res;

    return {
      ...village,
      parent: { district, regency, province },
    };
  }
}
