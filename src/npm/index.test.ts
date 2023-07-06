import { describe, expect, it, vi, afterEach } from "vitest";
import { NpmPackage } from "./";
import { Log, execCmd } from "../lib";

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

const pkg = "@vaibhavvenkat/aacod";

describe("Test npm", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Install package", async () => {
    const newPkg = new NpmPackage({
      silent: true,
      name: pkg,
      global: true,
    });
    const res = await newPkg.safeInstall();
    expect(execCmd).toHaveBeenCalledTimes(1);
    expect(execCmd).toHaveBeenCalledWith(`npm install -g ${pkg}`);
    expect(res.success).toBeTruthy();
    expect(res.error).toBe(null);
  });
  it("Install package without global", async () => {
    const newPkg = new NpmPackage({
      silent: true,
      name: pkg,
      global: false,
      version: "1.0.0",
    });
    const res = await newPkg.safeInstall();
    expect(execCmd).toHaveBeenCalledTimes(1);
    expect(execCmd).toHaveBeenCalledWith(`npm install ${pkg}@1.0.0`);
    expect(res.success).toBeTruthy();
    expect(res.error).toBe(null);
  });
  it("Install package with err no package", async () => {
    mocks.execCmd.mockResolvedValueOnce({
      stdout: null,
      stderr: "err pkg not found",
      err: {
        code: 1,
        message: "err pkg not found",
      },
    });
    const newPkg = new NpmPackage({
      silent: true,
      name: pkg,
      global: false,
      version: "1.0.0",
    });
    const res = await newPkg.safeInstall();
    expect(execCmd).toHaveBeenCalledTimes(1);
    expect(execCmd).toHaveBeenCalledWith(`npm install ${pkg}@1.0.0`);
    expect(res.success).toBeFalsy();
    expect(res.error).not.toBe(null);
    expect(res.error?.message).toBe("err pkg not found");
  });
});
