import { dbConfig } from '@/common/config/db';
import { DatabaseConfigError } from './errors';
import { DBProviderFeatures, dbProviderConfig } from './provider';

/**
 * Validate all (or specific) database config value(s).
 *
 * Since `DB_PROVIDER` is required, it will always be validated.
 *
 * @param vars The database config value(s) to validate. If not provided, all database config values will be validated.
 *
 * @throws If there are any invalid config value.
 */
export const validateDBConfig = (...vars: (keyof typeof dbConfig)[]) => {
  const configVars =
    vars.length === 0
      ? (Object.keys(dbConfig) as (keyof typeof dbConfig)[])
      : vars;

  if (!dbConfig.provider) {
    throw new DatabaseConfigError('`DB_PROVIDER` is not defined.');
  }

  if (!dbProviderConfig[dbConfig.provider]) {
    throw new DatabaseConfigError('`DB_PROVIDER` is not supported.');
  }

  if (configVars.includes('url')) {
    if (!dbConfig.url) {
      throw new DatabaseConfigError('`DB_URL` is not defined.');
    }
  }
};

/**
 * Get the database provider features, based on the current config.
 */
export const getDBProviderFeatures = (): DBProviderFeatures | undefined => {
  if (!dbConfig.provider) {
    return undefined;
  }

  return dbProviderConfig[dbConfig.provider]?.features;
};
