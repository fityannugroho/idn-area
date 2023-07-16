import { CommonService, FindOptions } from '@/common/common.service';
import { getDBProviderFeatures } from '@/common/utils/db';
import { PrismaService } from '@/prisma/prisma.service';
import { SortOptions, SortService } from '@/sort/sort.service';
import { Injectable } from '@nestjs/common';
import { Province, Regency } from '@prisma/client';

@Injectable()
export class ProvinceService implements CommonService<Province> {
  readonly sorter: SortService<Province>;

  constructor(private readonly prisma: PrismaService) {
    this.sorter = new SortService<Province>({
      sortBy: 'code',
      sortOrder: 'asc',
    });
  }

  async find({ name, ...sortOptions }: FindOptions<Province> = {}): Promise<
    Province[]
  > {
    return this.prisma.province.findMany({
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

  async findByCode(code: string): Promise<Province | null> {
    return this.prisma.province.findUnique({
      where: {
        code: code,
      },
    });
  }

  /**
   * Find all regencies in a province.
   * @param provinceCode The province code.
   * @param sortOptions The sort options.
   * @returns An array of regencies, or `null` if there are no match province.
   */
  async findRegencies(
    provinceCode: string,
    sortOptions?: SortOptions<Province>,
  ): Promise<Regency[] | null> {
    return this.prisma.province
      .findUnique({
        where: {
          code: provinceCode,
        },
      })
      .regencies({
        orderBy: this.sorter.object(sortOptions),
      });
  }
}
