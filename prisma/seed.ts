import { PrismaClient } from '@prisma/client';
import { dbConfig } from '@/common/config/db';
import { validateDBConfig } from '@/common/utils/db';
import { dbProvider } from '@/common/utils/db/provider';
import { timify } from '@/common/utils/timify';
import { MongodbSeeder } from './mongodb/seeder';
import { Seeder } from './seeder';

const prisma = new PrismaClient();

async function main() {
  validateDBConfig();

  let seeder = new Seeder(prisma);

  if (dbConfig.provider === dbProvider.mongodb) {
    seeder = new MongodbSeeder(prisma);
  }

  // Skip the seeder if if there are no data changes.
  console.log('Checking for data changes...\n');
  if (!(await seeder.hasDataChanges())) {
    console.log('There are no data changes. Seeder is skipped.');
    return;
  }
  console.log('Data changes found!');

  console.log('Deleting all data...');
  await timify(() => seeder.deleteAreas('village'), 'delete-villages')();
  await timify(() => seeder.deleteAreas('district'), 'delete-districts')();
  await timify(() => seeder.deleteAreas('island'), 'delete-islands')();
  await timify(() => seeder.deleteAreas('regency'), 'delete-regencies')();
  await timify(() => seeder.deleteAreas('province'), 'delete-provinces')();

  console.log('Inserting all data...');
  await timify(() => seeder.insertAreas('province'), 'insert-provinces')();
  await timify(() => seeder.insertAreas('regency'), 'insert-regencies')();
  await timify(() => seeder.insertAreas('island'), 'insert-islands')();
  await timify(() => seeder.insertAreas('district'), 'insert-districts')();
  await timify(() => seeder.insertAreas('village'), 'insert-villages')();

  await seeder.generateLog();
}

(async () => {
  try {
    await main();
    process.exitCode = 0;
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }

  // Cleanup
  try {
    await prisma.$disconnect();
  } catch {
    // ignore
  }

  process.exit();
})();
