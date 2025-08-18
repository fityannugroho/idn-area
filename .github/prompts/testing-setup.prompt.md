# Testing Setup Guide

You are helping with setting up tests for the Indonesian Area API project.

## Context Files
- [Test fixtures](../../test/fixtures/)
- [Mock services](../../test/mocks/)
- [Example unit tests](../../src/province/province.service.spec.ts)
- [Example E2E tests](../../test/province.e2e-spec.ts)

## Testing Framework Setup
- **Vitest**: Used for unit testing with TypeScript support
- **Supertest**: Used for E2E API testing
- **Coverage**: 80% threshold required with v8 provider

## Mock Strategy
1. **Prisma Mocking**: Use `createMockPrismaService()` from test/mocks/
2. **Test Data**: Use factory functions from test/fixtures/data.fixtures.ts
3. **E2E Setup**: Use AppTester helper for application bootstrapping

## Common Test Patterns
```typescript
// Unit test setup
const mockPrismaService = createMockPrismaService();
const mockSortService = createMockSortService();

// E2E test setup
const appTester = new AppTester();
await appTester.setup();
```

## Test Data Guidelines
- Use fixture factories for consistent, predictable test data
- Mock Indonesian area data following actual hierarchy patterns
- Include edge cases: invalid codes, missing data, coordinate conversions

## Coverage Requirements
- Maintain 80% coverage across all modules
- Test both success and error scenarios
- Validate input validation and error handling

When writing tests, focus on behavior verification rather than implementation details.
