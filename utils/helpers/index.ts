import { exec } from 'child_process';

const run = (command: string) =>
  new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve({ stdout, stderr });
    });
  });

/**
 * Runs the given command.
 *
 * Any output from successful command execution will be printed on the console.
 * If command execution is failed, it will throw the error.
 *
 * @param command The command to execute.
 */
export const runOrFail = async (command: string) => {
  const { stdout } = await run(command);
  console.log(stdout);
};

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

export const areArraysEqual = <T extends Record<string, any>>(
  arr1: T[],
  arr2: T[],
  /**
   * If unset, the object keys will be compared.
   */
  expectedKeys?: string[],
): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    const obj2 = arr2[i];

    // Compare the keys of the objects
    const keys1 = expectedKeys || Object.keys(obj1);
    const keys2 = expectedKeys || Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    // Compare the values of the objects
    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
  }

  return true;
};
