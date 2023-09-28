import { Injectable } from '@nestjs/common';
import { isDBProvider } from '../utils/db/provider';
import {
  TransformInterceptor,
  TransformedResponse,
  WrappedData,
} from './transform.interceptor';

export interface PaginationMeta extends Record<string, unknown> {
  current: string;
  first: string;
  last: string;
  previous: string | null;
  next: string | null;
}

export type PaginatedReturn<T> = WrappedData<T[], PaginationMeta>;

export type PaginatedResponse<T> = TransformedResponse<T[], PaginationMeta>;

@Injectable()
export class PaginateInterceptor<T> extends TransformInterceptor<
  T[],
  PaginatedResponse<T>
> {
  protected transformValue({ data, meta }: PaginatedReturn<T>) {
    // Remove the `id` property from the data if the database provider is MongoDB.
    if (isDBProvider('mongodb')) {
      data = (data as any[]).map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ id, ...item }) => ({ id: undefined, ...item }) as T,
      );
    }

    return { data, meta: { pagination: meta } };
  }
}
