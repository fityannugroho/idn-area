import 'dotenv/config';

export type AppConfig = {
  /**
   * Get the app environment.
   * @default 'dev'
   */
  env: 'dev' | 'prod';
  host: string;
  port: number;
  pagination: {
    /**
     * Get the maximum page size (number of items per page).
     *
     * @default 100
     */
    maxPageSize: number;
    /**
     * Get the default page size (number of items per page).
     *
     * @default 10
     */
    defaultPageSize: number;
  };
};

export const appConfig: AppConfig = {
  env: (process.env.APP_ENV as AppConfig['env']) || 'dev',
  host: process.env.APP_HOST || '0.0.0.0',
  port: Number.parseInt(process.env.APP_PORT || '3000', 10),
  pagination: {
    maxPageSize: Number.parseInt(
      process.env.APP_PAGINATION_MAX_PAGE_SIZE || '100',
      10,
    ),
    defaultPageSize: Number.parseInt(
      process.env.APP_PAGINATION_DEFAULT_PAGE_SIZE || '10',
      10,
    ),
  },
} as const;
