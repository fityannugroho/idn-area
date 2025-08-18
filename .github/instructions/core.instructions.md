---
applyTo: "**"
description: "Core patterns and conventions for idn-area API"
---

# Core Patterns
- **Area codes**: Dotted notation format (e.g., `32.01.03.2001`)
- **Error messages**: Consistent format `"[Entity] with code [code] not found."`
- **Language**: All code, comments, and documentation in English
- **Code format**: Uses dotted notation across all area codes

# Key Utilities
- `extractProvinceCode(code)` - first 2 digits (XX)
- `extractRegencyCode(code)` - first 5 chars (XX.XX)
- `extractDistrictCode(code)` - first 8 chars (XX.XX.XX)
- `getDBProviderFeatures()` - check database capabilities

# Common Gotchas
- MongoDB adds `id` property to responses (unique behavior)
- Coordinate conversion: wrap in try-catch for malformed data
- Case sensitivity: check provider features before `mode: 'insensitive'`
