import { Area, Seeder } from '../seeder';

export class MongodbSeeder extends Seeder {
  async deleteAreas(area: Area): Promise<number> {
    const mongoCollectionMap = {
      province: 'provinces',
      regency: 'regencies',
      district: 'districts',
      village: 'villages',
      island: 'islands',
    };

    // @ts-ignore Skip TypeScript checking because `$runCommandRaw()` method only available for mongodb provider.
    const res = await this.prisma.$runCommandRaw({
      delete: mongoCollectionMap[area],
      deletes: [
        {
          q: {},
          limit: 0,
        },
      ],
    });

    return res.n as number;
  }
}
