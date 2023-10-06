import { dbConfig } from '@/common/config/db';
import { DatabaseConfigError } from '@/common/utils/db/errors';
import { runOrFail } from '@/common/utils/runner';

const main = async () => {
  if (!dbConfig.provider) {
    throw new DatabaseConfigError('`DB_PROVIDER` is not defined.');
  }

  await runOrFail(
    `prisma generate --schema prisma/${dbConfig.provider}/schema.prisma`,
  );
};

main().catch((err: Error) => {
  console.error(`${err.name}: ${err.message}`);
  process.exit(1);
});
