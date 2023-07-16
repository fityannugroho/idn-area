import { CommonService, FindOptions } from '@/common/common.service';
import { getDBProviderFeatures } from '@/common/utils/db';
import { PrismaService } from '@/prisma/prisma.service';
import { SortOptions, SortService } from '@/sort/sort.service';
import { Injectable } from '@nestjs/common';
import { District, Village } from '@prisma/client';

@Injectable()
export class DistrictService implements CommonService<District> {
  readonly sorter: SortService<District>;

  constructor(private readonly prisma: PrismaService) {
    this.sorter = new SortService<District>({
      sortBy: 'code',
      sortOrder: 'asc',
    });
  }

  async find({ name, ...sortOptions }: FindOptions<District> = {}): Promise<
    District[]
  > {
    return this.prisma.district.findMany({
      where: {
        name: {
          contains: name,
          ...(getDBProviderFeatures()?.filtering?.insensitive && {
            mode: 'insensitive',
          }),
        },
      },
      orderBy: this.sorter.object(sortOptions),
    });
  }

  async findByCode(code: string): Promise<District | null> {
    return this.prisma.district.findUnique({
      where: {
        code: code,
      },
    });
  }

  /**
   * Find all villages in a district.
   * @param districtCode The district code.
   * @param sort The sort options.
   * @returns An array of villages, or `null` if there are no match district.
   */
  async findVillages(
    districtCode: string,
    sort?: SortOptions<District>,
  ): Promise<Village[] | null> {
    return this.prisma.district
      .findUnique({
        where: {
          code: districtCode,
        },
      })
      .villages({
        orderBy: this.sorter.object(sort),
      });
  }
}
