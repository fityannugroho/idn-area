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
