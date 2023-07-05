import { exec } from "child_process";
import {
  BrewError,
  BrewPackageOptions,
  BrewSafeInstallError,
  ERROR_MSG,
} from "./types";

export class BrewPackage {
  public opts: BrewPackageOptions;
  constructor(opts: BrewPackageOptions) {
    this.opts = opts;
  }

  private upgradeAll(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.info("Upgrading all packages");
      exec(`brew upgrade`, (err, stdout, stderr) => {
        if (err) {
          reject(new BrewError(err.message, ERROR_MSG.NODE_ERR));
        }
        if (stderr) {
          reject(new BrewError(stderr, ERROR_MSG.UPGRADE_ERR));
        }
        console.info(`Successfully upgraded all packages:
            ${stdout}`);
        resolve();
      });
    });
  }

  private updateHomebrew(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.info("Updating homebrew");
      exec(`brew update`, (err, stdout, stderr) => {
        if (err) {
          reject(new BrewError(err.message, ERROR_MSG.NODE_ERR));
        }
        if (stderr) {
          reject(new BrewError(stderr, ERROR_MSG.UPDATE_ERR));
        }
        console.info(`Successfully updated homebrew:
            ${stdout}`);
      });
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
          resolve({
            success: false,
            error: e,
          });
        }
        resolve({
          success: false,
          error: new BrewError(
            "Something went wrong while installing",
            ERROR_MSG.MISC,
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
        await this.installMany(this.opts.name);
        resolve();
        return;
      }
      await this.installOne(this.opts.name);
      resolve();
    });
  }
  private installMany(names: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      console.info("Installing many packages");
      for (const name of names) {
        this.installOne(name);
      }
      resolve();
    });
  }

  private installOne(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.info(`Installing ${name}`);
      exec(`brew install "${name}"`, (err, stdout, stderr) => {
        if (err) {
          reject(new BrewError(err.message, ERROR_MSG.NODE_ERR));
        }
        if (stderr) {
          resolve(this.getInfo(name));
        }
        console.info(`Successfully installed ${name}:
            ${stdout}`);
      });
    });
  }
  private getInfo(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      exec(`brew info "${name}"`, (err, stdout, stderr) => {
        if (err) {
          reject(new BrewError(err.message, ERROR_MSG.NODE_ERR));
        }
        if (stderr) {
          reject(new BrewError(stderr, ERROR_MSG.STD_ERR_PACKAGE));
        }
        console.info(`${name} is already installed`);
        resolve();
      });
    });
  }
}
