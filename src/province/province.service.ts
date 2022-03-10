import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Province, ProvinceDocument } from './province.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectModel(Province.name)
    private readonly provinceModel: Model<ProvinceDocument>,
  ) {}

  /**
   * Generate sort query string. Minus `-` sign means descending order.
   *
   * For example: `-code` means sort by "code" field in descending order.
   * @param options The sort options. The default value is 'asc' for sortOrder and 'code' for sortBy.
   * @returns The sort query string.
   */
  private sortQuery(
    options: { sortBy?: string; sortOrder?: 'asc' | 'desc' } = {
      sortBy: 'code',
      sortOrder: 'asc',
    },
  ): string {
    const { sortBy, sortOrder } = options;
    return `${sortOrder === 'desc' ? '-' : ''}${sortBy}`;
  }

  /**
   * If the name is empty, all provinces will be returned.
   * Otherwise, it will only return the provinces with the matching name.
   * @param name Filter by province name (optional).
   * @param sort The sort query (optional).
   * @returns The array of provinces.
   */
  async find(
    name = '',
    sort?: {
      sortBy: string;
      sortOrder?: 'asc' | 'desc';
    },
  ): Promise<Province[]> {
    return this.provinceModel
      .find({ name: new RegExp(name, 'i') })
      .sort(this.sortQuery(sort))
      .exec();
  }
}
