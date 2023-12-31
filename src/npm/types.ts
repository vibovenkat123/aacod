export type NpmPkgOpts = {
  name: string;
  version?: string;
  path?: string; // where to install the package
  global: boolean;
  silent: boolean;
};

export const NPM_ERROR_MSG = {
  NPM_CMD_NOT_FOUND: "npm command not found",
  PKG_NOT_FOUND: "Package not found or sudo required. Try again with sudo",
  MISC: "Can't install package",
} as const;

type NpmErrorMsg = (typeof NPM_ERROR_MSG)[keyof typeof NPM_ERROR_MSG]; // enum

export class NpmError extends Error {
  constructor(msg: string, title: NpmErrorMsg) {
    super(msg);
    this.name = title;
  }
}

export type NpmSafeResponse = {
  success: boolean;
  error: NpmError | null;
};
