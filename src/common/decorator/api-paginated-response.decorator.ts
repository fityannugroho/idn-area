import {
  SetMetadata,
  Type,
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';
import { PaginateInterceptor } from '../interceptor/paginate.interceptor';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

type Options<Model extends Type<any>> = {
  /**
   * The model that will be used in the response.
   */
  model: Model;
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
 * This decorator will transform the response to a paginated response.
 *
 * Important: your method must return an object with `data` (array) and `meta` property
 * that contains pagination metadata (see `PaginatedReturn` type).
 *
 * The transformed response will have the following properties:
 * - `statusCode` (number)
 * - `message` (string)
 * - `data` (array)
 * - `meta` (object, optional)
 *    - `total` (number)
 *    - `pagination` (object)
 *       - `first` (string)
 *       - `last` (string)
 *       - `current` (string or null)
 *       - `previous` (string or null)
 *       - `next` (string or null)
 *
 * This decorator will also add `ApiExtraModels` and `ApiOkResponse` decorator
 * to generate the swagger documentation.
 */
export const ApiPaginatedResponse = <Model extends Type<any>>(
  options: Options<Model>,
) => {
  return applyDecorators(
    SetMetadata('response_message', options.message),
    UseInterceptors(PaginateInterceptor),
    ApiExtraModels(options.model),
    ApiOkResponse({
      description: options?.description,
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 200 },
          message: { type: 'string', example: 'OK' },
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(options.model) },
          },
          meta: {
            type: 'object',
            properties: {
              total: { type: 'number' },
              pagination: {
                type: 'object',
                properties: {
                  first: { type: 'string' },
                  last: { type: 'string' },
                  current: { type: 'string', nullable: true },
                  previous: { type: 'string', nullable: true },
                  next: { type: 'string', nullable: true },
                },
              },
            },
          },
        },
      },
    }),
  );
};
