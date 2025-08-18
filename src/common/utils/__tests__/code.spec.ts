import {
  extractDistrictCode,
  extractProvinceCode,
  extractRegencyCode,
} from '../code';

describe('Code utility functions', () => {
  describe('extractProvinceCode', () => {
    it('should extract province code from various area codes', () => {
      expect(extractProvinceCode('11')).toBe('11');
      expect(extractProvinceCode('11.01')).toBe('11');
      expect(extractProvinceCode('11.01.01')).toBe('11');
      expect(extractProvinceCode('11.01.01.2001')).toBe('11');
      expect(extractProvinceCode('11.01.40001')).toBe('11');
      expect(extractProvinceCode('32.04.05.3002')).toBe('32');
    });

    it('should handle edge cases', () => {
      expect(extractProvinceCode('99')).toBe('99');
      expect(extractProvinceCode('01.02.03.4567')).toBe('01');
    });
  });

  describe('extractRegencyCode', () => {
    it('should extract regency code from regency codes', () => {
      expect(extractRegencyCode('11.01')).toBe('11.01');
      expect(extractRegencyCode('32.04')).toBe('32.04');
      expect(extractRegencyCode('99.99')).toBe('99.99');
    });

    it('should extract regency code from district codes', () => {
      expect(extractRegencyCode('11.01.01')).toBe('11.01');
      expect(extractRegencyCode('32.04.05')).toBe('32.04');
    });

    it('should extract regency code from village codes', () => {
      expect(extractRegencyCode('11.01.01.2001')).toBe('11.01');
      expect(extractRegencyCode('32.04.05.3002')).toBe('32.04');
    });

    it('should extract regency code from island codes', () => {
      expect(extractRegencyCode('11.01.40001')).toBe('11.01');
      expect(extractRegencyCode('32.04.49999')).toBe('32.04');
    });
  });

  describe('extractDistrictCode', () => {
    it('should extract district code from district codes', () => {
      expect(extractDistrictCode('11.01.01')).toBe('11.01.01');
      expect(extractDistrictCode('32.04.05')).toBe('32.04.05');
      expect(extractDistrictCode('99.99.99')).toBe('99.99.99');
    });

    it('should extract district code from village codes', () => {
      expect(extractDistrictCode('11.01.01.2001')).toBe('11.01.01');
      expect(extractDistrictCode('32.04.05.3002')).toBe('32.04.05');
      expect(extractDistrictCode('01.02.03.4567')).toBe('01.02.03');
    });

    it('should handle longer village codes', () => {
      expect(extractDistrictCode('11.01.01.2001')).toBe('11.01.01');
      expect(extractDistrictCode('32.73.11.9999')).toBe('32.73.11');
    });
  });
});
