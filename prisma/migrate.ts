import { appConfig } from 'common/config/app';
import { dbConfig } from 'common/config/db';
import { validateDBConfig } from 'common/utils/db';
import { dbProvider } from 'common/utils/db/provider';
import { runOrFail } from 'common/utils/runner';

const main = async () => {
  validateDBConfig();

  switch (dbConfig.provider) {
    case dbProvider.mongodb:
      await runOrFail('prisma db push --schema prisma/mongodb/schema.prisma');
      break;
    default:
      await runOrFail(
        `prisma migrate ${
          appConfig.env === 'prod' ? 'deploy' : 'dev'
        } --schema prisma/${dbConfig.provider}/schema.prisma`,
      );
      break;
  }

  console.log('The migration command has been executed.');
};

main().catch((err: Error) => {
  console.error(`${err.name}: ${err.message}`);
  process.exit(1);
});
