import { exec } from 'child_process';

const run = (command: string) =>
  new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve({ stdout, stderr });
    });
  });

/**
 * Runs the given command.
 *
 * Any output from successful command execution will be printed on the console.
 * If command execution is failed, it will throw the error.
 *
 * @param command The command to execute.
 */
export const runOrFail = async (command: string) => {
  const { stdout } = await run(command);
  console.log(stdout);
};
