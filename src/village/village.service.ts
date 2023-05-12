import { Injectable } from '@nestjs/common';
import { Village } from '@prisma/client';
import { SortHelper, SortOptions } from '~/src/common/helper/sort';
import { PrismaService } from '~/src/common/services/prisma';

type VillageSortKeys = keyof Village;

@Injectable()
export class VillageService {
  private readonly sortHelper: SortHelper<VillageSortKeys>;

  constructor(private readonly prisma: PrismaService) {
    this.sortHelper = new SortHelper<VillageSortKeys>({
      sortBy: 'code',
      sortOrder: 'asc',
    });
  }

  /**
   * If the name is empty, all villages will be returned.
   * Otherwise, it will only return the villages with the matching name.
   * @param name Filter by village name (optional).
   * @param sort The sort query (optional).
   * @returns The array of villages.
   */
  async find(
    name = '',
    sort?: SortOptions<VillageSortKeys>,
  ): Promise<Village[]> {
    return this.prisma.village.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      orderBy: this.sortHelper.object(sort),
    });
  }

  /**
   * Find a village by its code.
   * @param code The village code.
   * @returns An village, or null if there are no match village.
   */
  async findByCode(code: string): Promise<Village> {
    return this.prisma.village.findUnique({
      where: {
        code: code,
      },
    });
  }
}
