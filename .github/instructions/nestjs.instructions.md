---
applyTo: "src/**/*.ts"
description: "NestJS patterns for controllers and services"
---

# Controller Patterns
- **HTTP layer only**: Handle requests, validation, responses - no business logic
- **Thin controllers**: Delegate to services immediately after validation
- **Consistent responses**: All endpoints return `{ data: T }` via `PaginateInterceptor`
- **Validation**: Use DTOs with custom decorators (`@IsAreaCode`, `@IsOptional`)
- **Error handling**: Let exceptions bubble up to global filters

# Service Patterns
- **Constructor injection**: Services inject `PrismaService` + `SortService<T>`
- **Business logic**: Core data processing, transformation, and validation
- **Error handling**: Throw `NotFoundException` with consistent format
- **Pagination**: Use `prisma.paginator()` for all list endpoints
- **Sorting defaults**: `sortBy: 'code', sortOrder: 'asc'`

# Common Service Methods
- `find(options?)` - List entities with filtering, sorting, pagination
- `findByCode(code)` - Get single entity with hierarchical relationships
- Private helpers: `_addDecimalCoordinate()`, data transformation utilities

# Module Structure
- Each feature module exports: Controller, Service, Module, DTOs
- Import `PrismaModule` and `SortModule` in feature modules
- Use barrel exports from `index.ts` when appropriate
