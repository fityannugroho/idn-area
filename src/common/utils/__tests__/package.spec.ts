import { exec } from 'node:child_process';
import { describe, expect, it, vi } from 'vitest';
import { getInstalledPackageVersion } from '../package';

vi.mock('node:child_process', () => ({
  exec: vi.fn(),
}));

beforeEach(() => {
  vi.resetModules();
});

describe('getInstalledPackageVersion', () => {
  it('should return the version of the installed package', async () => {
    const mockStdout = JSON.stringify([
      {
        dependencies: { 'some-package': { version: '1.0.0' } },
        devDependencies: {},
      },
    ]);

    vi.mocked(exec).mockImplementation((_cmd, callback) => {
      // @ts-ignore (mocked)
      return callback(null, mockStdout, '');
    });

    const version = await getInstalledPackageVersion('some-package');
    expect(version).toBe('1.0.0');
  });

  it('should return undefined if the package is not found', async () => {
    const mockStdout = JSON.stringify([
      {
        dependencies: {},
        devDependencies: {},
      },
    ]);

    vi.mocked(exec).mockImplementation((_cmd, callback) => {
      // @ts-ignore (mocked)
      return callback(null, mockStdout, '');
    });

    const version = await getInstalledPackageVersion('non-existent-package');
    expect(version).toBeUndefined();
  });

  it('should return undefined if there is an error in stderr', async () => {
    vi.mocked(exec).mockImplementation((_cmd, callback) => {
      // @ts-ignore
      return callback(null, '', 'Some error');
    });

    const version = await getInstalledPackageVersion('some-package');
    expect(version).toBeUndefined();
  });

  it('should reject if exec returns an error', async () => {
    vi.mocked(exec).mockImplementation((_cmd, callback) => {
      // @ts-ignore
      return callback(new Error('exec error'), '', '');
    });

    await expect(getInstalledPackageVersion('some-package')).rejects.toThrow(
      'exec error',
    );
  });
});
