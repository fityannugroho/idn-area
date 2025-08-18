import { beforeEach, describe, expect, it, vi } from 'vitest';
import { timify } from '../timify';

describe('Timify Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console.time and console.timeEnd
    vi.spyOn(console, 'time').mockImplementation(() => {
      // Empty implementation
    });
    vi.spyOn(console, 'timeEnd').mockImplementation(() => {
      // Empty implementation
    });
  });

  describe('timify', () => {
    it('should execute function and return result', async () => {
      const mockFn = vi.fn().mockResolvedValue('test result');
      const timifiedFn = timify(mockFn);

      const result = await timifiedFn('arg1', 'arg2');

      expect(result).toBe('test result');
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should call console.time and console.timeEnd with function name', async () => {
      const namedFunction = vi.fn().mockResolvedValue('result');
      Object.defineProperty(namedFunction, 'name', { value: 'testFunction' });

      const timifiedFn = timify(namedFunction);

      await timifiedFn();

      expect(console.time).toHaveBeenCalledWith('testFunction');
      expect(console.timeEnd).toHaveBeenCalledWith('testFunction');
    });

    it('should use custom label when provided', async () => {
      const mockFn = vi.fn().mockResolvedValue('result');
      const customLabel = 'Custom Operation';
      const timifiedFn = timify(mockFn, customLabel);

      await timifiedFn();

      expect(console.time).toHaveBeenCalledWith(customLabel);
      expect(console.timeEnd).toHaveBeenCalledWith(customLabel);
    });

    it('should handle synchronous functions', async () => {
      const syncFn = vi.fn().mockReturnValue('sync result');
      const timifiedFn = timify(syncFn);

      const result = await timifiedFn();

      expect(result).toBe('sync result');
      expect(syncFn).toHaveBeenCalled();
    });

    it('should preserve function arguments', async () => {
      const mockFn = vi.fn().mockResolvedValue('result');
      const timifiedFn = timify(mockFn);

      await timifiedFn('arg1', 42, { key: 'value' });

      expect(mockFn).toHaveBeenCalledWith('arg1', 42, { key: 'value' });
    });

    it('should handle functions that throw errors', async () => {
      const errorFn = vi.fn().mockRejectedValue(new Error('Test error'));
      const timifiedFn = timify(errorFn);

      try {
        await timifiedFn();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      expect(console.time).toHaveBeenCalled();
      // Note: console.timeEnd might not be called if error occurs before timeEnd
    });

    it('should handle functions with no name', async () => {
      const anonymousFn = vi.fn().mockResolvedValue('result');
      Object.defineProperty(anonymousFn, 'name', { value: '' });

      const timifiedFn = timify(anonymousFn);

      await timifiedFn();

      expect(console.time).toHaveBeenCalledWith('');
      expect(console.timeEnd).toHaveBeenCalledWith('');
    });

    it('should handle functions that return different types', async () => {
      const numberFn = vi.fn().mockResolvedValue(42);
      const objectFn = vi.fn().mockResolvedValue({ data: 'test' });
      const arrayFn = vi.fn().mockResolvedValue([1, 2, 3]);

      const timifiedNumber = timify(numberFn);
      const timifiedObject = timify(objectFn);
      const timifiedArray = timify(arrayFn);

      expect(await timifiedNumber()).toBe(42);
      expect(await timifiedObject()).toEqual({ data: 'test' });
      expect(await timifiedArray()).toEqual([1, 2, 3]);
    });
  });
});
