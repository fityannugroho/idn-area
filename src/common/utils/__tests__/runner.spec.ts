import { exec } from 'node:child_process';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { runOrFail } from '../runner';

// Mock child_process
vi.mock('node:child_process', () => ({
  exec: vi.fn(),
}));

describe('Runner Utilities', () => {
  const mockExec = vi.mocked(exec);

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console.log to avoid cluttering test output
    vi.spyOn(console, 'log').mockImplementation(() => {
      // Empty implementation
    });
  });

  describe('runOrFail', () => {
    it('should execute command successfully and log output', async () => {
      const mockStdout = 'Command executed successfully';

      mockExec.mockImplementation((_command, callback) => {
        const cb = callback as (
          error: Error | null,
          stdout: string,
          stderr: string,
        ) => void;
        cb(null, mockStdout, '');
        return {} as any;
      });

      await runOrFail('echo "test"');

      expect(mockExec).toHaveBeenCalledWith(
        'echo "test"',
        expect.any(Function),
      );
      expect(console.log).toHaveBeenCalledWith(mockStdout);
    });

    it('should throw error when command fails', async () => {
      const mockError = new Error('Command failed');

      mockExec.mockImplementation((_command, callback) => {
        const cb = callback as (
          error: Error | null,
          stdout: string,
          stderr: string,
        ) => void;
        cb(mockError, '', 'Error output');
        return {} as any;
      });

      await expect(runOrFail('invalid-command')).rejects.toThrow(
        'Command failed',
      );
      expect(mockExec).toHaveBeenCalledWith(
        'invalid-command',
        expect.any(Function),
      );
    });

    it('should handle empty stdout', async () => {
      mockExec.mockImplementation((_command, callback) => {
        const cb = callback as (
          error: Error | null,
          stdout: string,
          stderr: string,
        ) => void;
        cb(null, '', '');
        return {} as any;
      });

      await runOrFail('echo ""');

      expect(console.log).toHaveBeenCalledWith('');
    });

    it('should pass correct command to exec', async () => {
      const testCommand = 'ls -la';

      mockExec.mockImplementation((_command, callback) => {
        const cb = callback as (
          error: Error | null,
          stdout: string,
          stderr: string,
        ) => void;
        cb(null, 'output', '');
        return {} as any;
      });

      await runOrFail(testCommand);

      expect(mockExec).toHaveBeenCalledWith(testCommand, expect.any(Function));
    });
  });
});
