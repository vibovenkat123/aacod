import { execCmd } from "../lib";
import { ShellCommandOpts, ShellCommandError, SafeRunResponse } from "./types";

export class ShellCommand {
  public opts: ShellCommandOpts;
  constructor(opts: ShellCommandOpts) {
    this.opts = opts;
  }

  public safeRun(): Promise<SafeRunResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.run();
        resolve({
          success: true,
          error: null,
        });
      } catch (e) {
        if (e instanceof ShellCommandError) {
          resolve({
            success: false,
            error: e,
          });
          return;
        }
        reject(e);
      }
    });
  }

  public run(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const shell = this.opts.executable || process.env.SHELL || "/bin/sh";
      let res = null;
      if (this.opts.chdir) {
        res = await execCmd(
          `${shell} -c ${this.opts.command}`,
          this.opts.chdir,
        );
      } else {
        res = await execCmd(`${shell} -c ${this.opts.command}`);
      }
      if (res.err) {
        reject(new ShellCommandError(res.err.message));
        return;
      }
      if (res.stderr) {
        reject(new ShellCommandError(res.stderr));
        return;
      }

      if (!this.opts.silent) {
        console.info(res.stdout);
      }
      resolve();
      return;
    });
  }
}
