import { ValidationArguments, validate } from 'class-validator';
import { EqualsAny, EqualsAnyConstraint } from '../EqualsAny';

describe('EqualsAny Decorator', () => {
  describe('EqualsAnyConstraint', () => {
    let constraint: EqualsAnyConstraint;

    beforeEach(() => {
      constraint = new EqualsAnyConstraint();
    });

    const createValidationArgs = (
      constraints: any[] = [],
    ): ValidationArguments => ({
      constraints,
      value: '',
      targetName: 'TestClass',
      object: {},
      property: 'testProperty',
    });

    describe('validate', () => {
      it('should return true for valid string value', () => {
        const args = createValidationArgs([['apple', 'banana', 'orange']]);

        expect(constraint.validate('apple', args)).toBe(true);
        expect(constraint.validate('banana', args)).toBe(true);
        expect(constraint.validate('orange', args)).toBe(true);
      });

      it('should return false for invalid string value', () => {
        const args = createValidationArgs([['apple', 'banana', 'orange']]);

        expect(constraint.validate('grape', args)).toBe(false);
        expect(constraint.validate('mango', args)).toBe(false);
      });

      it('should return false for non-string values', () => {
        const args = createValidationArgs([['apple', 'banana', 'orange']]);

        expect(constraint.validate(123, args)).toBe(false);
        expect(constraint.validate(null, args)).toBe(false);
        expect(constraint.validate(undefined, args)).toBe(false);
        expect(constraint.validate([], args)).toBe(false);
        expect(constraint.validate({}, args)).toBe(false);
      });

      it('should return false when empty constraints array', () => {
        const args = createValidationArgs([[]]);

        expect(constraint.validate('apple', args)).toBe(false);
      });
    });

    describe('defaultMessage', () => {
      it('should return proper error message with constraints', () => {
        const args = createValidationArgs([['apple', 'banana', 'orange']]);
        args.property = 'fruit';

        const message = constraint.defaultMessage(args);
        expect(message).toBe(
          'fruit must equals one of these: apple, banana, orange.',
        );
      });

      it('should handle empty constraints array', () => {
        const args = createValidationArgs([[]]);
        args.property = 'fruit';

        const message = constraint.defaultMessage(args);
        expect(message).toBe('fruit must equals one of these: .');
      });

      it('should handle missing constraints', () => {
        const args = createValidationArgs();
        args.property = 'fruit';

        const message = constraint.defaultMessage(args);
        expect(message).toBe('fruit must equals one of these: .');
      });

      it('should handle no validation arguments', () => {
        const message = constraint.defaultMessage();
        expect(message).toBe('undefined must equals one of these: .');
      });
    });
  });

  describe('EqualsAny decorator integration', () => {
    it('should validate class with EqualsAny decorator', async () => {
      class TestClass {
        @EqualsAny(['red', 'green', 'blue'])
        color: string;

        constructor(color: string) {
          this.color = color;
        }
      }

      // Valid values
      const validInstance = new TestClass('red');
      const validErrors = await validate(validInstance);
      expect(validErrors).toHaveLength(0);

      // Invalid values
      const invalidInstance = new TestClass('yellow');
      const invalidErrors = await validate(invalidInstance);
      expect(invalidErrors).toHaveLength(1);
      expect(invalidErrors[0].constraints?.equalsAny).toBeDefined();
    });

    it('should work with custom validation message', async () => {
      class TestClass {
        @EqualsAny(['small', 'medium', 'large'], {
          message: 'Size must be small, medium, or large',
        })
        size: string;

        constructor(size: string) {
          this.size = size;
        }
      }

      const instance = new TestClass('extra-large');
      const errors = await validate(instance);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.equalsAny).toBe(
        'Size must be small, medium, or large',
      );
    });
  });
});
