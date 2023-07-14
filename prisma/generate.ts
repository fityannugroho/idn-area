import { dbConfig } from '@/common/config/db';
import { validateDBConfig } from '~/utils/db';
import { runOrFail } from '../utils/helpers';

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
