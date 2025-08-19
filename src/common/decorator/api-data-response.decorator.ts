import {
  applyDecorators,
  SetMetadata,
  Type,
  UseInterceptors,
} from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { TransformInterceptor } from '../interceptor/transform.interceptor';

type Options<Model extends Type<any>> = {
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
};

/**
 * This decorator will wrap the response into `data` property.
 *
 * To add additional metadata, your method must return an object with `data` and `meta` property
 * (see the `WrappedData` interface)
 *
 * The transformed response will have the following properties:
 * - `statusCode` (number)
 * - `message` (string)
 * - `data` (object or array)
 * - `meta` (object, optional)
 *    - `total` (number, if the `data` is an array)
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
            : { $ref: getSchemaPath(options.model) },
          meta: {
            type: 'object',
            properties: {
              ...(options.multiple && {
                total: {
                  type: 'number',
                  example: 1,
                },
              }),
            },
          },
        },
      },
    }),
  );
};
