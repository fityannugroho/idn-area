import { Injectable } from '@nestjs/common';
import { District, Regency } from '@prisma/client';
import { SortHelper, SortOptions } from 'src/helper/sort.helper';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RegencyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sortHelper: SortHelper,
  ) {
    this.sortHelper = new SortHelper({ sortBy: 'code', sortOrder: 'asc' });
  }

  /**
   * If the name is empty, all regencies will be returned.
   * Otherwise, it will only return the regencies with the matching name.
   * @param name Filter by regency name (optional).
   * @param sort The sort query (optional).
   * @returns The array of regencies.
   */
  async find(name = '', sort?: SortOptions): Promise<Regency[]> {
    return this.prisma.regency.findMany({
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
   * Find a regency by its code.
   * @param code The regency code.
   * @returns An regency, or null if there are no match regency.
   */
  async findByCode(code: string): Promise<Regency> {
    return this.prisma.regency.findUnique({
      where: {
        code: code,
      },
    });
  }

  /**
   * Find all districts in a regency.
   * @param regencyCode The regency code.
   * @param sort The sort query (optional).
   * @returns Array of regency in the match regency, or `false` if there are no regency found.
   */
  async findDistrics(
    regencyCode: string,
    sort?: SortOptions,
  ): Promise<false | District[]> {
    const districts = await this.prisma.regency
      .findUnique({
        where: {
          code: regencyCode,
        },
      })
      .districts({
        orderBy: this.sortHelper.object(sort),
      });

    return districts ?? false;
  }
}
