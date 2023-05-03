export interface SortOptions {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export class SortHelper {
  defaultOptions: SortOptions;

  /**
   * Create a new instance of SortHelper.
   * @param defaultOptions The default options
   */
  constructor(defaultOptions: SortOptions) {
    this.defaultOptions = defaultOptions;
  }

  /**
   * Generate sort query string. Minus `-` sign means descending order.
   *
   * For example: `-code` means sort by "code" field in descending order.
   * @param options The sort options. If `null`, the default options will be used.
   * @returns The sort query string.
   */
  query(options?: SortOptions): string {
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
  object(options?: SortOptions): Record<string, 'asc' | 'desc'> {
    const {
      sortBy = this.defaultOptions.sortBy,
      sortOrder = this.defaultOptions.sortOrder,
    } = options ?? this.defaultOptions;

    return {
      [sortBy]: sortOrder,
    };
  }
}
