import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

interface Options<Model extends Type<any>> {
  model: Model;
  multiple?: boolean;
  description?: string;
}

export const ApiDataResponse = <Model extends Type<any>>(
  options: Options<Model>,
) => {
  return applyDecorators(
    ApiExtraModels(options.model),
    ApiOkResponse({
      description: options?.description,
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 200 },
          message: { type: 'string', example: 'OK' },
          data: options.multiple
            ? {
                type: 'array',
                items: { $ref: getSchemaPath(options.model) },
              }
            : {
                type: 'object',
                $ref: getSchemaPath(options.model),
              },
          total: options.multiple
            ? { type: 'number', example: 1, nullable: true }
            : undefined,
        },
      },
    }),
  );
};
