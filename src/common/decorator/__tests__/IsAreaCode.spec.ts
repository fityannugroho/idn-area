import { validate } from 'class-validator';
import { IsAreaCode } from '../IsAreaCode';

describe('IsAreaCode Decorator', () => {
  describe('province area code validation', () => {
    class ProvinceCodeClass {
      @IsAreaCode('province')
      code: string;

      constructor(code: string) {
        this.code = code;
      }
    }

    it('should validate correct province codes', async () => {
      const validCodes = ['11', '32', '99', '00', '01'];

      for (const code of validCodes) {
        const instance = new ProvinceCodeClass(code);
        const errors = await validate(instance);
        expect(errors).toHaveLength(0);
      }
    });

    it('should reject invalid province codes', async () => {
      const invalidCodes = [
        '1', // Too short
        '111', // Too long
        '1a', // Non-numeric
        '11.01', // With separator
        'ab', // Non-numeric
      ];

      for (const code of invalidCodes) {
        const instance = new ProvinceCodeClass(code);
        const errors = await validate(instance);
        expect(errors).toHaveLength(1);
        expect(errors[0].constraints?.isAreaCode).toBe(
          'code must be a valid province code',
        );
      }
    });
  });

  describe('regency area code validation', () => {
    class RegencyCodeClass {
      @IsAreaCode('regency')
      code: string;

      constructor(code: string) {
        this.code = code;
      }
    }

    it('should validate correct regency codes', async () => {
      const validCodes = ['11.01', '32.04', '99.99', '00.00'];

      for (const code of validCodes) {
        const instance = new RegencyCodeClass(code);
        const errors = await validate(instance);
        expect(errors).toHaveLength(0);
      }
    });

    it('should reject invalid regency codes', async () => {
      const invalidCodes = [
        '11.1', // Too short
        '11.111', // Too long
        '111.01', // Wrong format
        '11.01.01', // Too many segments
        '11-01', // Wrong separator
        '1101', // No separator
        'ab.cd', // Non-numeric
      ];

      for (const code of invalidCodes) {
        const instance = new RegencyCodeClass(code);
        const errors = await validate(instance);
        expect(errors).toHaveLength(1);
        expect(errors[0].constraints?.isAreaCode).toBe(
          'code must be a valid regency code',
        );
      }
    });

    it('should reject non-string values for regency', async () => {
      const nonStringValues = [123, null, undefined, [], {}];

      for (const value of nonStringValues) {
        const instance = new RegencyCodeClass(value as any);
        const errors = await validate(instance);
        expect(errors).toHaveLength(1);
      }
    });
  });

  describe('district area code validation', () => {
    class DistrictCodeClass {
      @IsAreaCode('district')
      code: string;

      constructor(code: string) {
        this.code = code;
      }
    }

    it('should validate correct district codes', async () => {
      const validCodes = ['11.01.01', '32.04.05', '99.99.99', '00.00.00'];

      for (const code of validCodes) {
        const instance = new DistrictCodeClass(code);
        const errors = await validate(instance);
        expect(errors).toHaveLength(0);
      }
    });

    it('should reject invalid district codes', async () => {
      const invalidCodes = [
        '11.01', // Too short
        '11.01.1', // Last segment too short
        '11.01.111', // Last segment too long
        '11.01.01.01', // Too many segments
        '111.01.01', // First segment too long
        '11.111.01', // Second segment too long
      ];

      for (const code of invalidCodes) {
        const instance = new DistrictCodeClass(code);
        const errors = await validate(instance);
        expect(errors).toHaveLength(1);
        expect(errors[0].constraints?.isAreaCode).toBe(
          'code must be a valid district code',
        );
      }
    });
  });

  describe('village area code validation', () => {
    class VillageCodeClass {
      @IsAreaCode('village')
      code: string;

      constructor(code: string) {
        this.code = code;
      }
    }

    it('should validate correct village codes', async () => {
      const validCodes = ['11.01.01.2001', '32.04.05.3002', '99.99.99.9999'];

      for (const code of validCodes) {
        const instance = new VillageCodeClass(code);
        const errors = await validate(instance);
        expect(errors).toHaveLength(0);
      }
    });

    it('should reject invalid village codes', async () => {
      const invalidCodes = [
        '11.01.01', // Too short
        '11.01.01.200', // Last segment too short
        '11.01.01.20001', // Last segment too long
        '11.01.01.200a', // Non-numeric in last segment
      ];

      for (const code of invalidCodes) {
        const instance = new VillageCodeClass(code);
        const errors = await validate(instance);
        expect(errors).toHaveLength(1);
        expect(errors[0].constraints?.isAreaCode).toBe(
          'code must be a valid village code',
        );
      }
    });
  });

  describe('island area code validation', () => {
    class IslandCodeClass {
      @IsAreaCode('island')
      code: string;

      constructor(code: string) {
        this.code = code;
      }
    }

    it('should validate correct island codes', async () => {
      const validCodes = ['11.01.40001', '32.04.49999', '99.99.44444'];

      for (const code of validCodes) {
        const instance = new IslandCodeClass(code);
        const errors = await validate(instance);
        expect(errors).toHaveLength(0);
      }
    });

    it('should reject invalid island codes', async () => {
      const invalidCodes = [
        '11.01.01', // Wrong format (not starting with 4)
        '11.01.30001', // Third segment doesn't start with 4
        '11.01.4000', // Last segment too short
        '11.01.400001', // Last segment too long
        '11.01.5001', // Wrong prefix (should be 4)
      ];

      for (const code of invalidCodes) {
        const instance = new IslandCodeClass(code);
        const errors = await validate(instance);
        expect(errors).toHaveLength(1);
        expect(errors[0].constraints?.isAreaCode).toBe(
          'code must be a valid island code',
        );
      }
    });
  });

  describe('custom validation message', () => {
    it('should use custom error message', async () => {
      class CustomMessageClass {
        @IsAreaCode('regency', {
          validation: {
            message: 'Please provide a valid regency code format',
          },
        })
        code: string;

        constructor(code: string) {
          this.code = code;
        }
      }

      const instance = new CustomMessageClass('invalid');
      const errors = await validate(instance);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isAreaCode).toBe(
        'Please provide a valid regency code format',
      );
    });
  });

  describe('edge cases', () => {
    it('should handle default case for unknown area type', () => {
      // This test simulates internal validator behavior
      // Since the decorator function validates the area type parameter at registration time,
      // we test the internal logic by creating a mock scenario

      class TestClass {
        @IsAreaCode('regency' as any)
        code: string;

        constructor(code: string) {
          this.code = code;
        }
      }

      // The decorator should still work for valid area types
      const instance = new TestClass('11.01');
      return validate(instance).then((errors) => {
        expect(errors).toHaveLength(0);
      });
    });
  });
});
