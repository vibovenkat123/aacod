import { describe, expect, it, vi, afterEach } from "vitest";
import { BrewPackage } from "./homebrew";
import { execCmd } from "./lib";

const mocks = vi.hoisted(() => {
  return {
    execCmd: vi.fn().mockResolvedValue({
      stdout: "stdout",
      stderr: null,
      err: null,
    }),
  };
});

vi.mock("./lib", () => {
  return {
    execCmd: mocks.execCmd,
  };
});

describe("Test homebrew", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Install git", async () => {
    const brew_package = new BrewPackage({
      name: "git",
      update_homebrew: false,
      upgrade_all: false,
    });
    const res = await brew_package.safeInstall();
    expect(execCmd).toHaveBeenCalledTimes(1);
    expect(res.success).toBeTruthy();
    expect(res.error).toBeNull();
  });

  it("Install git with stderr", async () => {
    mocks.execCmd.mockResolvedValue({
      stdout: "stdout",
      stderr: "asdf",
      err: null,
    });
    const brew_package = new BrewPackage({
      name: "git",
      update_homebrew: false,
      upgrade_all: false,
    });
    const res = await brew_package.safeInstall();
    expect(execCmd).toHaveBeenCalledTimes(2);
    expect(res.success).toBeFalsy();
    expect(res.error).not.toBeNull();
  });

  it("Install git with err", async () => {
    mocks.execCmd.mockResolvedValue({
      stdout: "stdout",
      stderr: null,
      err: "asdf",
    });
    const brew_package = new BrewPackage({
      name: "git",

      update_homebrew: false,
      upgrade_all: false,
    });
    const res = await brew_package.safeInstall();
    expect(execCmd).toHaveBeenCalledTimes(1);
    expect(res.success).toBeFalsy();
    expect(res.error).not.toBeNull();
  });
});
