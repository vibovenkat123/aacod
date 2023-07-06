import { describe, expect, it, vi, afterEach } from "vitest";
import { GitRepo } from "./";
import { Log, execCmd } from "../lib";
import { ExecException } from "child_process";

const mocks = vi.hoisted(() => {
  return {
    execCmd: vi.fn().mockResolvedValue({
      stdout: "stdout",
      stderr: null,
      err: null,
    }),
  };
});
vi.mock("../lib", async () => {
  const actual = (await vi.importActual("../lib")) as Log;
  return {
    ...actual,
    execCmd: mocks.execCmd,
  };
});

describe("Test git", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it("Clone git", async () => {
    const git = new GitRepo({
      repo: "git@github.com:testusername/blah.git",
      silent: true,
      dest: "./test",
      bare: false,
    });
    const res = await git.safeClone();
    expect(execCmd).toHaveBeenCalledTimes(1);
    expect(res.success).toBeTruthy();
    expect(res.error).toBeNull();
  });

  it("Clone git with bare", async () => {
    const git = new GitRepo({
      repo: "git@github.com:testusername/blah.git",
      silent: true,
      dest: "./test",
      bare: true,
    });
    const res = await git.safeClone();
    expect(execCmd).toHaveBeenCalledTimes(1);
    expect(res.success).toBeTruthy();
    expect(res.error).toBeNull();
  });

  it("Clone git with branch", async () => {
    const git = new GitRepo({
      repo: "git@github.com:testusername/blah.git",
      silent: true,
      dest: "./test",
      bare: false,
      branch: "main",
    });
    const res = await git.safeClone();
    expect(execCmd).toHaveBeenCalledTimes(1);
    expect(res.success).toBeTruthy();
    expect(res.error).toBeNull();
  });

  it("Clone git with stderr", async () => {
    const fakeErr: ExecException = {
      name: "foo",
      message: "bar",
      code: 128,
      cmd: "git clone",
      killed: false,
    };
    mocks.execCmd.mockResolvedValue({
      stdout: "stdout",
      stderr: "foo",
      err: fakeErr,
    });
    const git = new GitRepo({
      repo: "git@github.com:testusername/blah.git",
      silent: true,
      dest: "./test",
      bare: false,
    });
    const res = await git.safeClone();
    expect(execCmd).toHaveBeenCalledTimes(2);
    expect(res.success).toBeFalsy();
    expect(res.error).toBeNull();
  });
});
