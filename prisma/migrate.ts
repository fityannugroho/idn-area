import { dbConfig } from '~/utils/config/db';
import { validateDBConfig } from '~/utils/db';
import { dbProvider } from '~/utils/db/provider';
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
