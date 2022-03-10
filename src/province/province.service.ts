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

  private sortQuery(
    options: { sortBy?: string; sortOrder?: 'asc' | 'desc' } = {
      sortBy: 'code',
      sortOrder: 'asc',
    },
  ): string {
    const { sortBy, sortOrder } = options;
    return `${sortOrder === 'desc' ? '-' : ''}${sortBy}`;
  }

  async findAll(sort?: {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Province[]> {
    const sortQuery = this.sortQuery(sort);
    return this.provinceModel.find().sort(sortQuery).exec();
  }
}
