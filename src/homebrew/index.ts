import {
  BrewError,
  BrewPackageOptions,
  BrewSafeInstallError,
  BREW_ERROR_MSG,
} from "./types";
import { Log, execCmd } from "../lib";
export class BrewPackage {
  public opts: BrewPackageOptions;
  constructor(opts: BrewPackageOptions) {
    this.opts = opts;
  }

  private async upgradeAll(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!this.opts.silent) {
        Log.info("Upgrading all packages");
      }
      const res = await execCmd(`brew upgrade`);
      if (res.err) {
        if (!this.opts.silent) Log.error(res.err.message);
        reject(new BrewError(res.err.message, BREW_ERROR_MSG.NODE_ERR));
        return;
      }
      if (res.stderr) {
        if (!this.opts.silent) Log.error(res.stderr);
        reject(new BrewError(res.stderr, BREW_ERROR_MSG.UPGRADE_ERR));
        return;
      }
      if (!this.opts.silent) {
        Log.info(`Successfully upgraded all packages:
            ${res.stdout}`);
      }
      resolve();
    });
  }

  private updateHomebrew(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      Log.info("Updating homebrew");
      const res = await execCmd(`brew update`);
      if (res.err) {
        if (!this.opts.silent) Log.error(res.err.message);
        reject(new BrewError(res.err.message, BREW_ERROR_MSG.NODE_ERR));
        return;
      }
      if (res.stderr) {
        if (!this.opts.silent) Log.error(res.stderr);
        reject(new BrewError(res.stderr, BREW_ERROR_MSG.UPDATE_ERR));
        return;
      }
      if (!this.opts.silent) {
        Log.info(`Successfully updated homebrew:
            ${res.stdout}`);
      }
      resolve();
    });
  }

  public async safeInstall(): Promise<BrewSafeInstallError> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.install();
        resolve({
          success: true,
          error: null,
        });
      } catch (e) {
        if (e instanceof BrewError) {
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
        resolve({
          success: false,
          error: new BrewError(
            "Something went wrong while installing",
            BREW_ERROR_MSG.MISC,
          ),
        });
      }
    });
  }
  public install(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (this.opts.update_homebrew) {
        await this.updateHomebrew();
      }
      if (this.opts.upgrade_all) {
        await this.upgradeAll();
      }
      if (Array.isArray(this.opts.name)) {
        resolve(this.installMany(this.opts.name));
        return;
      }
      resolve(this.installOne(this.opts.name));
    });
  }
  private installMany(names: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.opts.silent) {
        Log.info("Installing many packages");
      }
      for (const name of names) {
        this.installOne(name);
      }
      resolve();
    });
  }

  private installOne(name: string): Promise<void> {
    const caskMsg = this.opts.cask ? "--cask " : "";
    return new Promise(async (resolve, reject) => {
      if (!this.opts.silent) {
        Log.info(`Installing ${name}`);
      }
      const res = await execCmd(`brew install ${caskMsg} "${name}"`);
      if (res.err) {
        if (!this.opts.silent) Log.error(res.err.message);
        reject(new BrewError(res.err.message, BREW_ERROR_MSG.NODE_ERR));
        return;
      }
      if (res.stderr) {
        if (!this.opts.silent) Log.error(res.stderr);
        resolve(this.getInfo(name));
        return;
      }
      if (!this.opts.silent) {
        Log.info(`Successfully installed ${name}:
            ${res.stdout}`);
      }
      resolve();
    });
  }

  private getInfo(name: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const res = await execCmd(`brew info "${name}"`);
      if (res.err) {
        if (!this.opts.silent) Log.error(res.err.message);
        reject(new BrewError(res.err.message, BREW_ERROR_MSG.NODE_ERR));
        return;
      }
      if (res.stderr) {
        if (!this.opts.silent) Log.error(res.stderr);
        reject(new BrewError(res.stderr, BREW_ERROR_MSG.PACKAGE_NOT_FOUND));
        return;
      }
      if (!this.opts.silent) {
        Log.info(`${name} is already installed`);
      }
      resolve();
    });
  }
}
