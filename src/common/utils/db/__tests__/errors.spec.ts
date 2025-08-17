import { DatabaseConfigError } from '../errors';

describe('DatabaseConfigError', () => {
  it('should create error with default message', () => {
    const error = new DatabaseConfigError();

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('DatabaseConfigError');
    expect(error.message).toBe('Some database config is invalid');
  });

  it('should create error with custom message', () => {
    const customMessage = 'Custom database configuration error';
    const error = new DatabaseConfigError(customMessage);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('DatabaseConfigError');
    expect(error.message).toBe(customMessage);
  });

  it('should be throwable and catchable', () => {
    const customMessage = 'Test error message';

    expect(() => {
      throw new DatabaseConfigError(customMessage);
    }).toThrow(DatabaseConfigError);

    expect(() => {
      throw new DatabaseConfigError(customMessage);
    }).toThrow(customMessage);
  });

  it('should maintain error stack trace', () => {
    const error = new DatabaseConfigError('Stack trace test');

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('DatabaseConfigError');
  });
});
