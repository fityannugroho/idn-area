import { FindOptions } from '@/common/common.service';
import { sortArray } from '@/common/utils/array';
import { convertCoordinate } from '@/common/utils/coordinate';
import { Island } from '@prisma/client';

export class MockIslandService {
  readonly islands: Island[];

  constructor(islands: Island[]) {
    this.islands = islands;
  }

  addDecimalCoordinate(island: Island) {
    const [latitude, longitude] = convertCoordinate(island.coordinate);

    return { ...island, latitude, longitude };
  }

  async find({
    name = '',
    sortBy = 'code',
    sortOrder,
  }: FindOptions<Island> = {}) {
    const res = this.islands.filter((island) =>
      island.name.toLowerCase().includes(name.toLowerCase()),
    );

    return Promise.resolve(sortArray(res, sortBy, sortOrder));
  }

  async findByCode(code: string) {
    return Promise.resolve(
      this.islands.find((island) => island.code === code) ?? null,
    );
  }
}
