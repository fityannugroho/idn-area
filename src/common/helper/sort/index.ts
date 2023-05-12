import { IsOptional, IsString } from 'class-validator';
import { EqualsAny } from '../../decorator/EqualsAny';

export type SortOptions<T extends string = string> = {
  sortBy?: T;
  sortOrder?: 'asc' | 'desc';
};

/**
 * The validator class for the sort query.
 *
 * You may need to inherit this class and use `@EqualsAny()` decorator
 * for `sortBy` property to accept only specific values.
 */
export class SortQuery<T extends string = string> implements SortOptions<T> {
  @IsOptional()
  @IsString()
  sortBy?: T;

  @IsOptional()
  @EqualsAny(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}

export class SortHelper<T extends string = string> {
  defaultOptions: Required<SortOptions<T>>;

  /**
   * Create a new instance of SortHelper.
   * @param defaultOptions The default options
   */
  constructor(defaultOptions: Required<SortOptions<T>>) {
    this.defaultOptions = defaultOptions;
  }

  /**
   * Generate sort query string. Minus `-` sign means descending order.
   *
   * For example: `-code` means sort by "code" field in descending order.
   * @param options The sort options. If `null`, the default options will be used.
   * @returns The sort query string.
   */
  query(options?: SortOptions<T>): string {
    const {
      sortBy = this.defaultOptions.sortBy,
      sortOrder = this.defaultOptions.sortOrder,
    } = options ?? this.defaultOptions;

    return `${sortOrder === 'desc' ? '-' : ''}${sortBy}`;
  }

  /**
   * Generate sort query object.
   *
   * For example: `{ code: 'desc' }` means sort by "code" field in descending order.
   * @param options The sort options. If `null`, the default options will be used.
   * @returns The sort query object.
   */
  object(options?: SortOptions<T>): Record<string, 'asc' | 'desc'> {
    const {
      sortBy = this.defaultOptions.sortBy,
      sortOrder = this.defaultOptions.sortOrder,
    } = options ?? this.defaultOptions;

    return {
      [sortBy]: sortOrder,
    };
  }
}
