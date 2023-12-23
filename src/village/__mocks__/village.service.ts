import { sortArray } from 'common/utils/array';
import { Village } from '@prisma/client';
import { VillageFindQueries } from '../village.dto';

export class MockVillageService {
  readonly villages: Village[];

  constructor(villages: Village[]) {
    this.villages = villages;
  }

  async find({
    name = '',
    districtCode,
    sortBy = 'code',
    sortOrder,
  }: VillageFindQueries = {}) {
    let res = this.villages.filter((village) =>
      village.name.toLowerCase().includes(name.toLowerCase()),
    );

    if (districtCode) {
      res = res.filter((district) => district.districtCode === districtCode);
    }

    return Promise.resolve({ data: sortArray(res, sortBy, sortOrder) });
  }

  async findByCode(code: string) {
    return Promise.resolve(
      this.villages.find((village) => village.code === code) ?? null,
    );
  }
}
