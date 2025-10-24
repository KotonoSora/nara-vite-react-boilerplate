import { describe, expect, it } from "vitest";

import { getNestedValue } from "../get-nested-value";

describe("getNestedValue", () => {
  it("retrieves nested value using dot notation", () => {
    const obj = { user: { profile: { name: "John" } } } as any;
    const result = getNestedValue(obj, "user.profile.name");
    expect(result).toBe("John");
  });

  it("returns undefined for invalid path", () => {
    const obj = { user: { profile: { name: "John" } } } as any;
    const result = getNestedValue(obj, "user.invalid.path");
    expect(result).toBeUndefined();
  });

  it("handles single-level path", () => {
    const obj = { name: "John" } as any;
    const result = getNestedValue(obj, "name");
    expect(result).toBe("John");
  });

  it("returns undefined for non-existent key", () => {
    const obj = { user: { name: "John" } } as any;
    const result = getNestedValue(obj, "nonexistent");
    expect(result).toBeUndefined();
  });
});
