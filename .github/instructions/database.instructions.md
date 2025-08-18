---
applyTo: "**/*.service.ts,**/prisma/**,**/schema.prisma"
description: "Database patterns and Prisma conventions"
---

# Multi-Database Support
- **Providers**: MongoDB, PostgreSQL, MySQL, SQLite via separate schema files
- **Schema files**: `prisma/{provider}/schema.prisma` per database type
- **Migrations**: Database-specific in `prisma/{provider}/migrations/`
- **Provider features**: Use `getDBProviderFeatures()?.filtering?.insensitive` for case-insensitive search

# Database Query Patterns
- **Pagination**: Always use `PrismaService.paginator()` for list operations
- **Filtering**: Apply conditional filters based on query parameters
- **Sorting**: Use `SortService` for consistent ordering with fallback defaults
- **Case sensitivity**: Check provider features before using `mode: 'insensitive'`

# Performance Considerations
- **Coordinate processing**: Use in-place modification to avoid memory pressure
- **Island coordinates**: Process coordinates efficiently for large datasets
- **Query optimization**: Leverage database-specific features and indexing

# Hierarchical Relationships
- **Data structure**: Province → Regency → District → Village hierarchy
- **Islands**: Can belong to regencies or provinces directly
- **Code extraction**: Use utility functions (`extractProvinceCode`, `extractRegencyCode`, etc.)

# Error Handling
- **Not found**: Throw `NotFoundException` with format `"[Entity] with code [code] not found."`
- **Database errors**: Let Prisma errors bubble up to global exception filter
- **Coordinate conversion**: Wrap coordinate processing in try-catch blocks
