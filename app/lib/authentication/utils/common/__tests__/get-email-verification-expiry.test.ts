import { describe, expect, it } from "vitest";

import { getEmailVerificationExpiry } from "../get-email-verification-expiry";

describe("getEmailVerificationExpiry", () => {
  it("should return a date 24 hours in the future", () => {
    const now = new Date();
    const expiry = getEmailVerificationExpiry();
    expect(expiry).toBeInstanceOf(Date);
    expect(expiry.getTime()).toBeGreaterThan(now.getTime());
    const diff = expiry.getTime() - now.getTime();
    const hours = diff / (1000 * 60 * 60);
    expect(hours).toBeGreaterThanOrEqual(23.99);
    expect(hours).toBeLessThanOrEqual(24.01);
  });

  it("should return a valid date object", () => {
    const expiry = getEmailVerificationExpiry();
    expect(expiry).toBeInstanceOf(Date);
    expect(!isNaN(expiry.getTime())).toBe(true);
  });
});
