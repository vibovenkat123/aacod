import { ShellCommandError } from "../shell/types";

export type UrlOpts = {
    dest: string;
    url: string;
    silent: boolean;
    chdir?: string;
    timeout?: number;
}

export type UrlSafeGetResponse = {
    success: boolean;
    error: ShellCommandError | null;
}
