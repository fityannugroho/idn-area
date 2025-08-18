/**
 * Check if the coordinate has valid DMS (degrees minutes seconds) format.
 *
 * Valid DMS format: `{a}°{b}'{c}" {y} {d}°{e}'{f}" {x}`
 * - `{a}` should be 2 digit integer from 00 to 90
 * - `{b}` should be 2 digit integer from 00 to 59
 * - `{c}` should be 2 digit integer with 2 decimal points from 00.00 to 59.99
 * - `{y}` should be N or S
 * - `{d}` should be 3 digit integer from 000 to 180
 * - `{e}` should be 2 digit integer from 00 to 59
 * - `{f}` should be 2 digit integer with 2 decimal points from 00.00 to 59.99
 * - `{x}` should be E or W
 *
 * Tested here: https://regex101.com/r/GQe8WT
 */
export const isValidCoordinate = (coordinate: string) => {
  const regex =
    /^([0-8][0-9]|90)°([0-5][0-9])'([0-5][0-9]\.[0-9]{2})"\s(N|S)\s(0[0-9]{2}|1([0-7][0-9]|80))°([0-5][0-9])'([0-5][0-9]\.[0-9]{2})"\s(E|W)$/;

  return regex.test(coordinate);
};

const calculate = (
  degrees: string,
  minutes: string,
  seconds: string,
  pole: string,
) => {
  return (
    (Number.parseFloat(degrees) +
      Number.parseFloat(minutes) / 60 +
      Number.parseFloat(seconds) / 3600) *
    (['N', 'E'].includes(pole) ? 1 : -1)
  );
};

/**
 * Convert coordinate string to number.
 *
 * @throws Error if the coordinate is not in valid DMS (degrees minutes seconds) format
 */
export const convertCoordinate = (coordinate: string): number[] => {
  if (!isValidCoordinate(coordinate)) {
    throw new Error('Invalid coordinate format');
  }

  const degrees = coordinate.match(/[0-9,.]+/g);
  const polars = coordinate.match(/(N|S|E|W)/g);

  if (!degrees || !polars) {
    throw new Error('Invalid coordinate format');
  }

  const [a, b, c, d, e, f] = degrees;
  const [y, x] = polars;

  return [calculate(a, b, c, y), calculate(d, e, f, x)]; // [latitude, longitude]
};
