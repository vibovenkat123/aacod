import { describe, expect, it, vi, afterEach } from "vitest";
import { GitConfig, GitRepo } from "./";
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
const repo = "git@github.com:testusername/blah.git";
const dest = "./test";
describe("Test git", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it("Clone git", async () => {
    const git = new GitRepo({
      repo,
      silent: true,
      dest,
      bare: false,
    });
    const res = await git.safeClone();
    expect(execCmd).toHaveBeenCalledTimes(1);
    expect(execCmd).toHaveBeenCalledWith(`git clone ${repo} ${dest}`);
    expect(res.success).toBeTruthy();
    expect(res.error).toBeNull();
  });

  it("Clone git with bare", async () => {
    const git = new GitRepo({
      repo,
      silent: true,
      dest,
      bare: true,
    });
    const res = await git.safeClone();
    expect(execCmd).toHaveBeenCalledTimes(1);
    expect(execCmd).toHaveBeenCalledWith(`git clone --bare ${repo} ${dest}`);
    expect(res.success).toBeTruthy();
    expect(res.error).toBeNull();
  });

  it("Clone git with branch", async () => {
    const branch = "main";
    const git = new GitRepo({
      repo,
      silent: true,
      dest,
      bare: false,
      branch,
    });
    const res = await git.safeClone();
    expect(execCmd).toHaveBeenCalledTimes(1);
    expect(execCmd).toHaveBeenCalledWith(`git clone -b ${branch} ${repo} ${dest}`);
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

describe("Test git config", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });
    it("Set git config", async () => {
        mocks.execCmd.mockResolvedValue({
            stdout: "stdout",
            stderr: null,
            err: null,
        });
        const name = "user.name"
        const value = "test"
        const scope = "global"
        const conf = new GitConfig({
            name,
            value,
            scope,
            silent: true,
        })
        const res = await conf.safeSet()
        expect(execCmd).toHaveBeenCalledTimes(1)
        expect(execCmd).toHaveBeenCalledWith(`git config --${scope} ${name} ${value}`)
        expect(res.success).toBeTruthy()
        expect(res.error).toBeNull()
    })
    it("List git config", async () => {
        mocks.execCmd.mockResolvedValue({
            stdout: "stdout",
            stderr: null,
            err: null,
        });
        const name = "user.name"
        const conf = new GitConfig({
            name,
            silent: true,
        })
        const res = await conf.safeList()
        expect(execCmd).toHaveBeenCalledTimes(1)
        expect(execCmd).toHaveBeenCalledWith(`git config --get ${name}`)
        expect(res.success).toBeTruthy()
        expect(res.error).toBeNull()
    })
})
