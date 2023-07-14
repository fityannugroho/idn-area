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
