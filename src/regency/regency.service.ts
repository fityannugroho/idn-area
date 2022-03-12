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
   * If the name is empty, all regencies will be returned.
   * Otherwise, it will only return the regencies with the matching name.
   * @param name Filter by regency name (optional).
   * @returns The array of regencies.
   */
  async find(name = ''): Promise<Regency[]> {
    return this.regencyModel.find({ name: new RegExp(name, 'i') }).exec();
  }
}
