#!/bin/sh
set -e

# Run database migrations
pnpm run db:migrate

# Run database seeding
pnpm run db:seed

# Start the application
pnpm run start:prod
