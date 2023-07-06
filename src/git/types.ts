export const GIT_ERROR_MSG = {
  NOT_FOUND: "Repository not found or you don't have permission to access it",
  GIT_CMD_NOT_FOUND: "The git command is not found",
  MISC: "An error occurred while executing the git command",
} as const;

export const GIT_WARNING_MSG = {
  DEST_NOT_EMPTY:
    "Destination path already exists and is not an empty directory.",
} as const;

export type GitSafeResponse = {
  success: boolean;
  error: GitError | null;
};

type GitErrorMsg = (typeof GIT_ERROR_MSG)[keyof typeof GIT_ERROR_MSG];

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
