import { PrismaClient } from '@prisma/client';
import * as IdnArea from 'idn-area-data';

export class Seeder {
  constructor(protected readonly prisma: PrismaClient) {}

  async insertProvinces(): Promise<number> {
    const provinces = await IdnArea.provinces();
    const res = await this.prisma.province.createMany({ data: provinces });
    return res.count;
  }

  async insertRegencies(): Promise<number> {
    const regencies = await IdnArea.regencies({ transform: true });
    const res = await this.prisma.regency.createMany({ data: regencies });
    return res.count;
  }

  async insertDistricts(): Promise<number> {
    const districts = await IdnArea.districts({ transform: true });
    const res = await this.prisma.district.createMany({ data: districts });
    return res.count;
  }

  async insertVillages(): Promise<number> {
    const villages = await IdnArea.villages({ transform: true });
    const res = await this.prisma.village.createMany({ data: villages });
    return res.count;
  }

  async insertIslands(): Promise<number> {
    const islands = await IdnArea.islands({ transform: true });
    const res = await this.prisma.island.createMany({
      data: islands.map((island) => ({
        ...island,
        regencyCode: island.regencyCode || null,
      })),
    });

    return res.count;
  }

  async deleteProvinces(): Promise<number> {
    const res = await this.prisma.province.deleteMany({
      where: {},
    });
    return res.count;
  }

  async deleteRegencies(): Promise<number> {
    const res = await this.prisma.regency.deleteMany({
      where: {},
    });
    return res.count;
  }

  async deleteDistricts(): Promise<number> {
    const res = await this.prisma.district.deleteMany({
      where: {},
    });
    return res.count;
  }

  async deleteVillages(): Promise<number> {
    const res = await this.prisma.village.deleteMany({
      where: {},
    });
    return res.count;
  }

  async deleteIslands(): Promise<number> {
    const res = await this.prisma.island.deleteMany({
      where: {},
    });
    return res.count;
  }
}
