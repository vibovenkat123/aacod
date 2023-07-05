type ShellExecutable =
  | "/bin/sh"
  | "/bin/bash"
  | "/usr/bin/bash"
  | "/usr/bin/zsh"
  | "/bin/zsh"
  | "/usr/bin/sh"
  | "/usr/bin/env bash"
  | "/usr/bin/env zsh"
  | (string & {});
export type ShellCommandOpts = {
  command: string;
  silent: boolean;
  chdir?: string;
  executable?: ShellExecutable;
};

export type SafeRunResponse = {
  success: boolean;
  error: ShellCommandError | null;
};

export class ShellCommandError extends Error {
  constructor(error_msg: string) {
    super(error_msg);
    this.name = "There was an error running the command";
  }
}
