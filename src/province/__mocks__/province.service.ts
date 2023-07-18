import { FindOptions } from '@/common/common.service';
import { sortArray } from '@/common/utils/array';
import { SortOptions } from '@/sort/sort.service';
import { Province, Regency } from '@prisma/client';

export class MockProvinceService {
  readonly provinces: readonly Province[];
  readonly regencies: readonly Regency[];

  constructor(provinces: Province[], regencies: Regency[]) {
    this.provinces = provinces;
    this.regencies = regencies;
  }

  async find({
    name = '',
    sortBy = 'code',
    sortOrder,
  }: FindOptions<Province> = {}) {
    const res = this.provinces.filter((province) =>
      province.name.toLowerCase().includes(name.toLowerCase()),
    );

    return Promise.resolve(sortArray(res, sortBy, sortOrder));
  }

  async findByCode(code: string) {
    return Promise.resolve(
      this.provinces.find((province) => province.code === code) ?? null,
    );
  }

  async findRegencies(
    provinceCode: string,
    { sortBy = 'code', sortOrder }: SortOptions<Regency> = {},
  ) {
    if (this.provinces.every((p) => p.code !== provinceCode)) {
      return null;
    }

    const res = this.regencies.filter(
      (regency) => regency.provinceCode === provinceCode,
    );

    return Promise.resolve(sortArray(res, sortBy, sortOrder));
  }
}
