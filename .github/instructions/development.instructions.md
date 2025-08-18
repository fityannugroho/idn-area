---
applyTo: "package.json,**/scripts/**,**/.github/workflows/**"
description: "Development workflow and command patterns"
---

# Essential Development Commands
```bash
# Database Operations
pnpm prisma:gen    # Generate Prisma client after schema changes
pnpm db:migrate    # Run database migrations (provider-specific)
pnpm db:seed       # Seed database with latest Indonesian area data

# Testing & Quality Assurance
pnpm test          # Unit tests with Vitest
pnpm test:e2e      # End-to-end tests with full application setup
pnpm test:cov      # Coverage report (80% threshold required)

# Code Quality & Build
pnpm lint          # Lint with Biome
pnpm lint:fix      # Lint and auto-fix formatting with Biome
pnpm build         # TypeScript compilation validation
```

# Technology Stack Requirements
- **Node.js**: >= 22.0.0 for optimal performance and latest features
- **NestJS**: v11+ with Fastify adapter for high-performance HTTP handling
- **Prisma**: v6+ multi-database ORM supporting all four database providers
- **Biome**: Fast linter and formatter replacing ESLint/Prettier for better performance
- **Vitest**: v3+ test runner with TypeScript support and ESM compatibility

# AI Assistant Development Workflow
1. **Analyze**: Understand current code structure and existing patterns
2. **Plan**: Explain proposed changes and confirm approach before implementation
3. **Implement**: Make focused, single-purpose changes following established conventions
4. **Test**: Validate changes with `pnpm test` to ensure 80% coverage is maintained
5. **Build**: Verify TypeScript compilation with `pnpm build`
6. **Iterate**: Move to next task only after confirmation of successful completion

# Development Best Practices
- **Incremental approach**: Make small, focused changes rather than large refactors
- **Testing discipline**: Run tests after every significant change
- **Build validation**: Always verify TypeScript compilation before completing tasks
- **Sequential execution**: Complete one task fully before moving to the next
- **Pattern consistency**: Follow existing code patterns and architectural decisions
