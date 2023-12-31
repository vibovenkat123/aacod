import {
  BrewError,
  BrewPackageOptions,
  BrewSafeError,
  BREW_ERROR_MSG,
} from "./types";

import { Log, execCmd } from "../lib";

export class BrewPackage {
  public opts: BrewPackageOptions;
  constructor(opts: BrewPackageOptions) {
    this.opts = opts;
  }

  public async upgradeAllPkgs(): Promise<void> {
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

  public updateHomebrew(): Promise<void> {
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

  public async safeInstall(): Promise<BrewSafeError> {
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
        reject(e);
      }
    });
  }

  // do everything in here
  public install(): Promise<void> {
    return new Promise(async (resolve, _) => {
      if (this.opts.update_homebrew) {
        await this.updateHomebrew();
      }
      if (this.opts.upgrade_all) {
        await this.upgradeAllPkgs();
      }
      if (Array.isArray(this.opts.name)) {
        resolve(this.installMany(this.opts.name));
        return;
      }
      resolve(this.installOne(this.opts.name));
    });
  }
  private installMany(names: string[]): Promise<void> {
    return new Promise((resolve, _) => {
      for (const name of names) {
        Log.info(`Installing ${name}`);
        this.installOne(name);
      }
      resolve();
    });
  }

  private installOne(name: string): Promise<void> {
    // args
    const caskMsg = this.opts.cask ? " --cask" : "";

    return new Promise(async (resolve, reject) => {
      if (!this.opts.silent) {
        Log.info(`Installing ${name}`);
      }

      const res = await execCmd(`brew install${caskMsg} ${name}`);

      if (res.err) {
        if (!this.opts.silent) Log.error(res.err.message);
        reject(new BrewError(res.err.message, BREW_ERROR_MSG.NODE_ERR));
        return;
      }

      if (res.stderr) {
        if (!this.opts.silent) Log.error(res.stderr);
        // homebrew throws an error if the package is already installed
        // so in case the package is already installed, we just resolve
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
      const res = await execCmd(`brew info ${name}`);
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

  public async safeUninstall(): Promise<BrewSafeError> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.uninstall();
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
        reject(e);
      }
    });
  }

  public uninstall(): Promise<void> {
    return new Promise(async (resolve, _) => {
      if (this.opts.update_homebrew) {
        this.updateHomebrew();
      }
      if (this.opts.upgrade_all) {
        this.upgradeAllPkgs();
      }

      if (Array.isArray(this.opts.name)) {
        resolve(this.uninstallMany());
        return;
      }
      resolve(this.uninstallOne(this.opts.name));
    });
  }

  public uninstallMany(): Promise<void> {
    return new Promise((resolve, _) => {
      for (const name of this.opts.name) {
        if (!this.opts.silent) {
          Log.info(`Uninstalling ${name}`);
        }
        this.uninstallOne(name);
      }
      resolve();
    });
  }

  public uninstallOne(name: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const res = await execCmd(`brew uninstall ${name}`);
      if (res.err) {
        if (!this.opts.silent) Log.error(res.err.message);
        reject(new BrewError(res.err.message, BREW_ERROR_MSG.NODE_ERR));
        return;
      }

      if (res.stderr) {
        if (!this.opts.silent) Log.error(res.stderr);
        // dont uninstall if the package is not installed
        reject(new BrewError(res.stderr, BREW_ERROR_MSG.PACKAGE_NOT_FOUND));
        return;
      }

      if (!this.opts.silent) {
        Log.info(`${name} has been uninstalled`);
      }
      resolve();
    });
  }
}
