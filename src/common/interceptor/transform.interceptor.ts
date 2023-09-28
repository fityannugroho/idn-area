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

export interface TransformedResponse<T> {
  statusCode: number;
  message: string | string[];
  data: T;
  total?: number;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, TransformedResponse<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<TransformedResponse<T>> {
    const resMsg =
      this.reflector.get<string | string[]>(
        'response_message',
        context.getHandler(),
      ) || 'OK';

    const unwrapResponse = this.reflector.get<boolean>(
      'unwrap_response',
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data) => {
        // Remove the `id` property from the data if the database provider is MongoDB.
        if (isDBProvider('mongodb')) {
          if (Array.isArray(data)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            data = data.map(({ id, ...item }) => ({ id: undefined, ...item }));
          } else {
            delete data.id;
          }
        }

        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: resMsg,
          ...(unwrapResponse && !Array.isArray(data) ? data : { data }),
          total: Array.isArray(data) ? data.length : undefined,
        };
      }),
    );
  }
}
