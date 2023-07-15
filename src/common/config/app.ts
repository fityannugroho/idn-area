import 'dotenv/config';

export interface AppConfig {
  /**
   * Get the app environment.
   * @default 'dev'
   */
  env: 'dev' | 'prod';
  host: string;
  port: number;
}

export const appConfig: AppConfig = {
  env: (process.env.APP_ENV as AppConfig['env']) || 'dev',
  host: process.env.APP_HOST || '0.0.0.0',
  port: parseInt(process.env.APP_PORT) || 3000,
} as const;
