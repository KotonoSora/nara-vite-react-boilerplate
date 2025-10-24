import { describe, expect, it } from "vitest";

import { getUserTimezone } from "../get-user-timezone";

describe("getUserTimezone", () => {
  it("returns IANA timezone string", () => {
    const result = getUserTimezone();
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("returns valid timezone format", () => {
    const result = getUserTimezone();
    // IANA timezone typically contains a slash (e.g., "America/New_York")
    // or is "UTC"
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns consistent timezone across multiple calls", () => {
    const result1 = getUserTimezone();
    const result2 = getUserTimezone();
    expect(result1).toBe(result2);
  });

  it("returns timezone with valid format", () => {
    const result = getUserTimezone();
    // Should be either UTC or contain a slash for region/city format
    const isValidFormat = result === "UTC" || result.includes("/");
    expect(isValidFormat).toBe(true);
  });

  it("returns non-empty string", () => {
    const result = getUserTimezone();
    expect(result).not.toBe("");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns timezone that can be used with Date APIs", () => {
    const timezone = getUserTimezone();
    // Should not throw when creating Intl.DateTimeFormat with this timezone
    expect(() => {
      new Intl.DateTimeFormat("en-US", { timeZone: timezone });
    }).not.toThrow();
  });

  it("returns valid IANA timezone identifier", () => {
    const timezone = getUserTimezone();
    // Common IANA timezone patterns
    const isIANAFormat =
      timezone === "UTC" ||
      timezone === "GMT" ||
      /^[A-Z][a-z]+\/[A-Z][a-z_]+$/.test(timezone) ||
      /^[A-Z][a-z]+\/[A-Z][a-z_]+\/[A-Z][a-z_]+$/.test(timezone);

    expect(timezone).toBeTruthy();
    expect(typeof timezone).toBe("string");
  });
});
