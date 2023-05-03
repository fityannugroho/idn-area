import { PrismaClient } from '@prisma/client';
import { join } from 'path';
import { isDistrict, isRegency, isVillage, parseCsvFromLocal } from './helper';
import { Areas, AreaByCollection, Collection } from './types';

const prisma = new PrismaClient();

const upsertData = async <T extends Areas>(data: T[]) => {
  return await Promise.all(
    data.map(async (record) => {
      if (isRegency(record)) {
        return await prisma.regency.upsert({
          where: { code: record.code },
          create: {
            code: record.code,
            name: record.name,
            provinceCode: record.province_code,
          },
          update: {
            name: record.name,
            provinceCode: record.province_code,
          },
        });
      }

      if (isDistrict(record)) {
        return await prisma.district.upsert({
          where: { code: record.code },
          create: {
            code: record.code,
            name: record.name,
            regencyCode: record.regency_code,
          },
          update: {
            name: record.name,
            regencyCode: record.regency_code,
          },
        });
      }

      if (isVillage(record)) {
        return await prisma.village.upsert({
          where: { code: record.code },
          create: {
            code: record.code,
            name: record.name,
            districtCode: record.district_code,
          },
          update: {
            name: record.name,
            districtCode: record.district_code,
          },
        });
      }

      return await prisma.province.upsert({
        where: { code: record.code },
        create: record,
        update: record,
      });
    }),
  );
};

const deleteUnknownData = async <T extends Areas>(data: T[]) => {
  const codes = data.map((record) => record.code);
  const options = {
    where: {
      code: {
        notIn: codes,
      },
    },
  };

  if (data.every(isRegency)) {
    return await prisma.regency.deleteMany(options);
  }

  if (data.every(isDistrict)) {
    return await prisma.district.deleteMany(options);
  }

  if (data.every(isVillage)) {
    return await prisma.village.deleteMany(options);
  }

  return await prisma.province.deleteMany(options);
};

const refreshData = <T extends Collection>(collection: T) => {
  const filePath = join(__dirname, `../src/data/${collection}.csv`);

  parseCsvFromLocal<AreaByCollection<T>>(filePath, async (result) => {
    console.log(`Start refreshing ${collection}...`);
    console.time(`refresh-${collection}`);

    await deleteUnknownData(result.data);
    await upsertData(result.data);

    console.log(`${collection} successfully refreshed.`);
    console.timeEnd(`refresh-${collection}`);
  });
};

async function main() {
  refreshData('provinces');
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
