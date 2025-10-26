import { describe, expect, it } from "vitest";

import { getPasswordResetExpiry } from "../get-password-reset-expiry";

describe("getPasswordResetExpiry", () => {
  it("should return a date 1 hour in the future", () => {
    const now = new Date();
    const expiry = getPasswordResetExpiry();
    expect(expiry).toBeInstanceOf(Date);
    expect(expiry.getTime()).toBeGreaterThan(now.getTime());
    const diff = expiry.getTime() - now.getTime();
    const hours = diff / (1000 * 60 * 60);
    expect(hours).toBeGreaterThanOrEqual(0.99);
    expect(hours).toBeLessThanOrEqual(1.01);
  });

  it("should return a valid date object", () => {
    const expiry = getPasswordResetExpiry();
    expect(expiry).toBeInstanceOf(Date);
    expect(!isNaN(expiry.getTime())).toBe(true);
  });
});
