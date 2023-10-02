import { FindOptions } from '@/common/common.service';
import { sortArray } from '@/common/utils/array';
import { Village } from '@prisma/client';

export class MockVillageService {
  readonly villages: Village[];

  constructor(villages: Village[]) {
    this.villages = villages;
  }

  async find({
    name = '',
    sortBy = 'code',
    sortOrder,
  }: FindOptions<Village> = {}) {
    const res = this.villages.filter((village) =>
      village.name.toLowerCase().includes(name.toLowerCase()),
    );

    return Promise.resolve({ data: sortArray(res, sortBy, sortOrder) });
  }

  async findByCode(code: string) {
    return Promise.resolve(
      this.villages.find((village) => village.code === code) ?? null,
    );
  }
}
