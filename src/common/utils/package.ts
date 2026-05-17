import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export function getInstalledPackageVersion(
  packageName: string,
): string | undefined {
  try {
    const pkgPath = resolve(
      process.cwd(),
      'node_modules',
      packageName,
      'package.json',
    );
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    return pkg.version;
  } catch {
    return undefined;
  }
}
