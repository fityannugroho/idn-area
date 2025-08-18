# Indonesian Area API - Repository Instructions

## Project Overview
Indonesian Area API - NestJS REST API providing comprehensive Indonesian administrative area data (provinces, regencies, districts, villages, islands) with multi-database support via Prisma.

## Domain Context
- **Data scope**: Complete Indonesian administrative boundaries hierarchy
- **Hierarchical structure**: Province → Regency → District → Village
- **Area codes**: Dotted notation format (e.g., `32.01.03.2001` for village in West Java)
- **Islands**: Special entities that can belong to regencies or provinces directly
- **Use cases**: Government systems, location services, demographic analysis, mapping applications

## Folder Structure
```
src/                    # Main application source code
├── common/            # Shared utilities, decorators, DTOs, interceptors
├── province/          # Province module (controllers, services, DTOs)
├── regency/           # Regency module (controllers, services, DTOs)
├── district/          # District module (controllers, services, DTOs)
├── village/           # Village module (controllers, services, DTOs)
├── island/            # Island module (controllers, services, DTOs)
├── prisma/            # Database service and interfaces
└── sort/              # Sorting utilities service

prisma/                # Database schemas and migrations
├── mongodb/           # MongoDB-specific schema and seeder
├── postgresql/        # PostgreSQL schema and migrations
├── mysql/             # MySQL schema and migrations
└── sqlite/            # SQLite schema and migrations

test/                  # Unit and E2E tests
├── fixtures/          # Test data factories
└── mocks/             # Service mocks (Prisma, etc.)
```

## Tech Stack & Key Libraries
- **Runtime**: Node.js >= 22.0.0
- **Framework**: NestJS v11+ with Fastify adapter
- **Database**: Prisma v6+ ORM (MongoDB, PostgreSQL, MySQL, SQLite)
- **Language**: TypeScript v5+ with strict configuration
- **Testing**: Vitest v3+ with 80% coverage requirement
- **Data source**: `idn-area-data` v4+ package with latest Indonesian area data
- **Code quality**: Biome for linting and formatting

## Coding Standards & Conventions
- **Language**: All code, comments, and documentation in English
- **Architecture**: Feature modules with thin controllers and business logic in services
- **Error handling**: Consistent `NotFoundException` with format `"[Entity] with code [code] not found."`
- **API responses**: All endpoints return `{ data: T }` via `PaginateInterceptor`
- **Validation**: Use custom decorators (`@IsAreaCode`, `@IsNotSymbol`) with class-validator
- **Database queries**: Always use `PrismaService.paginator()` for consistent pagination

## Development Workflow
1. **Analyze**: Understand current code structure and patterns
2. **Plan**: Explain proposed changes and confirm approach
3. **Implement**: Make focused, single-purpose changes following established patterns
4. **Test**: Validate changes with `pnpm test` (80% coverage required)
5. **Build**: Verify TypeScript compilation with `pnpm build`
6. **Iterate**: Move to next task after confirmation

## Key Commands
```bash
# Database Operations
pnpm prisma:gen    # Generate Prisma client
pnpm db:migrate    # Run migrations (provider-specific)
pnpm db:seed       # Seed database with latest Indonesian area data

# Testing & Quality
pnpm test          # Unit tests with Vitest
pnpm test:e2e      # End-to-end tests
pnpm test:cov      # Coverage report (80% minimum)
pnpm lint          # Lint and format with Biome
pnpm build         # TypeScript compilation check
```

## Reference Additional Instructions
This workspace uses modular instruction files for specific contexts:
- Core patterns: `core.instructions.md`
- NestJS patterns: `nestjs.instructions.md`
- Database patterns: `database.instructions.md`
- Validation patterns: `validation.instructions.md`
- Testing patterns: `testing.instructions.md`
- Development workflow: `development.instructions.md`
