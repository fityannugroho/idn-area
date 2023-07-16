import { Injectable } from '@nestjs/common';
import { District, Village } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { getDBProviderFeatures } from '@/common/utils/db';
import { SortOptions, SortService } from '@/sort/sort.service';

@Injectable()
export class DistrictService {
  private readonly sortService: SortService<District>;

  constructor(private readonly prisma: PrismaService) {
    this.sortService = new SortService<District>({
      sortBy: 'code',
      sortOrder: 'asc',
    });
  }

  /**
   * If the name is empty, all districts will be returned.
   * Otherwise, it will only return the districts with the matching name.
   * @param name Filter by district name (optional).
   * @param sort The sort query (optional).
   * @returns The array of district.
   */
  async find(name = '', sort?: SortOptions<District>): Promise<District[]> {
    return this.prisma.district.findMany({
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
  }

  /**
   * Find a district by its code.
   * @param code The district code.
   * @returns An district, or null if there are no match district.
   */
  async findByCode(code: string): Promise<District> {
    return this.prisma.district.findUnique({
      where: {
        code: code,
      },
    });
  }

  /**
   * Find all villages in a district.
   * @param districtCode The district code.
   * @param sort The sort query (optional).
   * @returns Array of village in the match district, or `false` if there are no district found.
   */
  async findVillages(
    districtCode: string,
    sort?: SortOptions<District>,
  ): Promise<false | Village[]> {
    const villages = await this.prisma.district
      .findUnique({
        where: {
          code: districtCode,
        },
      })
      .villages({
        orderBy: this.sortService.object(sort),
      });

    return villages ?? false;
  }
}
