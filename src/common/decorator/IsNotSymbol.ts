import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Checks if value does not contain any symbols. Whitespace is allowed.
 * @param allowedSymbols The allowed symbols in a string.
 * Each character is treated as a separate symbol.
 * For example, `'-\/"` will allow the `-`, `\`,  `/`, and `"` characters.
 * @param validationOptions The validation options.
 */
export function IsNotSymbol(
  allowedSymbols?: string,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
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
    const [allowedSymbols = ''] = (args?.constraints ?? []) as [string, any];
    const safeAllowedSymbols = allowedSymbols
      .split('')
      .map((s) => `\\${s}`)
      .join('');
    const symbolRegex = new RegExp(`[^a-zA-Z0-9\\s${safeAllowedSymbols}]`, 'g');

    return typeof value === 'string' && !symbolRegex.test(value);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const { constraints, property } = validationArguments ?? {};
    const [allowedSymbols = ''] = constraints as [string, any];

    return allowedSymbols
      ? `${property} must not contain any symbols, except for the ${allowedSymbols} characters`
      : `${property} must not contain any symbols`;
  }
}
