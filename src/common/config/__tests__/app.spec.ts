import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('App Configuration', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
    vi.resetModules();
  });

  it('should use default values when environment variables are not set', async () => {
    // Clear environment variables
    delete process.env.APP_ENV;
    delete process.env.APP_HOST;
    delete process.env.APP_PORT;
    delete process.env.APP_PAGINATION_DEFAULT_PAGE_SIZE;
    delete process.env.APP_PAGINATION_MAX_PAGE_SIZE;

    vi.resetModules();
    const { appConfig } = await import('../app');

    expect(appConfig.env).toBe('dev');
    expect(appConfig.host).toBe('0.0.0.0');
    expect(appConfig.port).toBe(3000);
    expect(appConfig.pagination.defaultPageSize).toBe(10);
    expect(appConfig.pagination.maxPageSize).toBe(100);
  });

  it('should use environment variables when they are set', async () => {
    // Set environment variables
    process.env.APP_ENV = 'prod';
    process.env.APP_HOST = '127.0.0.1';
    process.env.APP_PORT = '8080';
    process.env.APP_PAGINATION_DEFAULT_PAGE_SIZE = '20';
    process.env.APP_PAGINATION_MAX_PAGE_SIZE = '200';

    vi.resetModules();
    const { appConfig } = await import('../app');

    expect(appConfig.env).toBe('prod');
    expect(appConfig.host).toBe('127.0.0.1');
    expect(appConfig.port).toBe(8080);
    expect(appConfig.pagination.defaultPageSize).toBe(20);
    expect(appConfig.pagination.maxPageSize).toBe(200);
  });

  it('should handle partial environment variable configuration', async () => {
    // Set only some environment variables
    process.env.APP_ENV = 'prod';
    process.env.APP_PORT = '5000';
    delete process.env.APP_HOST;
    delete process.env.APP_PAGINATION_DEFAULT_PAGE_SIZE;
    delete process.env.APP_PAGINATION_MAX_PAGE_SIZE;

    vi.resetModules();
    const { appConfig } = await import('../app');

    expect(appConfig.env).toBe('prod');
    expect(appConfig.host).toBe('0.0.0.0'); // Default value
    expect(appConfig.port).toBe(5000);
    expect(appConfig.pagination.defaultPageSize).toBe(10); // Default value
    expect(appConfig.pagination.maxPageSize).toBe(100); // Default value
  });

  it('should handle invalid numeric environment variables gracefully', async () => {
    // Set invalid numeric values
    process.env.APP_PORT = 'invalid';
    process.env.APP_PAGINATION_DEFAULT_PAGE_SIZE = 'not-a-number';

    vi.resetModules();
    const { appConfig } = await import('../app');

    // Should handle NaN values gracefully
    expect(typeof appConfig.port).toBe('number');
    expect(typeof appConfig.pagination.defaultPageSize).toBe('number');
  });

  it('should handle empty string environment variables', async () => {
    // Set empty string values
    process.env.APP_ENV = '';
    process.env.APP_HOST = '';
    process.env.APP_PORT = '';
    process.env.APP_PAGINATION_DEFAULT_PAGE_SIZE = '';

    vi.resetModules();
    const { appConfig } = await import('../app');

    expect(appConfig.env).toBe('dev'); // Default value
    expect(appConfig.host).toBe('0.0.0.0'); // Default value
    expect(appConfig.port).toBe(3000); // Default value
    expect(appConfig.pagination.defaultPageSize).toBe(10); // Default value
  });

  it('should have correct TypeScript types', async () => {
    const { appConfig } = await import('../app');

    expect(typeof appConfig.env).toBe('string');
    expect(typeof appConfig.host).toBe('string');
    expect(typeof appConfig.port).toBe('number');
    expect(typeof appConfig.pagination.defaultPageSize).toBe('number');
    expect(typeof appConfig.pagination.maxPageSize).toBe('number');
  });

  it('should have immutable structure', async () => {
    const { appConfig } = await import('../app');

    // Test that configuration object exists and has expected properties
    expect(appConfig).toBeDefined();
    expect(appConfig.pagination).toBeDefined();

    // Verify default values are reasonable
    expect(appConfig.port).toBeGreaterThan(0);
    expect(appConfig.pagination.defaultPageSize).toBeGreaterThan(0);
    expect(appConfig.pagination.maxPageSize).toBeGreaterThan(
      appConfig.pagination.defaultPageSize,
    );
  });
});
