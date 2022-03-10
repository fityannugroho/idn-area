/* eslint-disable @typescript-eslint/ban-types */
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Checks if value does not contain any symbols. Whitespace is allowed.
 * @param validationOptions The validation options.
 */
export function IsNotSymbol(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: Object.assign(
        {
          message: '$property must not contain any symbols except whitespace.',
        },
        validationOptions,
      ),
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
}
