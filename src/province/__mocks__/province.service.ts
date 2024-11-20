import { sortArray } from '@/common/utils/array';
import { Province } from '@prisma/client';
import { ProvinceFindQueries } from '../province.dto';

export class MockProvinceService {
  readonly provinces: readonly Province[];

  constructor(provinces: Province[]) {
    this.provinces = provinces;
  }

  async find({
    name = '',
    sortBy = 'code',
    sortOrder,
  }: ProvinceFindQueries = {}) {
    const res = this.provinces.filter((province) =>
      province.name.toLowerCase().includes(name.toLowerCase()),
    );

    return Promise.resolve({ data: sortArray(res, sortBy, sortOrder) });
  }

  async findByCode(code: string) {
    return Promise.resolve(
      this.provinces.find((province) => province.code === code) ?? null,
    );
  }
}
