import { dbConfig } from 'common/config/db';
import { validateDBConfig } from 'common/utils/db';
import { runOrFail } from 'common/utils/runner';

const main = async () => {
  validateDBConfig('provider');

  await runOrFail(
    `prisma generate --schema prisma/${dbConfig.provider}/schema.prisma`,
  );
};

main().catch((err: Error) => {
  console.error(`${err.name}: ${err.message}`);
  process.exit(1);
});
