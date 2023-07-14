/**
 * Add time logger that measure how long function is executed.
 *
 * @param fn The function to execute.
 * @param label The label for the time logger.
 * @returns The function with time logger.
 */
export const timify = <T extends (...args: any[]) => any>(
  fn: T,
  label?: string,
) => {
  return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    console.time(label || fn.name);
    const result = await fn(...args);
    console.timeEnd(label || fn.name);
    return result;
  };
};
