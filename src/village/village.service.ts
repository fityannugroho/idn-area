import { CommonService, FindOptions } from '@/common/common.service';
import { getDBProviderFeatures } from '@/common/utils/db';
import { PrismaService } from '@/prisma/prisma.service';
import { SortService } from '@/sort/sort.service';
import { Injectable } from '@nestjs/common';
import { Village } from '@prisma/client';

@Injectable()
export class VillageService implements CommonService<Village> {
  readonly sorter: SortService<Village>;

  constructor(private readonly prisma: PrismaService) {
    this.sorter = new SortService<Village>({
      sortBy: 'code',
      sortOrder: 'asc',
    });
  }

  async find(options?: FindOptions<Village>): Promise<Village[]> {
    return this.prisma.village.findMany({
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

  async findByCode(code: string): Promise<Village | null> {
    return this.prisma.village.findUnique({
      where: { code },
    });
  }
}
