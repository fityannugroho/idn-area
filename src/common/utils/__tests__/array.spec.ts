import { areArraysEqual, getValues, sortArray } from '../array';

describe('Array Utilities', () => {
  describe('areArraysEqual', () => {
    it('should return true for equal arrays', () => {
      const arr1 = [
        { id: 1, name: 'test' },
        { id: 2, name: 'test2' },
      ];
      const arr2 = [
        { id: 1, name: 'test' },
        { id: 2, name: 'test2' },
      ];

      expect(areArraysEqual(arr1, arr2)).toBe(true);
    });

    it('should return false for arrays with different lengths', () => {
      const arr1 = [{ id: 1, name: 'test' }];
      const arr2 = [
        { id: 1, name: 'test' },
        { id: 2, name: 'test2' },
      ];

      expect(areArraysEqual(arr1, arr2)).toBe(false);
    });

    it('should return false for arrays with different values', () => {
      const arr1 = [{ id: 1, name: 'test' }];
      const arr2 = [{ id: 1, name: 'different' }];

      expect(areArraysEqual(arr1, arr2)).toBe(false);
    });

    it('should return false for objects with different keys count', () => {
      const arr1 = [{ id: 1, name: 'test' }];
      const arr2 = [{ id: 1, name: 'test', extra: 'field' }];

      expect(areArraysEqual(arr1, arr2)).toBe(false);
    });

    it('should compare only expected keys when provided', () => {
      const arr1 = [{ id: 1, name: 'test', extra: 'field1' }];
      const arr2 = [{ id: 1, name: 'test', extra: 'field2' }];

      expect(areArraysEqual(arr1, arr2, ['id', 'name'])).toBe(true);
    });

    it('should return false when expected keys have different values', () => {
      const arr1 = [{ id: 1, name: 'test' }];
      const arr2 = [{ id: 2, name: 'test' }];

      expect(areArraysEqual(arr1, arr2, ['id', 'name'])).toBe(false);
    });
  });

  describe('sortArray', () => {
    const testArray = [
      { id: 3, name: 'Charlie' },
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];

    it('should sort array in ascending order by default', () => {
      const result = sortArray(testArray, 'id');

      expect(result).toEqual([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ]);
    });

    it('should sort array in ascending order explicitly', () => {
      const result = sortArray(testArray, 'name', 'asc');

      expect(result).toEqual([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ]);
    });

    it('should sort array in descending order', () => {
      const result = sortArray(testArray, 'id', 'desc');

      expect(result).toEqual([
        { id: 3, name: 'Charlie' },
        { id: 2, name: 'Bob' },
        { id: 1, name: 'Alice' },
      ]);
    });

    it('should not mutate original array', () => {
      const original = [...testArray];
      sortArray(testArray, 'id');

      expect(testArray).toEqual(original);
    });

    it('should handle equal values', () => {
      const equalArray = [
        { id: 1, name: 'Same' },
        { id: 1, name: 'Same' },
      ];

      const result = sortArray(equalArray, 'id');

      expect(result).toEqual(equalArray);
    });
  });

  describe('getValues', () => {
    const testArray = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ];

    it('should extract values by key', () => {
      const result = getValues(testArray, 'name');

      expect(result).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    it('should extract numeric values', () => {
      const result = getValues(testArray, 'id');

      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle empty array', () => {
      const result = getValues([], 'name');

      expect(result).toEqual([]);
    });

    it('should return array of correct length', () => {
      const result = getValues(testArray, 'age');

      expect(result).toHaveLength(3);
      expect(result).toEqual([25, 30, 35]);
    });
  });
});
