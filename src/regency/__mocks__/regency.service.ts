import { FindOptions } from '@/common/common.service';
import { sortArray } from '@/common/utils/array';
import { convertCoordinate } from '@/common/utils/coordinate';
import { SortOptions } from '@/sort/sort.service';
import { District, Island, Regency } from '@prisma/client';

export class MockRegencyService {
  readonly regencies: readonly Regency[];
  readonly districts: readonly District[];
  readonly islands: readonly Island[];

  constructor(regencies: Regency[], districts: District[], islands: Island[]) {
    this.regencies = regencies;
    this.districts = districts;
    this.islands = islands;
  }

  async find({
    name = '',
    sortBy = 'code',
    sortOrder,
  }: FindOptions<Regency> = {}) {
    const res = this.regencies.filter((regency) =>
      regency.name.toLowerCase().includes(name.toLowerCase()),
    );

    return Promise.resolve({ data: sortArray(res, sortBy, sortOrder) });
  }

  async findByCode(code: string) {
    return Promise.resolve(
      this.regencies.find((regency) => regency.code === code) ?? null,
    );
  }

  async findDistricts(
    regencyCode: string,
    { sortBy = 'code', sortOrder }: SortOptions<District> = {},
  ) {
    if (this.regencies.every((r) => r.code !== regencyCode)) {
      return null;
    }

    const res = this.districts.filter(
      (district) => district.regencyCode === regencyCode,
    );

    return Promise.resolve({ data: sortArray(res, sortBy, sortOrder) });
  }

  async findIslands(
    regencyCode: string,
    { sortBy = 'code', sortOrder }: SortOptions<Island> = {},
  ) {
    if (this.regencies.every((r) => r.code !== regencyCode)) {
      return null;
    }

    const res = this.islands
      .filter((island) => island.regencyCode === regencyCode)
      .map((island) => {
        const [latitude, longitude] = convertCoordinate(island.coordinate);
        return { ...island, latitude, longitude };
      });

    return Promise.resolve(sortArray(res, sortBy, sortOrder));
  }
}
