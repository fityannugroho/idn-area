import { Island } from '@prisma/client';
import { sortArray } from '@/common/utils/array';
import { convertCoordinate } from '@/common/utils/coordinate';
import { IslandFindQueries } from '../island.dto';

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
    regencyCode,
    sortBy = 'code',
    sortOrder,
  }: IslandFindQueries = {}) {
    let res = this.islands.filter((island) =>
      island.name.toLowerCase().includes(name.toLowerCase()),
    );

    if (typeof regencyCode === 'string') {
      res = res.filter((island) =>
        regencyCode === ''
          ? island.regencyCode === null
          : island.regencyCode === regencyCode,
      );
    }

    return Promise.resolve({ data: sortArray(res, sortBy, sortOrder) });
  }

  async findByCode(code: string) {
    return Promise.resolve(
      this.islands.find((island) => island.code === code) ?? null,
    );
  }
}
