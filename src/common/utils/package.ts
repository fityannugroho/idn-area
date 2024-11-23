import { exec } from 'node:child_process';

type Dependency = {
  from: string;
  version: string;
  resolved: string;
  path: string;
};

export async function getInstalledPackageVersion(
  packageName: string,
): Promise<string | undefined> {
  const { stdout, stderr } = await new Promise<{
    stdout: string;
    stderr: string;
  }>((resolve, reject) => {
    exec('pnpm list --json', (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve({ stdout, stderr });
    });
  });

  if (stderr) {
    return undefined;
  }

  const [{ dependencies, devDependencies }] = JSON.parse(stdout) as [
    {
      dependencies: Record<string, Dependency>;
      devDependencies: Record<string, Dependency>;
    },
  ];

  return { ...dependencies, ...devDependencies }[packageName]?.version;
}
