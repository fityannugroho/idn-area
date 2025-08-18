import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PaginatedReturn, PaginateInterceptor } from '../paginate.interceptor';

describe('PaginateInterceptor', () => {
  let interceptor: PaginateInterceptor<any>;
  let reflector: Reflector;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(() => {
    reflector = new Reflector();
    interceptor = new PaginateInterceptor(reflector);

    mockExecutionContext = {
      switchToHttp: vi.fn().mockReturnValue({
        getResponse: vi.fn().mockReturnValue({
          statusCode: 200,
        }),
      }),
      getHandler: vi.fn(),
    } as any;

    mockCallHandler = {
      handle: vi.fn(),
    } as any;
  });

  describe('transformValue', () => {
    it('should wrap pagination meta in pagination property', () => {
      const input: PaginatedReturn<any> = {
        data: [{ id: 1 }, { id: 2 }],
        meta: {
          total: 50,
          pages: {
            first: 1,
            last: 5,
            current: 2,
            previous: 1,
            next: 3,
          },
        },
      };

      const result = interceptor.transformValue(input);

      expect(result).toEqual({
        data: input.data,
        meta: {
          pagination: input.meta,
        },
      });
    });

    it('should handle pagination meta with null values', () => {
      const input: PaginatedReturn<any> = {
        data: [{ id: 1 }],
        meta: {
          total: 1,
          pages: {
            first: 1,
            last: 1,
            current: 1,
            previous: null,
            next: null,
          },
        },
      };

      const result = interceptor.transformValue(input);

      expect(result).toEqual({
        data: input.data,
        meta: {
          pagination: input.meta,
        },
      });
    });
  });

  describe('intercept', () => {
    it('should transform paginated response correctly', async () => {
      const responseData: PaginatedReturn<any> = {
        data: [{ id: 1 }, { id: 2 }, { id: 3 }],
        meta: {
          total: 25,
          pages: {
            first: 1,
            last: 3,
            current: 2,
            previous: 1,
            next: 3,
          },
        },
      };

      vi.spyOn(reflector, 'get').mockReturnValue('Paginated data retrieved');
      vi.spyOn(mockCallHandler, 'handle').mockReturnValue(of(responseData));

      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );
      const result = await result$.toPromise();

      expect(result).toEqual({
        statusCode: 200,
        message: 'Paginated data retrieved',
        data: responseData.data,
        meta: {
          total: 3, // This comes from array length
          pagination: responseData.meta,
        },
      });
    });

    it('should handle empty paginated response', async () => {
      const responseData: PaginatedReturn<any> = {
        data: [],
        meta: {
          total: 0,
          pages: {
            first: 1,
            last: 1,
            current: null,
            previous: null,
            next: null,
          },
        },
      };

      vi.spyOn(reflector, 'get').mockReturnValue('No data found');
      vi.spyOn(mockCallHandler, 'handle').mockReturnValue(of(responseData));

      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );
      const result = await result$.toPromise();

      expect(result).toEqual({
        statusCode: 200,
        message: 'No data found',
        data: [],
        meta: {
          total: 0,
          pagination: responseData.meta,
        },
      });
    });

    it('should use default message when none provided', async () => {
      const responseData: PaginatedReturn<any> = {
        data: [{ id: 1 }],
        meta: {
          total: 1,
          pages: {
            first: 1,
            last: 1,
            current: 1,
            previous: null,
            next: null,
          },
        },
      };

      vi.spyOn(reflector, 'get').mockReturnValue(undefined);
      vi.spyOn(mockCallHandler, 'handle').mockReturnValue(of(responseData));

      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );
      const result = await result$.toPromise();

      expect(result).toEqual({
        statusCode: 200,
        message: 'OK',
        data: responseData.data,
        meta: {
          total: 1,
          pagination: responseData.meta,
        },
      });
    });
  });
});
