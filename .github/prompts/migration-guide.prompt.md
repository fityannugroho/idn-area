# Database Migration Guide

You are helping with database migrations for the Indonesian Area API project.

## Context Files
- [Prisma schemas](../../prisma/)
- [PostgreSQL migrations](../../prisma/postgresql/migrations/)
- [MySQL migrations](../../prisma/mysql/migrations/)
- [SQLite migrations](../../prisma/sqlite/migrations/)
- [Seeder scripts](../../prisma/seeder.ts)

## Migration Workflow
1. **Schema Changes**: Update the appropriate `prisma/{provider}/schema.prisma` file
2. **Create Migration**: Run `pnpm prisma migrate dev --name <migration-name>` to create a new migration
3. **Generate Migration**: Run `pnpm db:migrate` for the specific provider to apply the migrations
4. **Test Migration**: Verify migration works on development database
5. **Update Seeder**: Modify seeder if data structure changes
6. **Test Data**: Run `pnpm db:seed` to verify data integrity

## Multi-Database Considerations
- Apply changes to all four providers: MongoDB, PostgreSQL, MySQL, SQLite
- Check provider-specific features in [#file:src/common/utils/db/provider.ts](../../src/common/utils/db/provider.ts)
- Verify migrations work across all supported database providers

## Data Integrity
- Indonesian area data follows hierarchical structure: Province → Regency → District → Village
- Area codes use dotted notation format (e.g., `32.01.03.2001`)
- Islands can belong to regencies or provinces directly
- Coordinate data may be in DMS format requiring conversion

When helping with migrations, always consider the impact on existing data and provide rollback strategies.
