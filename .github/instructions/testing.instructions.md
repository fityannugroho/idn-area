---
applyTo: "**/*.spec.ts,test/**,**/*.test.ts"
description: "Testing patterns and mock strategies"
---

# Testing Framework & Standards
- **Vitest**: Fast unit test runner with TypeScript support and ESM compatibility
- **Supertest**: HTTP assertion library for E2E testing with NestJS/Fastify
- **Coverage**: 80% threshold requirement with v8 provider for accurate coverage

# Mock Strategy & Test Data
- **Fixtures**: Use factory functions from `test/fixtures/data.fixtures.ts` for consistent test data
- **Prisma mocking**: Import `createMockPrismaService()` from `test/mocks/prisma.mock.ts`
- **E2E setup**: Use `AppTester` helper class for application bootstrapping and cleanup
- **Test isolation**: Mock external dependencies (database, services) to avoid side effects

# Testing Guidelines & Best Practices
- **Test after changes**: Always run tests after code modifications (`pnpm test`)
- **Use factory patterns**: Leverage fixture factories for predictable test data
- **Mock external dependencies**: Mock Prisma, external services, and file system operations
- **Test error scenarios**: Validate error cases, edge conditions, and validation failures
- **Descriptive tests**: Use clear test descriptions that explain the expected behavior

# Common Testing Commands
- `pnpm test` - Unit tests with Vitest
- `pnpm test:e2e` - End-to-end tests with application setup
- `pnpm test:cov` - Coverage report (must meet 80% threshold)
- `pnpm test:watch` - Watch mode for development testing
