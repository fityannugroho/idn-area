import { areArraysEqual } from '@/common/utils/array';
import { PrismaClient } from '@prisma/client';
import * as IdnArea from 'idn-area-data';
import { Areas } from 'idn-area-data';
import { Seeder } from '../seeder';

export class MongodbSeeder extends Seeder {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async hasProvinceChanges(): Promise<boolean> {
    const [newProvinces, oldProvinces] = await Promise.all([
      IdnArea.provinces(),
      this.prisma.province.findMany(),
    ]);

    return !areArraysEqual(newProvinces, oldProvinces, ['code', 'name']);
  }

  async hasRegencyChanges(): Promise<boolean> {
    const [newRegencies, oldRegencies] = await Promise.all([
      IdnArea.regencies({ transform: true }),
      this.prisma.regency.findMany(),
    ]);

    return !areArraysEqual(newRegencies, oldRegencies, [
      'code',
      'name',
      'provinceCode',
    ]);
  }

  async hasDistrictChanges(): Promise<boolean> {
    const [newDistricts, oldDistricts] = await Promise.all([
      IdnArea.districts({ transform: true }),
      this.prisma.district.findMany(),
    ]);

    return !areArraysEqual(newDistricts, oldDistricts, [
      'code',
      'name',
      'regencyCode',
    ]);
  }

  async hasIslandChanges(): Promise<boolean> {
    const [newIslands, oldIslands] = await Promise.all([
      IdnArea.islands({ transform: true }),
      this.prisma.island.findMany(),
    ]);

    return !areArraysEqual(newIslands, oldIslands, [
      'code',
      'name',
      'regencyCode',
      'isPopulated',
      'isOutermostSmall',
    ]);
  }

  async hasVillageChanges(): Promise<boolean> {
    const [newVillages, oldVillages] = await Promise.all([
      IdnArea.villages({ transform: true }),
      this.prisma.village.findMany(),
    ]);

    return !areArraysEqual(newVillages, oldVillages, [
      'code',
      'name',
      'districtCode',
    ]);
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
