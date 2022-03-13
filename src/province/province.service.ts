import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Province, ProvinceDocument } from './province.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Regency } from 'src/regency/regency.schema';
import { SortHelper, SortOptions } from 'src/helper/sort.helper';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectModel(Province.name)
    private readonly provinceModel: Model<ProvinceDocument>,
    private readonly sortHelper: SortHelper,
  ) {
    this.sortHelper = new SortHelper({ sortBy: 'code', sortOrder: 'asc' });
  }

  /**
   * If the name is empty, all provinces will be returned.
   * Otherwise, it will only return the provinces with the matching name.
   * @param name Filter by province name (optional).
   * @param sort The sort query (optional).
   * @returns The array of provinces.
   */
  async find(name = '', sort?: SortOptions): Promise<Province[]> {
    return this.provinceModel
      .find({ name: new RegExp(name, 'i') })
      .sort(this.sortHelper.query(sort))
      .exec();
  }

  /**
   * Find a province by its code.
   * @param code The province code.
   * @returns An province, or `null` if there are no match province.
   */
  async findByCode(code: string): Promise<Province> {
    return this.provinceModel.findOne({ code: code }).exec();
  }

  /**
   * Find all regencies in a province.
   * @param provinceCode The province code.
   * @returns Array of regency in the match province, or `false` if there are no province found.
   */
  async findRegencies(provinceCode: string): Promise<false | Regency[]> {
    const regenciesVirtualName = 'regencies';
    const province = await this.provinceModel
      .findOne({ code: provinceCode })
      .populate(regenciesVirtualName)
      .exec();

    return province === null
      ? false
      : (province[regenciesVirtualName] as Promise<Regency[]>);
  }
}
