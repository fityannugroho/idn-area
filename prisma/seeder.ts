import { areArraysEqual } from '@/common/utils/array';
import {
  getDistricts,
  getIslands,
  getProvinces,
  getRegencies,
  getVillages,
} from '@/common/utils/data';
import { PrismaClient } from '@prisma/client';

export class Seeder {
  constructor(protected readonly prisma: PrismaClient) {}

  /**
   * Check if any provinces data have changed.
   */
  async hasProvinceChanges(): Promise<boolean> {
    const [newProvinces, oldProvinces] = await Promise.all([
      getProvinces(),
      this.prisma.province.findMany(),
    ]);

    return !areArraysEqual(newProvinces, oldProvinces);
  }

  /**
   * Check if any regencies data have changed.
   */
  async hasRegencyChanges(): Promise<boolean> {
    const [newRegencies, oldRegencies] = await Promise.all([
      getRegencies(),
      this.prisma.regency.findMany(),
    ]);

    return !areArraysEqual(newRegencies, oldRegencies);
  }

  /**
   * Check if any districts data have changed.
   */
  async hasDistrictChanges(): Promise<boolean> {
    const [newDistricts, oldDistricts] = await Promise.all([
      getDistricts(),
      this.prisma.district.findMany(),
    ]);

    return !areArraysEqual(newDistricts, oldDistricts);
  }

  /**
   * Check if any islands data have changed.
   */
  async hasIslandChanges(): Promise<boolean> {
    const [newIslands, oldIslands] = await Promise.all([
      getIslands(),
      this.prisma.island.findMany(),
    ]);

    return !areArraysEqual(newIslands, oldIslands);
  }

  /**
   * Check if any villages data have changed.
   */
  async hasVillageChanges(): Promise<boolean> {
    const [newVillages, oldVillages] = await Promise.all([
      getVillages(),
      this.prisma.village.findMany(),
    ]);

    return !areArraysEqual(newVillages, oldVillages);
  }

  /**
   * Check if there are data changes.
   */
  async hasDataChanges(): Promise<boolean> {
    if (await this.hasProvinceChanges()) {
      return true;
    }

    if (await this.hasRegencyChanges()) {
      return true;
    }

    if (await this.hasDistrictChanges()) {
      return true;
    }

    if (await this.hasIslandChanges()) {
      return true;
    }

    if (await this.hasVillageChanges()) {
      return true;
    }

    return false;
  }

  async insertProvinces(): Promise<number> {
    const provinces = await getProvinces();
    const res = await this.prisma.province.createMany({ data: provinces });
    return res.count;
  }

  async insertRegencies(): Promise<number> {
    const regencies = await getRegencies();
    const res = await this.prisma.regency.createMany({ data: regencies });
    return res.count;
  }

  async insertDistricts(): Promise<number> {
    const districts = await getDistricts();
    const res = await this.prisma.district.createMany({ data: districts });
    return res.count;
  }

  async insertVillages(): Promise<number> {
    const villages = await getVillages();
    const res = await this.prisma.village.createMany({ data: villages });
    return res.count;
  }

  async insertIslands(): Promise<number> {
    const islands = await getIslands();
    const res = await this.prisma.island.createMany({ data: islands });
    return res.count;
  }

  async deleteProvinces(): Promise<number> {
    const res = await this.prisma.province.deleteMany();
    return res.count;
  }

  async deleteRegencies(): Promise<number> {
    const res = await this.prisma.regency.deleteMany();
    return res.count;
  }

  async deleteDistricts(): Promise<number> {
    const res = await this.prisma.district.deleteMany();
    return res.count;
  }

  async deleteVillages(): Promise<number> {
    const res = await this.prisma.village.deleteMany();
    return res.count;
  }

  async deleteIslands(): Promise<number> {
    const res = await this.prisma.island.deleteMany();
    return res.count;
  }
}
