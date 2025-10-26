import { describe, expect, it } from "vitest";

import { generatePasswordResetToken } from "../generate-password-reset-token";

describe("generatePasswordResetToken", () => {
  it("should return a string containing a UUID and a base-36 timestamp separated by a hyphen", () => {
    const token = generatePasswordResetToken();
    const pattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}-[a-z0-9]+$/i;
    expect(typeof token).toBe("string");
    expect(token).toMatch(pattern);
    const parts = token.split("-");
    expect(parts.length).toBe(6);
    expect(parts[5]).toMatch(/^[a-z0-9]+$/);
  });

  it("should generate unique tokens on subsequent calls", () => {
    const token1 = generatePasswordResetToken();
    const token2 = generatePasswordResetToken();
    expect(token1).not.toBe(token2);
    expect(typeof token1).toBe("string");
    expect(typeof token2).toBe("string");
    expect(token1.length).toBeGreaterThan(10);
    expect(token2.length).toBeGreaterThan(10);
  });

  it("should use the current timestamp in base-36", () => {
    const now = Date.now();
    const token = generatePasswordResetToken();
    const parts = token.split("-");
    expect(parts.length).toBe(6); // 5 parts for UUID, 1 for timestamp
    const base36Timestamp = parts[5];
    const parsed = parseInt(base36Timestamp, 36);
    expect(Math.abs(parsed - now)).toBeLessThan(1000); // within 1 second
    expect(typeof parsed).toBe("number");
    expect(parsed).toBeGreaterThan(0);
  });

  it("should return a string for empty call", () => {
    const token = generatePasswordResetToken();
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(10);
  });
});
