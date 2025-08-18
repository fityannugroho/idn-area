import { convertCoordinate, isValidCoordinate } from '../coordinate';

describe('Coordinate utility functions', () => {
  describe('isValidCoordinate', () => {
    it('should validate correct DMS coordinates', () => {
      // Valid coordinates in DMS format
      expect(isValidCoordinate('00°00\'00.00" N 000°00\'00.00" E')).toBe(true);
      expect(isValidCoordinate('90°59\'59.99" S 180°59\'59.99" W')).toBe(true);
      expect(isValidCoordinate('45°30\'15.50" N 122°45\'30.75" W')).toBe(true);
      // Fix: minutes should be <= 59, not 76
      expect(isValidCoordinate('12°34\'56.78" S 098°45\'54.32" E')).toBe(true);
    });

    it('should reject invalid DMS coordinates', () => {
      // Invalid formats
      expect(isValidCoordinate('91°00\'00.00" N 000°00\'00.00" E')).toBe(false); // degrees > 90
      expect(isValidCoordinate('00°60\'00.00" N 000°00\'00.00" E')).toBe(false); // minutes >= 60
      expect(isValidCoordinate('00°00\'60.00" N 000°00\'00.00" E')).toBe(false); // seconds >= 60
      expect(isValidCoordinate('00°00\'00.00" X 000°00\'00.00" E')).toBe(false); // invalid pole
      expect(isValidCoordinate('00°00\'00.00" N 181°00\'00.00" E')).toBe(false); // longitude > 180
      expect(isValidCoordinate('invalid coordinate')).toBe(false);
      expect(isValidCoordinate('')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isValidCoordinate('90°00\'00.00" N 180°00\'00.00" E')).toBe(true); // max values
      expect(isValidCoordinate('00°00\'00.00" S 000°00\'00.00" W')).toBe(true); // min values
    });
  });

  describe('convertCoordinate', () => {
    it('should convert valid DMS coordinates to decimal', () => {
      // Basic conversion tests
      const result1 = convertCoordinate('00°00\'00.00" N 000°00\'00.00" E');
      expect(result1).toEqual([0, 0]);

      const result2 = convertCoordinate('45°30\'00.00" N 122°15\'00.00" W');
      expect(result2[0]).toBeCloseTo(45.5, 5); // 45.5 degrees latitude
      expect(result2[1]).toBeCloseTo(-122.25, 5); // -122.25 degrees longitude

      const result3 = convertCoordinate('30°15\'30.00" S 060°30\'45.00" E');
      expect(result3[0]).toBeCloseTo(-30.258333, 5); // negative for South
      expect(result3[1]).toBeCloseTo(60.5125, 5); // positive for East
    });

    it('should handle all cardinal directions correctly', () => {
      // North should be positive latitude
      const north = convertCoordinate('10°00\'00.00" N 000°00\'00.00" E');
      expect(north[0]).toBeGreaterThan(0);

      // South should be negative latitude
      const south = convertCoordinate('10°00\'00.00" S 000°00\'00.00" E');
      expect(south[0]).toBeLessThan(0);

      // East should be positive longitude
      const east = convertCoordinate('00°00\'00.00" N 010°00\'00.00" E');
      expect(east[1]).toBeGreaterThan(0);

      // West should be negative longitude
      const west = convertCoordinate('00°00\'00.00" N 010°00\'00.00" W');
      expect(west[1]).toBeLessThan(0);
    });

    it('should throw error for invalid coordinate format', () => {
      expect(() => convertCoordinate('invalid coordinate')).toThrow(
        'Invalid coordinate format',
      );
      expect(() => convertCoordinate('')).toThrow('Invalid coordinate format');
      expect(() =>
        convertCoordinate('91°00\'00.00" N 000°00\'00.00" E'),
      ).toThrow('Invalid coordinate format');
      expect(() =>
        convertCoordinate('00°60\'00.00" N 000°00\'00.00" E'),
      ).toThrow('Invalid coordinate format');
    });

    it('should handle edge cases that pass validation but fail parsing', () => {
      // This tests the second error condition where regex match fails
      // However, since our regex is comprehensive, this case might not occur
      // But we still test the error handling path

      // Valid format but test the internal error handling
      const validCoordinate = '45°30\'15.50" N 122°45\'30.75" W';
      const result = convertCoordinate(validCoordinate);
      expect(result).toHaveLength(2);
      expect(typeof result[0]).toBe('number');
      expect(typeof result[1]).toBe('number');

      // Test parsing edge cases - coordinates that might pass initial check but fail on parsing
      expect(() => convertCoordinate('N E')).toThrow(
        'Invalid coordinate format',
      );
      expect(() => convertCoordinate('° °')).toThrow(
        'Invalid coordinate format',
      );
    });

    it('should calculate precise decimal degrees', () => {
      // Test precise calculation with seconds
      const result = convertCoordinate('01°02\'03.60" N 004°05\'06.72" E');

      // 1 + 2/60 + 3.6/3600 = 1 + 0.0333... + 0.001 = 1.0343333...
      expect(result[0]).toBeCloseTo(1.0343333, 5);

      // 4 + 5/60 + 6.72/3600 = 4 + 0.0833... + 0.00186666... = 4.085199...
      expect(result[1]).toBeCloseTo(4.0852, 4); // Less precision due to floating point
    });
  });
});
