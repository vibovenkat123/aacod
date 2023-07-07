export const GIT_ERROR_MSG = {
  NOT_FOUND: "Repository not found or you don't have permission to access it",
  GIT_CMD_NOT_FOUND: "The git command is not found",
  MISC: "An error occurred while executing the git command",
  KEY_NOT_FOUND: "The key (git config key) is not found",
} as const;

export const GIT_WARNING_MSG = {
  DEST_NOT_EMPTY:
    "Destination path already exists and is not an empty directory.",
} as const;

export type GitSafeResponse = {
  success: boolean;
  error: GitError | null;
};

type GitErrorMsg = (typeof GIT_ERROR_MSG)[keyof typeof GIT_ERROR_MSG]; // enum

export type GitOpts = {
  repo: string;
  bare: boolean;
  dest: string;
  silent: boolean;
  branch?: string;
};

export class GitError extends Error {
  constructor(msg: string, title: GitErrorMsg) {
    super(msg);
    this.name = `Git Error: ${title}`;
  }
}
export const GIT_CONFIG_SCOPE = {
  GLOBAL: "global",
  LOCAL: "local",
  SYSTEM: "system",
} as const; // I think these are all of em

type GitConfigScope = (typeof GIT_CONFIG_SCOPE)[keyof typeof GIT_CONFIG_SCOPE];

export type GitConfigOpts = {
  name: string;
  scope?: GitConfigScope;
  value?: string;
  silent: boolean;
};

export type GitConfigSafeResponse = {
  success: boolean;
  error: GitError | null;
  data: string | null;
};
