import { validateDBConfig } from '~/utils/db';
import { dbConfig, dbProvider } from '~/utils/db/config';
import { runOrFail } from '../utils/helpers';

const main = async () => {
  validateDBConfig();

  switch (dbConfig.provider) {
    case dbProvider.mongodb:
      await runOrFail('prisma db push --schema prisma/mongodb/schema.prisma');
      break;
    default:
      await runOrFail(
        `prisma migrate dev --schema prisma/${dbConfig.provider}/schema.prisma`,
      );
      break;
  }

  console.log('The migration command has been executed.');
};

main().catch((err: Error) => {
  console.error(`${err.name}: ${err.message}`);
  process.exit(1);
});
