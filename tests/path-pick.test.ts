import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { pickFirstExisting } from "../src/lib/path-pick";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

let tmpDir = "";

beforeEach(() => {
  tmpDir = join(process.env.TMPDIR || "/tmp", "path-pick-test-" + Date.now());
});

afterEach(() => {
  if (tmpDir) {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

describe("pickFirstExisting", () => {
  it("returns first existing path", () => {
    mkdirSync(tmpDir, { recursive: true });
    const tempFile = join(tmpDir, "exists.json");
    writeFileSync(tempFile, "test");
    const tempNonExistent = join(tmpDir, "does-not-exist.json");

    const result = pickFirstExisting([tempNonExistent, tempFile]);
    expect(result).toBe(tempFile);
  });

  it("returns undefined for all non-existing paths", () => {
    const result = pickFirstExisting([
      join(tmpDir, "nonexistent1.json"),
      join(tmpDir, "nonexistent2.json"),
    ]);
    expect(result).toBeUndefined();
  });

  it("handles empty array", () => {
    const result = pickFirstExisting([]);
    expect(result).toBeUndefined();
  });

  it("handles null/undefined array", () => {
    expect(pickFirstExisting([])).toBeUndefined();
  });
});
