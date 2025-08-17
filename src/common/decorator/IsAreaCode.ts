import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

type AreaType = 'regency' | 'district' | 'village' | 'island';

/**
 * Custom validator for Indonesian area codes with dots format.
 * Validates format like: 11.01, 11.01.01, 11.01.01.2001, 11.01.40001
 */
export function IsAreaCode(
  areaType: AreaType,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isAreaCode',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [areaType],
      options: validationOptions,
      validator: IsAreaCodeConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isAreaCode' })
export class IsAreaCodeConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [areaType] = args.constraints;

    switch (areaType) {
      case 'regency':
        // Format: xx.xx (5 chars)
        return /^\d{2}\.\d{2}$/.test(value);
      case 'district':
        // Format: xx.xx.xx (8 chars)
        return /^\d{2}\.\d{2}\.\d{2}$/.test(value);
      case 'village':
        // Format: xx.xx.xx.xxxx (13 chars)
        return /^\d{2}\.\d{2}\.\d{2}\.\d{4}$/.test(value);
      case 'island':
        // Format: xx.xx.4xxxx (11 chars)
        return /^\d{2}\.\d{2}\.4\d{4}$/.test(value);
      default:
        return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const [areaType] = args.constraints;
    return `${args.property} must be a valid ${areaType} code`;
  }
}
