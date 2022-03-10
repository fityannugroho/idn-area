/* eslint-disable @typescript-eslint/ban-types */
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Checks if value is equals with one of the valid values.
 * @param validValues The values for comparison.
 * @param validationOptions The validation options.
 */
export function EqualsAny(
  validValues: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [validValues],
      options: Object.assign(
        { message: '$property must equals one of these: $constraint1' },
        validationOptions,
      ),
      validator: EqualsAnyConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'equalsAny' })
export class EqualsAnyConstraint implements ValidatorConstraintInterface {
  validate(value: any, args?: ValidationArguments): boolean {
    const [validValues] = args.constraints as [string[], any];
    return typeof value === 'string' && validValues.includes(value);
  }
}
