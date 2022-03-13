export interface SortOptions {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export class SortHelper {
  defaultOptions: SortOptions;

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
}
