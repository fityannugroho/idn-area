import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isDBProvider } from '../utils/db/provider';

export interface WrappedData<
  Data,
  Meta extends Record<string, unknown> = Record<string, unknown>,
> {
  data: Data;
  meta?: Meta;
}

export interface TransformedResponse<
  Data,
  Meta = WrappedData<unknown>['meta'],
> {
  statusCode: number;
  message: string | string[];
  data: Data;
  meta: Data extends any[] ? { total: number } & Meta : Meta | undefined;
}

/**
 * Check if the value contains `data` property.
 */
function isDataWrapped<T>(value: any): value is WrappedData<T> {
  return (
    'data' in value &&
    (typeof value.data === 'object' || Array.isArray(value.data))
  );
}

@Injectable()
export class TransformInterceptor<T, R extends TransformedResponse<T>>
  implements NestInterceptor<T, R>
{
  constructor(private reflector: Reflector) {}

  protected transformValue(val: any): WrappedData<T> {
    const res: WrappedData<T> = isDataWrapped<T>(val) ? val : { data: val };

    // Remove the `id` property from the data if the database provider is MongoDB.
    if (isDBProvider('mongodb')) {
      if (Array.isArray(res.data)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        res.data = res.data.map(({ id, ...item }) => ({
          id: undefined,
          ...item,
        })) as T;
      } else {
        delete (res.data as { id: string }).id;
      }
    }

    // Add the `total` property to the meta if the data is an array.
    if (Array.isArray(res.data)) {
      res.meta = {
        ...(res.meta ?? {}),
        total: res.data.length,
      };
    }

    return res;
  }

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<R> {
    const resMsg =
      this.reflector.get<string | string[]>(
        'response_message',
        context.getHandler(),
      ) || 'OK';

    return next.handle().pipe(
      map((res) => {
        const { data, meta } = this.transformValue(res);

        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: resMsg,
          data,
          meta,
        } as R;
      }),
    );
  }
}
