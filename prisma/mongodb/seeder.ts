import { PrismaClient } from '@prisma/client';
import { Seeder } from '../seeder';
import { Areas } from 'idn-area-data';

export class MongodbSeeder extends Seeder {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Delete all data in a collection.
   */
  protected async deleteCollection(collection: Areas) {
    // Skip TypeScript checking because `$runCommandRaw()` method only available for mongodb provider.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return await this.prisma.$runCommandRaw({
      delete: collection,
      deletes: [
        {
          q: {},
          limit: 0,
        },
      ],
    });
  }

  async deleteProvinces(): Promise<number> {
    const res = await this.deleteCollection('provinces');
    return res.n as number;
  }

  async deleteRegencies(): Promise<number> {
    const res = await this.deleteCollection('regencies');
    return res.n as number;
  }

  async deleteDistricts(): Promise<number> {
    const res = await this.deleteCollection('districts');
    return res.n as number;
  }

  async deleteVillages(): Promise<number> {
    const res = await this.deleteCollection('villages');
    return res.n as number;
  }

  async deleteIslands(): Promise<number> {
    const res = await this.deleteCollection('islands');
    return res.n as number;
  }
}
