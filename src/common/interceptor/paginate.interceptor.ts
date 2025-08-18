import { Injectable } from '@nestjs/common';
import {
  TransformedResponse,
  TransformInterceptor,
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
  transformValue({ data, meta }: PaginatedReturn<T>) {
    return { data, meta: { pagination: meta } };
  }
}
