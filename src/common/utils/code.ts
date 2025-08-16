/**
 * Utility functions for handling Indonesian area codes with dotted format.
 *
 * Format examples:
 * - Province: 11
 * - Regency: 11.01
 * - District: 11.01.01
 * - Village: 11.01.01.2001
 * - Island: 11.01.40001
 */

/**
 * Extract province code from any area code.
 * @param code The area code (province, regency, district, village, or island)
 * @returns The province code (2 digits)
 * @example extractProvinceCode('11.01.01.2001') // returns '11'
 */
export function extractProvinceCode(code: string): string {
  return code.slice(0, 2);
}

/**
 * Extract regency code from regency, district, village, or island code.
 * @param code The area code (regency, district, village, or island)
 * @returns The regency code (format: xx.xx)
 * @example extractRegencyCode('11.01.01.2001') // returns '11.01'
 */
export function extractRegencyCode(code: string): string {
  return code.slice(0, 5); // '11.01'
}

/**
 * Extract district code from district or village code.
 * @param code The area code (district or village)
 * @returns The district code (format: xx.xx.xx)
 * @example extractDistrictCode('11.01.01.2001') // returns '11.01.01'
 */
export function extractDistrictCode(code: string): string {
  return code.slice(0, 8); // '11.01.01'
}
