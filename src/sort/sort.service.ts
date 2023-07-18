export interface SortOptions<T extends Record<string, unknown>> {
  sortBy?: keyof T;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Service to use `sortBy` and `sortOrder` query params.
 */
export class SortService<T extends Record<string, unknown>> {
  defaultOptions: Required<SortOptions<T>>;

  /**
   * Create a new instance of SortHelper.
   * @param defaultOptions The default options
   */
  constructor(defaultOptions: Required<SortOptions<T>>) {
    this.defaultOptions = defaultOptions;
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
