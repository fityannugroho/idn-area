import { PrismaClient } from '@prisma/client';
import * as IdnArea from 'idn-area-data';

const prisma = new PrismaClient();

const insertProvinces = async () => {
  const provinces = await IdnArea.provinces();
  return await prisma.province.createMany({ data: provinces });
};

const insertRegencies = async () => {
  const regencies = await IdnArea.regencies();
  return await prisma.regency.createMany({
    data: regencies.map((regency) => ({
      code: regency.code,
      name: regency.name,
      provinceCode: regency.province_code,
    })),
  });
};

const insertDistricts = async () => {
  const districts = await IdnArea.districts();
  return await prisma.district.createMany({
    data: districts.map((district) => ({
      code: district.code,
      name: district.name,
      regencyCode: district.regency_code,
    })),
  });
};

const insertVillages = async () => {
  const villages = await IdnArea.villages();
  return await prisma.village.createMany({
    data: villages.map((village) => ({
      code: village.code,
      name: village.name,
      districtCode: village.district_code,
    })),
  });
};

/**
 * Delete all data in a collection.
 */
const deleteAreaData = async (collection: IdnArea.Areas) => {
  console.time(`delete-${collection}`);
  const result = await prisma.$runCommandRaw({
    delete: collection,
    deletes: [
      {
        q: {},
        limit: 0,
      },
    ],
  });

  console.timeEnd(`delete-${collection}`);
  return result;
};

const insertAreaData = async (collection: IdnArea.Areas) => {
  console.time(`insert-${collection}`);
  let result = null;

  switch (collection) {
    case 'provinces':
      result = await insertProvinces();
      break;
    case 'regencies':
      result = await insertRegencies();
      break;
    case 'districts':
      result = await insertDistricts();
      break;
    case 'villages':
      result = await insertVillages();
      break;
    default:
      throw new Error('Invalid collection');
  }

  console.timeEnd(`insert-${collection}`);
  return result;
};

async function main() {
  await deleteAreaData('villages');
  await deleteAreaData('districts');
  await deleteAreaData('regencies');
  await deleteAreaData('provinces');

  await insertAreaData('provinces');
  await insertAreaData('regencies');
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
