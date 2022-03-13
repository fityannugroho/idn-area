import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SortHelper, SortOptions } from 'src/helper/sort.helper';
import { District, DistrictDocument } from './district.schema';

@Injectable()
export class DistrictService {
  constructor(
    @InjectModel(District.name)
    private readonly districtModel: Model<DistrictDocument>,
    private readonly sortHelper: SortHelper,
  ) {
    this.sortHelper = new SortHelper({ sortBy: 'code', sortOrder: 'asc' });
  }

  /**
   * If the name is empty, all districts will be returned.
   * Otherwise, it will only return the districts with the matching name.
   * @param name Filter by district name (optional).
   * @param sort The sort query (optional).
   * @returns The array of district.
   */
  async find(name = '', sort?: SortOptions): Promise<District[]> {
    return this.districtModel
      .find({ name: new RegExp(name, 'i') })
      .sort(this.sortHelper.query(sort))
      .exec();
  }

  /**
   * Find a district by its code.
   * @param code The district code.
   * @returns An district, or null if there are no match district.
   */
  async findByCode(code: string): Promise<District> {
    return this.districtModel.findOne({ code: code }).exec();
  }
}
