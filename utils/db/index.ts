import { DatabaseConfigError } from './errors';
import { DBProviderFeatures, dbConfig, dbProviderConfig } from './config';

/**
 * Validate all database config values.
 *
 * @throws If there are any invalid config value.
 */
export const validateDBConfig = () => {
  if (!dbConfig.provider) {
    throw new DatabaseConfigError('`DB_PROVIDER` is not defined.');
  }

  if (!dbConfig.url) {
    throw new DatabaseConfigError('`DB_URL` is not defined.');
  }

  if (!dbProviderConfig[dbConfig.provider]) {
    throw new DatabaseConfigError(`\`DB_PROVIDER\` is not supported.`);
  }

  if (
    !dbProviderConfig[dbConfig.provider].urlConnectionRegex.test(dbConfig.url)
  ) {
    throw new DatabaseConfigError(
      `\`DB_URL\` is not valid for \`DB_PROVIDER\` '${dbConfig.provider}'.`,
    );
  }
};

/**
 * Get the database provider features, based on the current config.
 */
export const getDBProviderFeatures = (): DBProviderFeatures | undefined => {
  return dbProviderConfig[dbConfig.provider]?.features;
};
