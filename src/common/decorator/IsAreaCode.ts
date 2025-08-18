import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

type AreaType = 'province' | 'regency' | 'district' | 'village' | 'island';

type IsAreaCodeOptions = ApiPropertyOptions & {
  /** Validation options for class-validator */
  validation?: ValidationOptions;
};

/**
 * Custom validator for Indonesian area codes with dots format.
 * Validates format like: 11.01, 11.01.01, 11.01.01.2001, 11.01.40001
 *
 * This decorator also automatically adds Swagger metadata with type: 'string'
 */
export function IsAreaCode(areaType: AreaType, options?: IsAreaCodeOptions) {
  const { validation, ...apiPropertyOptions } = options || {};

  return applyDecorators(
    // Swagger metadata - automatically sets type as string
    ApiProperty({
      type: 'string',
      description: `The ${areaType} code`,
      ...apiPropertyOptions,
    }),
    // Validation logic
    (object: object, propertyName: string) => {
      registerDecorator({
        name: 'isAreaCode',
        target: object.constructor,
        propertyName: propertyName,
        constraints: [areaType],
        options: validation,
        validator: IsAreaCodeConstraint,
      });
    },
  );
}

@ValidatorConstraint({ name: 'isAreaCode' })
export class IsAreaCodeConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [areaType] = args.constraints;

    switch (areaType) {
      case 'province':
        // Format: xx (2 chars)
        return /^\d{2}$/.test(value);
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
        // Format: xx.xx.xxxxx (11 chars) - flexible island code format
        return /^\d{2}\.\d{2}\.\d{5}$/.test(value);
      default:
        return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const [areaType] = args.constraints;
    return `${args.property} must be a valid ${areaType} code`;
  }
}
