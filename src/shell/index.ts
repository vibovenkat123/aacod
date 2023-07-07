import { Log, execCmd } from "../lib";
import { ShellCommandOpts, ShellCommandError, SafeRunResponse } from "./types";

export class ShellCommand {
  public opts: ShellCommandOpts;

  constructor(opts: ShellCommandOpts) {
    this.opts = opts;
  }

  // Just wrap the run method so it doens't throw
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
          if (!this.opts.silent) Log.error(e.message);
          resolve({
            success: false,
            error: e,
          });
          return;
        }
        if (e instanceof Error) {
          Log.fatal(e.message);
        }
        reject(e);
      }
    });
  }

  public run(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // The longest or logical or?
      const shell = this.opts.executable || process.env.SHELL || "/bin/sh";

      // there is probably a better way to do this
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
        if (!this.opts.silent) Log.error(res.err.message);
        reject(new ShellCommandError(res.err.message));
        return;
      }

      if (res.stderr) {
        if (!this.opts.silent) Log.error(res.stderr);
        reject(new ShellCommandError(res.stderr));
        return;
      }

      if (!this.opts.silent) {
        Log.info(res.stdout);
      }
      resolve();
      return;
    });
  }
}
