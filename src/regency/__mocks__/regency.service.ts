import { sortArray } from '@common/utils/array';
import { Regency } from '@prisma/client';
import { RegencyFindQueries } from '../regency.dto';

export class MockRegencyService {
  readonly regencies: readonly Regency[];

  constructor(regencies: Regency[]) {
    this.regencies = regencies;
  }

  async find({
    name = '',
    provinceCode,
    sortBy = 'code',
    sortOrder,
  }: RegencyFindQueries = {}) {
    let res = this.regencies.filter((regency) =>
      regency.name.toLowerCase().includes(name.toLowerCase()),
    );

    if (provinceCode) {
      res = res.filter((regency) => regency.provinceCode === provinceCode);
    }

    return Promise.resolve({ data: sortArray(res, sortBy, sortOrder) });
  }

  async findByCode(code: string) {
    return Promise.resolve(
      this.regencies.find((regency) => regency.code === code) ?? null,
    );
  }
}
