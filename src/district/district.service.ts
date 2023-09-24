import { CommonService, FindOptions } from '@/common/common.service';
import { getDBProviderFeatures } from '@/common/utils/db';
import { PrismaService } from '@/prisma/prisma.service';
import { SortOptions, SortService } from '@/sort/sort.service';
import { VillageService } from '@/village/village.service';
import { Injectable } from '@nestjs/common';
import { District, Village } from '@prisma/client';

@Injectable()
export class DistrictService implements CommonService<District> {
  readonly sorter: SortService<District>;

  constructor(
    private readonly prisma: PrismaService,
    private readonly villageService: VillageService,
  ) {
    this.sorter = new SortService<District>({
      sortBy: 'code',
      sortOrder: 'asc',
    });
  }

  async find(options?: FindOptions<District>): Promise<District[]> {
    return this.prisma.district.findMany({
      ...(options?.name && {
        where: {
          name: {
            contains: options?.name,
            ...(getDBProviderFeatures()?.filtering?.insensitive && {
              mode: 'insensitive',
            }),
          },
        },
      }),
      ...((options?.sortBy || options?.sortOrder) && {
        orderBy: this.sorter.object({
          sortBy: options?.sortBy,
          sortOrder: options?.sortOrder,
        }),
      }),
    });
  }

  async findByCode(code: string): Promise<District | null> {
    return this.prisma.district.findUnique({
      where: { code },
    });
  }

  /**
   * Find all villages in a district.
   * @param districtCode The district code.
   * @param sortOptions The sort options.
   * @returns An array of villages, or `null` if there are no match district.
   */
  async findVillages(
    districtCode: string,
    sortOptions?: SortOptions<Village>,
  ): Promise<Village[] | null> {
    return this.prisma.district
      .findUnique({
        where: {
          code: districtCode,
        },
      })
      .villages({
        orderBy: this.villageService.sorter.object(sortOptions),
      });
  }
}
