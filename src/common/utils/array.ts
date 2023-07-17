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

/**
 * Return new sorted array.
 */
export const sortArray = <T extends Record<string, any>>(
  arr: T[],
  key: keyof T,
  sortOrder: 'asc' | 'desc' = 'asc',
) => {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (aVal > bVal) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

/**
 * Get property values from array of objects.
 */
export const getValues = <T extends Record<string, any>>(
  arr: T[],
  key: keyof T,
): T[keyof T][] => {
  return arr.map((obj) => obj[key]);
};
