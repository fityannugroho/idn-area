import { PrismaClient } from '@prisma/client';
import {
  getDistricts,
  getIslands,
  getProvinces,
  getRegencies,
  getVillages,
} from '@/common/utils/data';
import { getInstalledPackageVersion } from '@/common/utils/package';

export type Area = 'province' | 'regency' | 'district' | 'village' | 'island';

export class Seeder {
  constructor(protected readonly prisma: PrismaClient) {
    // Bind the methods to the class instance.
    this.hasDataChanges = this.hasDataChanges.bind(this);
    this.insertAreas = this.insertAreas.bind(this);
    this.deleteAreas = this.deleteAreas.bind(this);
    this.generateLog = this.generateLog.bind(this);
  }

  /**
   * Check if there are data changes.
   */
  async hasDataChanges(): Promise<boolean> {
    const packageVersion = getInstalledPackageVersion('idn-area-data');

    if (!packageVersion) {
      throw new Error(
        'idn-area-data package is not installed. Make sure to run `pnpm install` first.',
      );
    }

    const { dataVersion } =
      (await this.prisma.seederLogs.findFirst({
        orderBy: { createdAt: 'desc' },
      })) ?? {};

    // Compare the installed version of the package with the latest data version in the database.
    return !dataVersion || dataVersion !== packageVersion;
  }

  // Methods to insert data to the database.
  async insertAreas(area: Area): Promise<number> {
    const data = await {
      province: getProvinces,
      regency: getRegencies,
      district: getDistricts,
      village: getVillages,
      island: getIslands,
    }[area]();

    const res = await (this.prisma as any)[area].createMany({ data });
    return res.count;
  }

  async deleteAreas(area: Area): Promise<number> {
    const res = await (this.prisma as any)[area].deleteMany();
    return res.count;
  }

  /**
   * Generate a log after the seeder is executed
   */
  async generateLog(): Promise<void> {
    const packageVersion = getInstalledPackageVersion('idn-area-data');

    if (!packageVersion) {
      throw new Error(
        'idn-area-data package is not installed. Make sure to run `pnpm install` first.',
      );
    }

    await this.prisma.seederLogs.create({
      data: { dataVersion: packageVersion },
    });
  }
}
