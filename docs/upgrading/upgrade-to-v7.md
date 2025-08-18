# Upgrade to idn-area version 7

## Breaking Changes Overview

Version 7 introduces significant changes to the code format and data structure. This upgrade uses [idn-area-data v4.0.0](https://github.com/fityannugroho/idn-area-data/releases/tag/v4.0.0) which includes data changes and formats. We also restores the original dotted notation for area codes that was previously stripped in earlier API versions.

## Requirements

### Node.js Version Requirement

Version 7 requires **Node.js ≥22.0.0** due to the updated `idn-area-data` dependency.

```json
{
  "engines": {
    "node": ">=22.0.0"
  }
}
```

### Data Version Update

This version uses **idn-area-data v4.0.0** and introduces the following changes:

#### Format Changes
- **Restored original dotted notation**: The API now preserves the dotted format from the source data instead of removing dots like in previous versions
- **Standardized name capitalization**: Changed from ALL CAPS to proper case formatting

#### Data Updates
- Latest 2025 administrative area data
- Improved data structure consistency
- Enhanced data validation

#### Technical Background
The underlying `idn-area-data` package has always used dotted notation in its source data (e.g., regency codes like `32.01`, district codes like `32.01.01`). However, previous API versions processed this data and removed the dots before serving it. Version 7 eliminates this processing step and serves the data in its original format, making the hierarchical relationships more explicit and easier to understand.

## Backward Compatibility

⚠️ **This is a breaking change.** Version 7 is **NOT** backward compatible with v6 due to the fundamental change in code formats.

## Restored Dotted Notation for Area Codes

**Important Context**: The underlying data source (`idn-area-data`) has always used dotted notation (e.g., `32.01`, `32.01.01`), but previous API versions (including v6) removed the dots to provide numeric-only codes. **Version 7 now preserves the original dotted format** from the data source.

### Code Format Changes

| Administrative Level | v6 Format    | v7 Format       |
| -------------------- | ------------ | --------------- |
| Province             | `32`         | `32`            |
| Regency              | `3201`       | `32.01`         |
| District             | `320101`     | `32.01.01`      |
| Village              | `3201012001` | `32.01.01.2001` |
| Island               | `320140001`  | `32.01.40001`   |

### Background: Why This Change?

In previous versions (v6 and earlier), the API processed the source data and **removed dots** to provide numeric-only codes. For example:
- Source data: `32.01` (Kabupaten Bogor)
- API v6 output: `3201` (dots removed)
- API v7 output: `32.01` (preserves original format)

This change aligns the API output with the actual data structure used in the Indonesian administrative system and makes the hierarchical relationship more explicit.

### Database Schema Updates

The following field lengths have been updated to accommodate the new dotted format:

| Table       | Field           | v6 Length   | v7 Length   |
| ----------- | --------------- | ----------- | ----------- |
| `regencies` | `code`          | VARCHAR(4)  | VARCHAR(5)  |
| `districts` | `code`          | VARCHAR(6)  | VARCHAR(8)  |
| `districts` | `regency_code`  | VARCHAR(4)  | VARCHAR(5)  |
| `villages`  | `code`          | VARCHAR(10) | VARCHAR(13) |
| `villages`  | `district_code` | VARCHAR(6)  | VARCHAR(8)  |
| `islands`   | `code`          | VARCHAR(9)  | VARCHAR(11) |
| `islands`   | `regency_code`  | VARCHAR(4)  | VARCHAR(5)  |

## Updated Name Capitalization

Version 7 also standardizes the capitalization of administrative area names to follow proper name formatting instead of ALL CAPS.

### Name Format Changes

| Administrative Level | v6 Format (ALL CAPS) | v7 Format (Proper Case)      |
| -------------------- | -------------------- | ---------------------------- |
| Province             | `JAWA BARAT`         | `Jawa Barat`                 |
| Province             | `DI YOGYAKARTA`      | `Daerah Istimewa Yogyakarta` |
| Regency              | `KABUPATEN BOGOR`    | `Kabupaten Bogor`            |
| Regency              | `KOTA BOGOR`         | `Kota Bogor`                 |
| District             | `NANGGUNG`           | `Nanggung`                   |
| Village              | `BANTARJATI`         | `Bantarjati`                 |
| Island               | `PULAU RAMBUT`       | `Pulau Rambut`               |

### Examples of Name Changes

**Provinces:**
- `ACEH` → `Aceh`
- `SUMATERA UTARA` → `Sumatera Utara`
- `JAWA BARAT` → `Jawa Barat`
- `DI YOGYAKARTA` → `Daerah Istimewa Yogyakarta`

**Regencies:**
- `KABUPATEN ACEH SELATAN` → `Kabupaten Aceh Selatan`
- `KABUPATEN BOGOR` → `Kabupaten Bogor`
- `KOTA JAKARTA PUSAT` → `Kota Jakarta Pusat`

## API Response Changes

### Updated Response Examples

All endpoints now return codes in the new dotted format:

**Get a regency (v7):**
```
GET /regencies/32.01
```
```json
{
  "statusCode": 200,
  "message": "OK",
  "data": {
    "code": "32.01",
    "name": "Kabupaten Bogor",
    "provinceCode": "32"
  }
}
```

**Get districts (v7):**
```
GET /districts?regencyCode=32.01
```
```json
{
  "statusCode": 200,
  "message": "OK",
  "data": [
    {
      "code": "32.01.01",
      "name": "Nanggung",
      "regencyCode": "32.01"
    },
    {
      "code": "32.01.02",
      "name": "Leuwiliang",
      "regencyCode": "32.01"
    }
  ],
  "meta": {
    "total": 2,
    "pages": {
      "first": 1,
      "last": 1,
      "current": 1,
      "previous": null,
      "next": null
    }
  }
}
```

### Island Response Improvements

Islands now automatically include calculated decimal coordinates in the response:

```json
{
  "code": "32.01.40001",
  "name": "Pulau Rambut",
  "coordinate": "06°10'30.00\" S 106°38'30.00\" E",
  "isOutermostSmall": false,
  "isPopulated": false,
  "regencyCode": "32.01",
  "latitude": -6.175000000000001,
  "longitude": 106.64166666666668
}
```

The `latitude` and `longitude` fields are now automatically computed from the `coordinate` field and included in all island responses.

## New Features

### Enhanced Island Data

Islands now include automatically calculated decimal coordinates:
- `latitude`: Decimal latitude from DMS coordinate
- `longitude`: Decimal longitude from DMS coordinate

These fields are computed server-side and always included in island responses.

### Improved Testing Infrastructure

Version 7 includes significant improvements to the testing framework:
- Comprehensive E2E testing covering complete user journeys
- Simplified test data fixtures
- Better mock services for unit testing
- Performance-focused testing strategies

## FAQ

### Q: Can I gradually migrate to v7?
**A:** No, due to the fundamental change in code format, you need to migrate completely. The old numeric format is no longer supported.

### Q: Are there any tools to help with migration?
**A:** You can create migration scripts using the patterns shown above. Consider writing automated tests to verify your migration.

### Q: Will the API endpoints change?
**A:** No, the endpoint URLs remain the same. Only the code formats in requests and responses have changed.

## Need Help?

If you encounter issues during migration:
1. Check the [main documentation](../../README.md) for usage examples
2. Review the [test fixtures](../../test/fixtures/data.fixtures.ts) for correct code formats
3. Open an issue on [GitHub](https://github.com/fityannugroho/idn-area/issues)
