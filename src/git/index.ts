import { Log, execCmd } from "../lib";
import {
  GIT_ERROR_MSG,
  GIT_WARNING_MSG,
  GitError,
  GitOpts,
  GitSafeResponse,
} from "./types";

export class GitRepo {
  public opts: GitOpts;
  constructor(opts: GitOpts) {
    this.opts = opts;
  }
  public safeClone(): Promise<GitSafeResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.clone();
        resolve({
          success: true,
          error: null,
        });
      } catch (e) {
        if (e instanceof GitError) {
          if (!this.opts.silent)
            Log.error(`
${e.name}:
${e.message}`);
          resolve({
            success: false,
            error: null,
          });
          return;
        }
        if (e instanceof Error) {
          Log.fatal(e.message);
        }
        process.exit(1);
      }
    });
  }
  public clone(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const branch_cmd = this.opts.branch ? `-b ${this.opts.branch}` : "";
      const res = await execCmd(
        `git clone ${this.opts.bare ? "--bare" : ""} ${branch_cmd} ${
          this.opts.repo
        } ${this.opts.dest}`,
      );
      if (res.err) {
        if (res.err.code === 127) {
          if (!this.opts.silent) Log.error(GIT_ERROR_MSG.GIT_CMD_NOT_FOUND);
          reject(
            new GitError(res.err.message, GIT_ERROR_MSG.GIT_CMD_NOT_FOUND),
          );
          return;
        } else if (res.err.code === 128) {
          const second_res = await execCmd(`ls ${this.opts.dest}`);
          if (!second_res.stderr) {
            if (!this.opts.silent) Log.warn(GIT_WARNING_MSG.DEST_NOT_EMPTY);
            resolve();
            return;
          }
          reject(new GitError(res.err.message, GIT_ERROR_MSG.NOT_FOUND));
          return;
        }
        reject(new GitError(res.err.message, GIT_ERROR_MSG.MISC));
        return;
      }
      if (!this.opts.silent) Log.info(res.stdout);
      resolve();
    });
  }
}
