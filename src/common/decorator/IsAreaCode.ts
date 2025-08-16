import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

/**
 * Custom validator for Indonesian area codes with dots format.
 * Validates format like: 11.01, 11.01.01, 11.01.01.2001, 11.01.40001
 */
export function IsAreaCode(
  areaType: 'regency' | 'district' | 'village' | 'island',
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isAreaCode',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') {
            return false;
          }

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
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid ${areaType} code`;
        },
      },
    });
  };
}
