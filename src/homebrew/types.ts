export const ERROR_MSG = {
  PACKAGE_NOT_FOUND: "Package not found",
  UPGRADE_ERR: "Can't upgrade all brew packages",
  STD_ERR_PACKAGE: "Error installing package",
  UPDATE_ERR: "Can't update homebrew",
  NODE_ERR: "Problem executing command",
  MISC: "Something went wrong while",
} as const;

export type ERROR_MSG = (typeof ERROR_MSG)[keyof typeof ERROR_MSG];

export class BrewError extends Error {
  constructor(current_error: string, error: ERROR_MSG) {
    super(current_error);
    Object.setPrototypeOf(this, BrewError.prototype);
    this.name = `Brew Error: ${error}`;
  }
}

export type BrewPackageOptions = {
  name: string | string[];
  update_homebrew: boolean;
  upgrade_all: boolean;
};

export type BrewSafeInstallError = {
  success: boolean;
  error: BrewError | null;
};
