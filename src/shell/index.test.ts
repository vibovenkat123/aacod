import { describe, expect, it, vi, afterEach } from "vitest";
import { ShellCommand } from "./";
import { execCmd } from "../lib";

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

describe("Test shell", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Run command", async () => {
    const cmd = new ShellCommand({
      command: "ls",
      silent: true,
    });
    const res = await cmd.safeRun();
    expect(execCmd).toHaveBeenCalledTimes(1);
    expect(res.success).toBeTruthy();
    expect(res.error).toBeNull();
  });
  it("Run command with stderr", async () => {
    mocks.execCmd.mockResolvedValue({
      stdout: "stdout",
      stderr: "foo",
      err: null,
    });
    const cmd = new ShellCommand({
      command: "notfoundcmd",
      silent: true,
    });
    const res = await cmd.safeRun();
    expect(execCmd).toHaveBeenCalledTimes(1);
    expect(res.success).toBeFalsy();
    expect(res.error).not.toBeNull();
  });
});
