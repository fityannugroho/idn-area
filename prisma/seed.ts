import { PrismaClient } from '@prisma/client';
import { join } from 'path';
import { isDistrict, isRegency, isVillage, parseCsvFromLocal } from './helper';
import {
  Areas,
  AreaByCollection,
  Collection,
  Regency,
  District,
  Village,
} from './types';

const prisma = new PrismaClient();

const insertData = async <T extends Areas>(data: T[]) => {
  if (data.every(isVillage)) {
    return await prisma.village.createMany({
      data: (data as Village[]).map((item) => ({
        code: item.code,
        name: item.name,
        districtCode: item.district_code,
      })),
    });
  }

  if (data.every(isDistrict)) {
    return await prisma.district.createMany({
      data: (data as District[]).map((item) => ({
        code: item.code,
        name: item.name,
        regencyCode: item.regency_code,
      })),
    });
  }

  if (data.every(isRegency)) {
    return await prisma.regency.createMany({
      data: (data as Regency[]).map((item) => ({
        code: item.code,
        name: item.name,
        provinceCode: item.province_code,
      })),
    });
  }

  return await prisma.province.createMany({ data });
};

/**
 * Delete all data in a collection.
 */
const deleteAreaData = async (collection: Collection) => {
  console.time(`delete-${collection}`);
  const res = await prisma.$runCommandRaw({
    delete: collection,
    deletes: [
      {
        q: {},
        limit: 0,
      },
    ],
  });

  console.timeEnd(`delete-${collection}`);
  return res;
};

const insertAreaData = <T extends Collection>(collection: T) => {
  const filePath = join(__dirname, `../data/${collection}.csv`);

  parseCsvFromLocal<AreaByCollection<T>>(filePath, async (result) => {
    console.time(`insert-${collection}`);
    const res = await insertData(result.data);

    console.timeEnd(`insert-${collection}`);
    return res;
  });
};

async function main() {
  await deleteAreaData('villages');
  await deleteAreaData('districts');
  await deleteAreaData('regencies');
  await deleteAreaData('provinces');

  insertAreaData('provinces');
  insertAreaData('regencies');
  insertAreaData('districts');
  insertAreaData('villages');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
