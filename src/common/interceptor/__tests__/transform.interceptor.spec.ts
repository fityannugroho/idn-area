import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TransformInterceptor, WrappedData } from '../transform.interceptor';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<any, any>;
  let reflector: Reflector;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(() => {
    reflector = new Reflector();
    interceptor = new TransformInterceptor(reflector);

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
    it('should wrap non-data objects in data property', () => {
      const input = { id: 1, name: 'test' };
      const result = interceptor.transformValue(input);

      expect(result).toEqual({ data: input });
    });

    it('should return wrapped data as-is if already wrapped', () => {
      const input: WrappedData<any> = {
        data: { id: 1, name: 'test' },
        meta: { page: 1 },
      };
      const result = interceptor.transformValue(input);

      expect(result).toEqual(input);
    });

    it('should wrap arrays in data property', () => {
      const input = [{ id: 1 }, { id: 2 }];
      const result = interceptor.transformValue(input);

      expect(result).toEqual({ data: input });
    });

    it('should wrap primitive values in data property', () => {
      const stringInput = 'test string';
      const numberInput = 42;
      const booleanInput = true;
      const nullInput = null;

      expect(interceptor.transformValue(stringInput)).toEqual({
        data: stringInput,
      });
      expect(interceptor.transformValue(numberInput)).toEqual({
        data: numberInput,
      });
      expect(interceptor.transformValue(booleanInput)).toEqual({
        data: booleanInput,
      });
      expect(interceptor.transformValue(nullInput)).toEqual({
        data: nullInput,
      });
    });
  });

  describe('intercept', () => {
    it('should transform response with default message', async () => {
      const responseData = { id: 1, name: 'test' };
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
        data: responseData,
        meta: {},
      });
    });

    it('should transform response with custom message', async () => {
      const responseData = { id: 1, name: 'test' };
      const customMessage = 'Custom success message';
      vi.spyOn(reflector, 'get').mockReturnValue(customMessage);
      vi.spyOn(mockCallHandler, 'handle').mockReturnValue(of(responseData));

      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );
      const result = await result$.toPromise();

      expect(result).toEqual({
        statusCode: 200,
        message: customMessage,
        data: responseData,
        meta: {},
      });
    });

    it('should add total count to meta for array responses', async () => {
      const responseData = [{ id: 1 }, { id: 2 }, { id: 3 }];
      vi.spyOn(reflector, 'get').mockReturnValue('Data retrieved');
      vi.spyOn(mockCallHandler, 'handle').mockReturnValue(of(responseData));

      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );
      const result = await result$.toPromise();

      expect(result).toEqual({
        statusCode: 200,
        message: 'Data retrieved',
        data: responseData,
        meta: { total: 3 },
      });
    });

    it('should preserve existing meta for array responses', async () => {
      const responseData: WrappedData<any[]> = {
        data: [{ id: 1 }, { id: 2 }],
        meta: { page: 1, limit: 10 },
      };
      vi.spyOn(reflector, 'get').mockReturnValue('Data retrieved');
      vi.spyOn(mockCallHandler, 'handle').mockReturnValue(of(responseData));

      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );
      const result = await result$.toPromise();

      expect(result).toEqual({
        statusCode: 200,
        message: 'Data retrieved',
        data: responseData.data,
        meta: { total: 2, page: 1, limit: 10 },
      });
    });

    it('should handle string array messages', async () => {
      const responseData = { id: 1 };
      const messageArray = ['Success', 'Data processed'];
      vi.spyOn(reflector, 'get').mockReturnValue(messageArray);
      vi.spyOn(mockCallHandler, 'handle').mockReturnValue(of(responseData));

      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );
      const result = await result$.toPromise();

      expect(result).toEqual({
        statusCode: 200,
        message: messageArray,
        data: responseData,
        meta: {},
      });
    });

    it('should use correct status code from response', async () => {
      const responseData = { id: 1 };
      const mockResponse = { statusCode: 201 };
      const mockSwitchToHttp = {
        getResponse: vi.fn().mockReturnValue(mockResponse),
      };
      mockExecutionContext.switchToHttp = vi
        .fn()
        .mockReturnValue(mockSwitchToHttp);

      vi.spyOn(reflector, 'get').mockReturnValue('Created');
      vi.spyOn(mockCallHandler, 'handle').mockReturnValue(of(responseData));

      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );
      const result = await result$.toPromise();

      expect(result).toEqual({
        statusCode: 201,
        message: 'Created',
        data: responseData,
        meta: {},
      });
    });

    it('should handle empty array responses', async () => {
      const responseData: any[] = [];
      vi.spyOn(reflector, 'get').mockReturnValue('Empty result');
      vi.spyOn(mockCallHandler, 'handle').mockReturnValue(of(responseData));

      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );
      const result = await result$.toPromise();

      expect(result).toEqual({
        statusCode: 200,
        message: 'Empty result',
        data: responseData,
        meta: { total: 0 },
      });
    });
  });
});
