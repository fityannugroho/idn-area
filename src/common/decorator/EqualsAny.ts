import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
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
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [validValues],
      options: validationOptions,
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

  defaultMessage(validationArguments?: ValidationArguments): string {
    const { constraints, property } = validationArguments;
    return `${property} must equals one of these: ${(
      constraints[0] as string[]
    ).join(', ')}.`;
  }
}
