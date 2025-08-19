import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type WrappedData<
  Data,
  Meta extends Record<string, unknown> = Record<string, unknown>,
> = {
  data: Data;
  meta?: Meta;
};

export type TransformedResponse<Data, Meta = WrappedData<unknown>['meta']> = {
  statusCode: number;
  message: string | string[];
  data: Data;
  meta: Data extends any[] ? { total: number } & Meta : Meta | undefined;
};

/**
 * Check if the value contains `data` property.
 */
function isDataWrapped<T>(value: any): value is WrappedData<T> {
  return (
    value != null &&
    typeof value === 'object' &&
    'data' in value &&
    (typeof value.data === 'object' || Array.isArray(value.data))
  );
}

@Injectable()
export class TransformInterceptor<T, R extends TransformedResponse<T>>
  implements NestInterceptor<T, R>
{
  constructor(private reflector: Reflector) {}

  /**
   * Transforms the response value.
   */
  transformValue(val: any): WrappedData<T> {
    return isDataWrapped<T>(val) ? val : { data: val };
  }

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<R> {
    const resMsg =
      this.reflector.get<string | string[]>(
        'response_message',
        context.getHandler(),
      ) || 'OK';

    return next.handle().pipe(
      map((res) => {
        const { data, meta = {} } = this.transformValue(res);

        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: resMsg,
          data,
          // Add the `total` property to the meta if the data is an array.
          meta: Array.isArray(data)
            ? { total: data.length, ...(meta ?? {}) }
            : meta,
        } as R;
      }),
    );
  }
}
