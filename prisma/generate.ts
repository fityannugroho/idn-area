import { dbConfig } from '@/common/config/db';
import { runOrFail } from '@/common/utils/runner';
import { validateDBConfig } from '@/common/utils/db';

const main = async () => {
  validateDBConfig();

  await runOrFail(
    `prisma generate --schema prisma/${dbConfig.provider}/schema.prisma`,
  );
};

main().catch((err: Error) => {
  console.error(`${err.name}: ${err.message}`);
  process.exit(1);
});
