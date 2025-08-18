---
applyTo: "**/*dto.ts,**/decorator/*.ts,**/common/**"
description: "Validation patterns and custom decorators"
---

# Custom Validation Decorators
- **Area code validation**: `@IsAreaCode('province|regency|district|village|island')`
- **Input sanitization**: `@IsNotSymbol('allowed-chars')` for string cleaning
- **Coordinate validation**: Use `isValidCoordinate()` utility for coordinate data

# Area Code Format Standards
- **Province**: XX (2 characters) - `@IsAreaCode('province')`
- **Regency**: XX.XX (5 characters) - `@IsAreaCode('regency')`
- **District**: XX.XX.XX (8 characters) - `@IsAreaCode('district')`
- **Village**: XX.XX.XX.XXXX (13 characters) - `@IsAreaCode('village')`
- **Island**: XX.XX.XXXXX (11 characters) - `@IsAreaCode('island')`

# Coordinate Processing Guidelines
- **DMS format**: Validate Degrees Minutes Seconds input format
- **Conversion**: Use `convertCoordinate()` for DMS to decimal transformation
- **Error handling**: Always wrap coordinate conversion in try-catch blocks
- **Validation**: Apply `isValidCoordinate()` before processing coordinate data

# DTO Design Patterns
- **Required vs Optional**: Use `@IsOptional()` for query parameters and optional fields
- **Validation chains**: Combine multiple validation decorators for complex rules
- **Type safety**: Ensure DTOs match Prisma model types where applicable
- **Consistent naming**: Follow camelCase for DTO properties matching API responses
