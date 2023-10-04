import { sortArray } from '@/common/utils/array';
import { SortOptions } from '@/sort/sort.service';
import { District, Village } from '@prisma/client';
import { DistrictFindQueries } from '../district.dto';

export class MockDistrictService {
  readonly districts: District[];
  readonly villages: Village[];

  constructor(districts: District[], villages: Village[]) {
    this.districts = districts;
    this.villages = villages;
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

  async findVillages(
    districtCode: string,
    { sortBy = 'code', sortOrder }: SortOptions<Village> = {},
  ) {
    if (this.districts.every((p) => p.code !== districtCode)) {
      return null;
    }

    const res = this.villages.filter(
      (village) => village.districtCode === districtCode,
    );

    return Promise.resolve({ data: sortArray(res, sortBy, sortOrder) });
  }
}
