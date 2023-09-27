import {
  SetMetadata,
  Type,
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { TransformInterceptor } from '../interceptor/transform.interceptor';

interface Options<Model extends Type<any>> {
  /**
   * The model that will be used in the response.
   */
  model: Model;
  /**
   * Indicates if the response is an array or not.
   */
  multiple?: boolean;
  /**
   * The description of the response.
   * This will be used in the swagger documentation.
   */
  description?: string;
  /**
   * The message that will be returned in the response.
   *
   * @default 'OK'
   */
  message?: string | string[];
}

/**
 * This decorator will wrap the response into `data` property and add these properties:
 * - `statusCode` (number)
 * - `message` (string)
 * - `total` (number) (only if `multiple` is true)
 *
 * This decorator will also add `ApiExtraModels` and `ApiOkResponse` decorator
 * to generate the swagger documentation.
 */
export const ApiDataResponse = <Model extends Type<any>>(
  options: Options<Model>,
) => {
  return applyDecorators(
    SetMetadata('response_message', options.message),
    UseInterceptors(TransformInterceptor),
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
