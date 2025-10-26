import { describe, expect, it } from "vitest";

import { getSessionExpiry } from "../get-session-expiry";

describe("getSessionExpiry", () => {
  it("should return a date 30 days in the future", () => {
    const now = new Date();
    const expiry = getSessionExpiry();
    expect(expiry).toBeInstanceOf(Date);
    expect(expiry.getTime()).toBeGreaterThan(now.getTime());
    const diff = expiry.getTime() - now.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    expect(days).toBeGreaterThanOrEqual(29.99);
    expect(days).toBeLessThanOrEqual(30.01);
  });

  it("should return a valid date object", () => {
    const expiry = getSessionExpiry();
    expect(expiry).toBeInstanceOf(Date);
    expect(!isNaN(expiry.getTime())).toBe(true);
  });
});
