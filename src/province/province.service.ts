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

  async findAll(): Promise<Province[]> {
    return this.provinceModel.find().exec();
  }
}
