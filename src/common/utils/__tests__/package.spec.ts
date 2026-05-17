import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { getInstalledPackageVersion } from '../package';

vi.mock('node:fs', () => ({
  readFileSync: vi.fn(),
}));

describe('getInstalledPackageVersion', () => {
  it('should return the version of the installed package', () => {
    vi.mocked(readFileSync).mockReturnValue(
      JSON.stringify({ version: '1.0.0' }),
    );

    const version = getInstalledPackageVersion('some-package');
    expect(version).toBe('1.0.0');
  });

  it('should return undefined if readFileSync fails', () => {
    vi.mocked(readFileSync).mockImplementation(() => {
      throw new Error('ENOENT');
    });

    const version = getInstalledPackageVersion('non-existent-package');
    expect(version).toBeUndefined();
  });

  it('should return undefined if package.json has no version field', () => {
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify({ name: 'foo' }));

    const version = getInstalledPackageVersion('some-package');
    expect(version).toBeUndefined();
  });

  it('should return undefined if package.json is invalid JSON', () => {
    vi.mocked(readFileSync).mockReturnValue('not json');

    const version = getInstalledPackageVersion('some-package');
    expect(version).toBeUndefined();
  });
});
