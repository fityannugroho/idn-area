import { ValidationArguments, validate } from 'class-validator';
import { IsNotSymbol, IsNotSymbolConstraint } from '../IsNotSymbol';

describe('IsNotSymbol Decorator', () => {
  describe('IsNotSymbolConstraint', () => {
    let constraint: IsNotSymbolConstraint;

    beforeEach(() => {
      constraint = new IsNotSymbolConstraint();
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
      it('should return true for strings without symbols', () => {
        const args = createValidationArgs(['']);

        expect(constraint.validate('Hello World', args)).toBe(true);
        expect(constraint.validate('abc123', args)).toBe(true);
        expect(constraint.validate('Test 123', args)).toBe(true);
        expect(constraint.validate('', args)).toBe(true);
        expect(constraint.validate('   ', args)).toBe(true); // whitespace allowed
      });

      it('should return false for strings with symbols', () => {
        const args = createValidationArgs(['']);

        expect(constraint.validate('Hello@World', args)).toBe(false);
        expect(constraint.validate('test!', args)).toBe(false);
        expect(constraint.validate('a#b$c%', args)).toBe(false);
        expect(constraint.validate('user@domain.com', args)).toBe(false);
      });

      it('should allow specified symbols', () => {
        const args = createValidationArgs(['-_.']);

        expect(constraint.validate('test-value', args)).toBe(true);
        expect(constraint.validate('user_name', args)).toBe(true);
        expect(constraint.validate('file.txt', args)).toBe(true);
        expect(constraint.validate('some-file_name.ext', args)).toBe(true);
      });

      it('should reject non-allowed symbols even with allowed symbols specified', () => {
        const args = createValidationArgs(['-_.']);

        expect(constraint.validate('test@value', args)).toBe(false);
        expect(constraint.validate('user#name', args)).toBe(false);
        expect(constraint.validate('file.txt!', args)).toBe(false);
      });

      it('should return false for non-string values', () => {
        const args = createValidationArgs(['']);

        expect(constraint.validate(123, args)).toBe(false);
        expect(constraint.validate(null, args)).toBe(false);
        expect(constraint.validate(undefined, args)).toBe(false);
        expect(constraint.validate([], args)).toBe(false);
        expect(constraint.validate({}, args)).toBe(false);
      });

      it('should handle special regex characters in allowed symbols', () => {
        const args = createValidationArgs(['[](){}^$+*?|.']);

        expect(constraint.validate('test[bracket]', args)).toBe(true);
        expect(constraint.validate('func(param)', args)).toBe(true);
        expect(constraint.validate('obj{key}', args)).toBe(true);
        expect(constraint.validate('start^end', args)).toBe(true);
        expect(constraint.validate('cost$5', args)).toBe(true);
        expect(constraint.validate('one+two', args)).toBe(true);
        expect(constraint.validate('repeat*', args)).toBe(true);
        expect(constraint.validate('maybe?', args)).toBe(true);
        expect(constraint.validate('a|b', args)).toBe(true);
        expect(constraint.validate('file.ext', args)).toBe(true);
      });

      it('should handle missing or undefined constraints', () => {
        expect(constraint.validate('Hello World')).toBe(true);
        expect(constraint.validate('Hello@World')).toBe(false);
        expect(constraint.validate('test', createValidationArgs())).toBe(true);
      });
    });

    describe('defaultMessage', () => {
      it('should return message without allowed symbols', () => {
        const args = createValidationArgs(['']);
        args.property = 'username';

        const message = constraint.defaultMessage(args);
        expect(message).toBe('username must not contain any symbols');
      });

      it('should return message with allowed symbols', () => {
        const args = createValidationArgs(['-_.']);
        args.property = 'filename';

        const message = constraint.defaultMessage(args);
        expect(message).toBe(
          'filename must not contain any symbols, except for the -_. characters',
        );
      });

      it('should handle missing constraints', () => {
        const args = createValidationArgs();
        args.property = 'field';

        const message = constraint.defaultMessage(args);
        expect(message).toBe('field must not contain any symbols');
      });
    });
  });

  describe('IsNotSymbol decorator integration', () => {
    it('should validate class with IsNotSymbol decorator (no allowed symbols)', async () => {
      class TestClass {
        @IsNotSymbol()
        username: string;

        constructor(username: string) {
          this.username = username;
        }
      }

      // Valid values
      const validInstance = new TestClass('john123');
      const validErrors = await validate(validInstance);
      expect(validErrors).toHaveLength(0);

      // Invalid values
      const invalidInstance = new TestClass('john@123');
      const invalidErrors = await validate(invalidInstance);
      expect(invalidErrors).toHaveLength(1);
      expect(invalidErrors[0].constraints?.isNotSymbol).toBe(
        'username must not contain any symbols',
      );
    });

    it('should validate class with IsNotSymbol decorator (with allowed symbols)', async () => {
      class TestClass {
        @IsNotSymbol('-_.')
        filename: string;

        constructor(filename: string) {
          this.filename = filename;
        }
      }

      // Valid values
      const validInstance = new TestClass('my-file_name.txt');
      const validErrors = await validate(validInstance);
      expect(validErrors).toHaveLength(0);

      // Invalid values
      const invalidInstance = new TestClass('my-file@name.txt');
      const invalidErrors = await validate(invalidInstance);
      expect(invalidErrors).toHaveLength(1);
      expect(invalidErrors[0].constraints?.isNotSymbol).toBe(
        'filename must not contain any symbols, except for the -_. characters',
      );
    });

    it('should work with custom validation message', async () => {
      class TestClass {
        @IsNotSymbol('-_', {
          message: 'Only letters, numbers, hyphens and underscores are allowed',
        })
        slug: string;

        constructor(slug: string) {
          this.slug = slug;
        }
      }

      const instance = new TestClass('my-slug@invalid');
      const errors = await validate(instance);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNotSymbol).toBe(
        'Only letters, numbers, hyphens and underscores are allowed',
      );
    });

    it('should allow whitespace characters', async () => {
      class TestClass {
        @IsNotSymbol()
        text: string;

        constructor(text: string) {
          this.text = text;
        }
      }

      const instance = new TestClass('Hello World 123');
      const errors = await validate(instance);
      expect(errors).toHaveLength(0);
    });

    it('should handle empty strings', async () => {
      class TestClass {
        @IsNotSymbol()
        text: string;

        constructor(text: string) {
          this.text = text;
        }
      }

      const instance = new TestClass('');
      const errors = await validate(instance);
      expect(errors).toHaveLength(0);
    });
  });
});
