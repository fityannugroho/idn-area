import { sortArray } from 'common/utils/array';
import { District } from '@prisma/client';
import { DistrictFindQueries } from '../district.dto';

export class MockDistrictService {
  readonly districts: District[];

  constructor(districts: District[]) {
    this.districts = districts;
  }

  async find({
    name = '',
    regencyCode,
    sortBy = 'code',
    sortOrder,
  }: DistrictFindQueries = {}) {
    let res = this.districts.filter((district) =>
      district.name.toLowerCase().includes(name.toLowerCase()),
    );

    if (regencyCode) {
      res = res.filter((district) => district.regencyCode === regencyCode);
    }

    return Promise.resolve({ data: sortArray(res, sortBy, sortOrder) });
  }

  async findByCode(code: string) {
    return Promise.resolve(
      this.districts.find((district) => district.code === code) ?? null,
    );
  }
}
