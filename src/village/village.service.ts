import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SortHelper, SortOptions } from 'src/helper/sort.helper';
import { Village, VillageDocument } from './village.schema';

@Injectable()
export class VillageService {
  constructor(
    @InjectModel(Village.name)
    private readonly villageModel: Model<VillageDocument>,
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
    return this.villageModel
      .find({ name: new RegExp(name, 'i') })
      .sort(this.sortHelper.query(sort))
      .exec();
  }

  /**
   * Find a village by its code.
   * @param code The village code.
   * @returns An village, or null if there are no match village.
   */
  async findByCode(code: string): Promise<Village> {
    return this.villageModel.findOne({ code: code }).exec();
  }
}
