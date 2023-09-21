import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string | string[];
  data: T;
  total?: number;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
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
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: resMsg,
        ...(unwrapResponse && !Array.isArray(data) ? data : { data }),
        total: Array.isArray(data) ? data.length : undefined,
      })),
    );
  }
}
