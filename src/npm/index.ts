import { Log, execCmd } from "../lib";
import { NPM_ERROR_MSG, NpmError, NpmPkgOpts, NpmSafeResponse } from "./types";

export class NpmPackage {
  public opts: NpmPkgOpts;
  constructor(opts: NpmPkgOpts) {
    this.opts = opts;
  }

  public async safeInstall(): Promise<NpmSafeResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.install();
        resolve({
          success: true,
          error: null,
        });
      } catch (e) {
        if (e instanceof NpmError) {
          if (!this.opts.silent)
            Log.error(`
                        ${e.name}
                        ${e.message}
                    `);
          resolve({
            success: false,
            error: e,
          });
          return;
        } else if (e instanceof Error) {
          Log.fatal(e.message);
        }
        reject(e);
      }
    });
  }

  public install(): Promise<void> {
    // tons of args
    const version_msg = this.opts.version ? `@${this.opts.version}` : "";
    const global_msg = this.opts.global ? " -g" : "";
    const path_msg = this.opts.path ? ` --prefix ${this.opts.path}` : "";
    const cmd = `npm install${global_msg}${path_msg} ${this.opts.name}${version_msg}`;

    // not a wrapper around ShellCommand because we want to handle the error,
    // not just pass it up

    return new Promise(async (resolve, reject) => {
      const res = await execCmd(cmd);
      if (res.err) {
        // note, 127 is the code for command not found
        if (res.err.code === 127) {
          if (!this.opts.silent) Log.error(NPM_ERROR_MSG.NPM_CMD_NOT_FOUND);
          reject(
            new NpmError(res.err.message, NPM_ERROR_MSG.NPM_CMD_NOT_FOUND),
          );
          return;
        }
        // this is npm throwing an error
        if (res.err.code === 1) {
          if (!this.opts.silent) Log.error(NPM_ERROR_MSG.PKG_NOT_FOUND);
          reject(new NpmError(res.err.message, NPM_ERROR_MSG.PKG_NOT_FOUND));
          return;
        }

        // this should be rare
        if (!this.opts.silent) Log.error(NPM_ERROR_MSG.MISC);
        reject(new NpmError(res.err.message, NPM_ERROR_MSG.MISC));
        return;
      }

      if (res.stderr) {
        if (!this.opts.silent) Log.error(res.stderr);
        reject(new NpmError(res.stderr, NPM_ERROR_MSG.MISC));
        return;
      }

      if (!this.opts.silent) Log.info(res.stdout);
      resolve();
    });
  }
}
