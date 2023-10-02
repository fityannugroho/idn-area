import { Injectable } from '@nestjs/common';
import { isDBProvider } from '../utils/db/provider';
import {
  TransformInterceptor,
  TransformedResponse,
  WrappedData,
} from './transform.interceptor';

// See issue: https://stackoverflow.com/questions/69462870/how-to-replace-object-with-recordstring-unknown
export type PaginationMeta = {
  total: number;
  pages: {
    first: number;
    last: number;
    current: number | null;
    previous: number | null;
    next: number | null;
  };
};

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
