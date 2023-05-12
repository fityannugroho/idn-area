import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Checks if value does not contain any symbols. Whitespace is allowed.
 * @param validationOptions The validation options.
 */
export function IsNotSymbol(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsNotSymbolConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isNotSymbol' })
export class IsNotSymbolConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    const hasSymbolRegex = /[!-/:-@{-~!"^_`\[\]\\]/g;
    return typeof value === 'string' && !hasSymbolRegex.test(value);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} must not contain any symbols except whitespace.`;
  }
}
