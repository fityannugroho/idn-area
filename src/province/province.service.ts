import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Province, ProvinceDocument } from './province.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Regency } from 'src/regency/regency.schema';

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
