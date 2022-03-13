import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SortHelper, SortOptions } from 'src/helper/sort.helper';
import { Regency, RegencyDocument } from './regency.schema';

@Injectable()
export class RegencyService {
  constructor(
    @InjectModel(Regency.name)
    private readonly regencyModel: Model<RegencyDocument>,
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
    return this.regencyModel
      .find({ name: new RegExp(name, 'i') })
      .sort(this.sortHelper.query(sort))
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
