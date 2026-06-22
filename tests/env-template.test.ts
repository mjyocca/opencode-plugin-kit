import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { resolveEnvTemplate } from "../src/lib/env-template";

let savedEnv: Record<string, string | undefined>;

beforeEach(() => {
  savedEnv = { ...process.env };
});

afterEach(() => {
  Object.keys(process.env).forEach((key) => {
    if (savedEnv[key] !== undefined) {
      process.env[key as keyof typeof process.env] = savedEnv[key] as string;
    } else {
      delete process.env[key as keyof typeof process.env];
    }
  });
});

describe("resolveEnvTemplate", () => {
  it("returns input unchanged when no template found", () => {
    expect(resolveEnvTemplate("literal-value")).toBe("literal-value");
  });

  it("returns input for empty string", () => {
    expect(resolveEnvTemplate("")).toBe("");
  });

  it("resolves valid template with env var set", () => {
    process.env.TEST_KEY = "test-value";
    expect(resolveEnvTemplate("{env:TEST_KEY}")).toBe("test-value");
  });

  it("resolves multiple templates in one string", () => {
    process.env.KEY1 = "val1";
    process.env.KEY2 = "val2";
    const result = resolveEnvTemplate("{env:KEY1} and {env:KEY2}");
    expect(result).toBe("val1 and val2");
  });

  it("returns null when env var is not set", () => {
    expect(resolveEnvTemplate("{env:NONEXISTENT_VAR}")).toBe(null);
  });

  it("returns null when env var allowlist is not present", () => {
    process.env.TEST_KEY = "test-value";
    expect(resolveEnvTemplate("{env:TEST_KEY}")).toBe("test-value");
  });
});
