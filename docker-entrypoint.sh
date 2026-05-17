#!/bin/sh
set -e

export PATH="${PATH}:/app/node_modules/.bin"

case "$DB_PROVIDER" in
  mongodb)
    prisma db push --schema "prisma/mongodb/schema.prisma"
    ;;
  *)
    prisma migrate deploy --schema "prisma/${DB_PROVIDER}/schema.prisma"
    ;;
esac

echo "Migration completed."

# Skip seeding if idn-area-data is not installed (e.g., production builds)
if node -e "require.resolve('idn-area-data')" 2>/dev/null; then
  prisma db seed
else
  echo "Skipping seed: idn-area-data not installed."
fi

exec node dist/main
