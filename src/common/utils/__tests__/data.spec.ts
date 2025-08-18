import { describe, expect, it, vi } from 'vitest';

// Mock the idn-area-data module
vi.mock('idn-area-data', () => ({
  getData: vi.fn(),
}));

describe('Data Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProvinces', () => {
    it('should call getData with correct parameters for provinces', async () => {
      // Import after mocking
      const { getProvinces } = await import('../data');
      const { getData } = await import('idn-area-data');

      getProvinces();
      expect(getData).toHaveBeenCalledWith('provinces');
    });
  });

  describe('getRegencies', () => {
    it('should call getData with correct parameters for regencies', async () => {
      const { getRegencies } = await import('../data');
      const { getData } = await import('idn-area-data');

      getRegencies();
      expect(getData).toHaveBeenCalledWith('regencies', {
        transform: {
          headers: {
            province_code: 'provinceCode',
          },
        },
      });
    });
  });

  describe('getDistricts', () => {
    it('should call getData with correct parameters for districts', async () => {
      const { getDistricts } = await import('../data');
      const { getData } = await import('idn-area-data');

      getDistricts();
      expect(getData).toHaveBeenCalledWith('districts', {
        transform: {
          headers: {
            regency_code: 'regencyCode',
          },
        },
      });
    });
  });

  describe('getVillages', () => {
    it('should call getData with correct parameters for villages', async () => {
      const { getVillages } = await import('../data');
      const { getData } = await import('idn-area-data');

      getVillages();
      expect(getData).toHaveBeenCalledWith('villages', {
        transform: {
          headers: {
            district_code: 'districtCode',
          },
        },
      });
    });
  });

  describe('getIslands', () => {
    it('should call getData with correct parameters for islands', async () => {
      const { getIslands } = await import('../data');
      const { getData } = await import('idn-area-data');

      getIslands();
      expect(getData).toHaveBeenCalledWith('islands', {
        transform: {
          headers: {
            is_outermost_small: 'isOutermostSmall',
            is_populated: 'isPopulated',
            regency_code: 'regencyCode',
          },
          values: {
            regency_code: expect.any(Function),
            is_outermost_small: expect.any(Function),
            is_populated: expect.any(Function),
          },
        },
      });
    });

    it('should have correct value transformation functions', async () => {
      const { getIslands } = await import('../data');
      const { getData } = await import('idn-area-data');

      getIslands();

      // Get the actual call arguments to test the transformation functions
      const mockGetData = getData as any;
      const callArgs = mockGetData.mock.calls[0][1];
      const transformValues = callArgs.transform.values;

      // Test regency_code transformation
      expect(transformValues.regency_code('')).toBeNull();
      expect(transformValues.regency_code('12.34')).toBe('12.34');
      expect(transformValues.regency_code('test')).toBe('test');

      // Test is_outermost_small transformation
      expect(transformValues.is_outermost_small('0')).toBe(false);
      expect(transformValues.is_outermost_small('1')).toBe(true);
      expect(transformValues.is_outermost_small('2')).toBe(true);
      expect(transformValues.is_outermost_small('')).toBe(false);

      // Test is_populated transformation
      expect(transformValues.is_populated('0')).toBe(false);
      expect(transformValues.is_populated('1')).toBe(true);
      expect(transformValues.is_populated('2')).toBe(true);
      expect(transformValues.is_populated('')).toBe(false);
    });
  });
});
