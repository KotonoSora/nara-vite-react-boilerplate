import { describe, expect, it } from "vitest";

import { hashPassword } from "../hash-password";
import { verifyPassword } from "../verify-password";

describe("verifyPassword", () => {
  it("should return true for correct password", async () => {
    const password = "TestPassword123!";
    const hashed = await hashPassword(password);
    const result = await verifyPassword(password, hashed);
    expect(result).toBe(true);
    expect(typeof result).toBe("boolean");
    // Should not match for a different password
    const wrongResult = await verifyPassword("WrongPassword!", hashed);
    expect(wrongResult).toBe(false);
    expect(typeof wrongResult).toBe("boolean");
  });

  it("should return false for incorrect password", async () => {
    const password = "TestPassword123!";
    const hashed = await hashPassword(password);
    const result = await verifyPassword("WrongPassword!", hashed);
    expect(result).toBe(false);
    expect(typeof result).toBe("boolean");
  });

  it("should return false for empty password", async () => {
    const password = "TestPassword123!";
    const hashed = await hashPassword(password);
    const result = await verifyPassword("", hashed);
    expect(result).toBe(false);
    expect(typeof result).toBe("boolean");
  });

  it("should return false for empty hash", async () => {
    const password = "TestPassword123!";
    const result = await verifyPassword(password, "");
    expect(result).toBe(false);
    expect(typeof result).toBe("boolean");
  });
});
