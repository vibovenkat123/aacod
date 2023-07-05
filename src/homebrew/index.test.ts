import { describe, expect, it, vi, afterEach } from "vitest";
import { BrewPackage } from "./";
import { execCmd } from "../lib";
import { BREW_ERROR_MSG } from "./types";

const mocks = vi.hoisted(() => {
  return {
    execCmd: vi.fn().mockResolvedValue({
      stdout: "stdout",
      stderr: null,
      err: null,
    }),
  };
});

vi.mock("../lib", () => {
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
      silent: true,
    });
    const res = await brew_package.safeInstall();
    expect(execCmd).toHaveBeenCalledTimes(1);
    expect(res.success).toBeTruthy();
    expect(res.error).toBeNull();
  });

  it("Install git with stderr", async () => {
    mocks.execCmd.mockResolvedValue({
      stdout: "stdout",
      stderr: "foo",
      err: null,
    });
    const brew_package = new BrewPackage({
      name: "git",
      update_homebrew: false,
      upgrade_all: false,
      silent: true,
    });
    const res = await brew_package.safeInstall();
    expect(execCmd).toHaveBeenCalledTimes(2);
    expect(res.success).toBeFalsy();
    expect(res.error).not.toBeNull();
    if (res.error) {
      expect(res.error.name).toBe(
        `Brew Error: ${BREW_ERROR_MSG.PACKAGE_NOT_FOUND}`,
      );
    }
  });

  it("Install git with err", async () => {
    mocks.execCmd.mockResolvedValue({
      stdout: "stdout",
      stderr: null,
      err: "bar",
    });
    const brew_package = new BrewPackage({
      name: "git",
      silent: true,
      update_homebrew: false,
      upgrade_all: false,
    });
    const res = await brew_package.safeInstall();
    expect(execCmd).toHaveBeenCalledTimes(1);
    expect(res.success).toBeFalsy();
    expect(res.error).not.toBeNull();
    if (res.error) {
      expect(res.error.name).toBe(`Brew Error: ${BREW_ERROR_MSG.NODE_ERR}`);
    }
  });
});
