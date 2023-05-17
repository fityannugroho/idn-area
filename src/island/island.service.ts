import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma';
import { Island } from '@prisma/client';
import { SortHelper, SortOptions } from '../common/helper/sort';

type IslandSortKeys = keyof Island;

@Injectable()
export class IslandService {
  private readonly sortHelper: SortHelper<IslandSortKeys>;

  constructor(private readonly prisma: PrismaService) {
    this.sortHelper = new SortHelper<IslandSortKeys>({
      sortBy: 'name',
      sortOrder: 'asc',
    });
  }

  async find(name = '', sort?: SortOptions<IslandSortKeys>): Promise<Island[]> {
    return this.prisma.island.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      orderBy: this.sortHelper.object(sort),
    });
  }
}
