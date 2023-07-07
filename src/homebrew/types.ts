export const BREW_ERROR_MSG = {
  PACKAGE_NOT_FOUND: "Package not found",
  UPGRADE_ERR: "Can't upgrade all brew packages",
  STD_ERR_PACKAGE: "Error installing package",
  UPDATE_ERR: "Can't update homebrew",
  NODE_ERR: "Problem executing command",
  MISC: "Something went wrong while",
} as const;

export type BREW_ERROR_MSG =
  (typeof BREW_ERROR_MSG)[keyof typeof BREW_ERROR_MSG]; // enum

export class BrewError extends Error {
  constructor(current_error: string, error: BREW_ERROR_MSG) {
    super(current_error);
    Object.setPrototypeOf(this, BrewError.prototype);
    this.name = `Brew Error: ${error}`;
  }
}

export type BrewPackageOptions = {
  name: string | string[];
  cask: boolean;
  silent: boolean;
  update_homebrew: boolean;
  upgrade_all: boolean;
};

export type BrewSafeError = {
  success: boolean;
  error: BrewError | null;
};
