import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Checks if value does not contain any symbols. Whitespace is allowed.
 * @param allowedSymbols The allowed symbols in a string. For example: '!@#$%^'
 * @param validationOptions The validation options.
 */
export function IsNotSymbol(
  allowedSymbols?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [allowedSymbols],
      options: validationOptions,
      validator: IsNotSymbolConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isNotSymbol' })
export class IsNotSymbolConstraint implements ValidatorConstraintInterface {
  validate(value: any, args?: ValidationArguments): boolean {
    const [allowedSymbols = ''] = args.constraints as [string, any];
    const symbolRegex = new RegExp(`[^\\w\\s${allowedSymbols}]`, 'g');

    return typeof value === 'string' && !symbolRegex.test(value);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const { constraints, property } = validationArguments;
    const [allowedSymbols = ''] = constraints as [string, any];

    return allowedSymbols
      ? `${property} must not contain any symbols except this: ${allowedSymbols}`
      : `${property} must not contain any symbols`;
  }
}
