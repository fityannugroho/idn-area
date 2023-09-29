import { PaginationQuery } from '@/common/dto/pagination.dto';
import { SortOptions, SortService } from '@/sort/sort.service';
import { PaginatedReturn } from './interceptor/paginate.interceptor';

export type CommonData = Record<string, unknown> & {
  code: string;
  name: string;
};

export type FindOptions<T extends CommonData> = SortOptions<T> &
  PaginationQuery & {
    name?: string;
  };

export type CommonService<T extends CommonData> = {
  readonly sorter: SortService<T>;

  /**
   * If the name is empty, all data will be returned.
   * Otherwise, it will only return the data with the matching name.
   *
   * The result can also paginated by return an object with `data` and `meta` properties.
   */
  find(options: FindOptions<T>): Promise<T[] | PaginatedReturn<T>>;

  /**
   * Find a data by its code.
   *
   * @returns A data or `null`.
   */
  findByCode(code: string): Promise<T | null>;
};
