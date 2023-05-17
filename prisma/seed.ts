import { PrismaClient } from '@prisma/client';
import { join } from 'path';
import { CsvParser } from '~/src/common/helper/csv-parser';
import {
  AreaByCollection,
  Areas,
  Collection,
  District,
  Island,
  Regency,
  Village,
  isDistrict,
  isIsland,
  isRegency,
  isVillage,
} from './utils';

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

  if (data.every(isIsland)) {
    return await prisma.island.createMany({
      data: (data as Island[]).map((item) => ({
        code: item.code,
        coordinate: item.coordinate,
        isOutermostSmall: item.is_outermost_small === 'true',
        isPopulated: item.is_populated === 'true',
        name: item.name,
        regencyCode: item.regency_code,
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

const insertAreaData = async <T extends Collection>(collection: T) => {
  console.time(`insert-${collection}`);

  const filePath = join(__dirname, `../data/${collection}.csv`);
  const parsed = await CsvParser.parse<AreaByCollection<T>>(filePath, {
    header: true,
  });
  const res = await insertData(parsed.data);

  console.timeEnd(`insert-${collection}`);
  return res;
};

async function main() {
  await deleteAreaData('villages');
  await deleteAreaData('districts');
  await deleteAreaData('islands');
  await deleteAreaData('regencies');
  await deleteAreaData('provinces');

  await insertAreaData('provinces');
  await insertAreaData('regencies');
  await insertAreaData('islands');
  await insertAreaData('districts');
  await insertAreaData('villages');
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
