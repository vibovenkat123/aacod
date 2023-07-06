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

const command = "ls";

describe("Test shell", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Run command", async () => {
    const cmd = new ShellCommand({
      command,
      silent: true,
    });
    const res = await cmd.safeRun();
    expect(execCmd).toHaveBeenCalledTimes(1);
    expect(execCmd).toHaveBeenCalledWith(`${process.env.SHELL} -c ${command}`);
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
