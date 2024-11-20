import 'dotenv/config';

export const dbConfig = {
  provider: process.env.DB_PROVIDER,
  url: process.env.DB_URL,
} as const;
