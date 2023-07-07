import { ShellCommand } from "../shell";
import { UrlOpts, UrlSafeGetResponse } from "./types";

// when you are too lazy to type out curl
// This is just a wrapper
export class Url {
  public opts: UrlOpts;
  private timeout_command;
  constructor(opts: UrlOpts) {
    this.opts = opts;
    this.timeout_command = opts.timeout ? ` -m ${this.opts.timeout}` : "";
  }

  public safeGet(): Promise<UrlSafeGetResponse> {
    const command = `curl -L -o${this.timeout_command} ${this.opts.dest} ${this.opts.url}`;
    const commandObj = new ShellCommand({
      command,
      silent: this.opts.silent,
      chdir: this.opts.chdir,
    });

    return commandObj.safeRun();
  }

  public get(): Promise<void> {
    const command = `curl -L -o${this.timeout_command} ${this.opts.dest} ${this.opts.url}`;
    const commandObj = new ShellCommand({
      command,
      silent: this.opts.silent,
      chdir: this.opts.chdir,
    });
    return commandObj.run();
  }
}
