import { Injectable } from '@nestjs/common';
import { Village } from '@prisma/client';
import { SortHelper, SortOptions } from '~/src/helper/sort.helper';
import { PrismaService } from '~/src/prisma.service';

@Injectable()
export class VillageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sortHelper: SortHelper,
  ) {
    this.sortHelper = new SortHelper({ sortBy: 'code', sortOrder: 'asc' });
  }

  /**
   * If the name is empty, all villages will be returned.
   * Otherwise, it will only return the villages with the matching name.
   * @param name Filter by village name (optional).
   * @param sort The sort query (optional).
   * @returns The array of villages.
   */
  async find(name = '', sort?: SortOptions): Promise<Village[]> {
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
