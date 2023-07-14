import 'dotenv/config';

export type AppConfig = {
  /**
   * Get the app environment.
   * @default 'dev'
   */
  env: 'dev' | 'prod';
  host: string;
  port: number;
};

export const appConfig: AppConfig = {
  env: <AppConfig['env']>process.env.APP_ENV || 'dev',
  host: process.env.APP_HOST || '0.0.0.0',
  port: parseInt(process.env.APP_PORT) || 3000,
} as const;
