import { isDBProvider } from '@common/utils/db/provider';

/**
 * All symbol characters.
 */
const symbols = '`~!@#$%^&*()_+-=[]{}|;:,.<>?/\\';

type GetEncodedSymbolsOptions = {
  /**
   * The symbol characters to exclude.
   */
  exclude?: string;
};

/**
 * Get encoded symbol characters.
 * @returns The encoded symbol characters.
 */
export function getEncodedSymbols(
  options: GetEncodedSymbolsOptions = {},
): string[] {
  const { exclude = '' } = options;

  return symbols
    .split('')
    .filter((char) => !exclude.includes(char))
    .map((char) => encodeURIComponent(char));
}

/**
 * Expect the data contains the `id` property if the database provider is MongoDB.
 */
export function expectIdFromMongo(data: Record<keyof any, any>) {
  return {
    ...data,
    id: isDBProvider('mongodb')
      ? expect.stringMatching(/^[0-9a-fA-F]{24}$/)
      : undefined,
  };
}
