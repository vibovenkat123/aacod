import { describe, expect, it } from "vitest";
import { BrewPackage } from "./homebrew";

describe("Test homebrew", () => {
  it("should pass", async () => {
    const brew_package = new BrewPackage({
      name: "git",
      update_homebrew: false,
      upgrade_all: false,
    });
    const res = await brew_package.safeInstall();
    expect(res.success).toBe(true);
    expect(res.error).toBeNull();
  });
});