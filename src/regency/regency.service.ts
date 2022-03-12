import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Regency, RegencyDocument } from './regency.schema';

@Injectable()
export class RegencyService {
  constructor(
    @InjectModel(Regency.name)
    private readonly regencyModel: Model<RegencyDocument>,
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
   * If the name is empty, all regencies will be returned.
   * Otherwise, it will only return the regencies with the matching name.
   * @param name Filter by regency name (optional).
   * @returns The array of regencies.
   */
  async find(
    name = '',
    sort?: {
      sortBy: string;
      sortOrder?: 'asc' | 'desc';
    },
  ): Promise<Regency[]> {
    return this.regencyModel
      .find({ name: new RegExp(name, 'i') })
      .sort(this.sortQuery(sort))
      .exec();
  }

  /**
   * Find a regency by its code.
   * @param code The regency code.
   * @returns An regency, or null if there are no match regency.
   */
  async findByCode(code: string): Promise<Regency> {
    return this.regencyModel.findOne({ code: code }).exec();
  }
}
