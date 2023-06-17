import { PrismaClient } from '@prisma/client';
import { timify } from '../utils/helpers';
import { Seeder } from './seeder';
import { validateDBConfig } from '~/utils/db';

const prisma = new PrismaClient();

async function main() {
  validateDBConfig();

  const seeder = new Seeder(prisma);

  console.log('Deleting all data...');
  await timify(seeder.deleteVillages.bind(seeder), 'delete-villages')();
  await timify(seeder.deleteIslands.bind(seeder), 'delete-islands')();
  await timify(seeder.deleteDistricts.bind(seeder), 'delete-districts')();
  await timify(seeder.deleteRegencies.bind(seeder), 'delete-regencies')();
  await timify(seeder.deleteProvinces.bind(seeder), 'delete-provinces')();

  console.log('Inserting all data...');
  await timify(seeder.insertProvinces.bind(seeder), 'insert-provinces')();
  await timify(seeder.insertRegencies.bind(seeder), 'insert-regencies')();
  await timify(seeder.insertDistricts.bind(seeder), 'insert-districts')();
  await timify(seeder.insertIslands.bind(seeder), 'insert-islands')();
  await timify(seeder.insertVillages.bind(seeder), 'insert-villages')();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err: Error) => {
    console.error(`${err.name}: ${err.message}`);
    await prisma.$disconnect();
    process.exit(1);
  });
