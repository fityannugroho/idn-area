import {
  SetMetadata,
  Type,
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginateInterceptor } from '../interceptor/paginate.interceptor';

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
 *       - `total` (number)
 *       - `pages` (object)
 *         - `first` (number)
 *         - `last` (number)
 *         - `current` (number or null)
 *         - `previous` (number or null)
 *         - `next` (number or null)
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
              total: { type: 'number', description: 'The total data returned' },
              pagination: {
                type: 'object',
                properties: {
                  total: {
                    type: 'number',
                    description: 'The total data that match the query',
                  },
                  pages: {
                    type: 'object',
                    properties: {
                      first: { type: 'number', description: 'The first page' },
                      last: { type: 'number', description: 'The last page' },
                      current: {
                        type: 'number',
                        nullable: true,
                        description: 'The current page',
                      },
                      previous: {
                        type: 'number',
                        nullable: true,
                        description: 'The previous page',
                      },
                      next: {
                        type: 'number',
                        nullable: true,
                        description: 'The next page',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
  );
};
