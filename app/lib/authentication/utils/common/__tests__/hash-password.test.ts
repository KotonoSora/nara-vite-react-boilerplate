import { describe, expect, it } from "vitest";

import { hashPassword } from "../hash-password";

describe("hashPassword", () => {
  it("should return a SHA-256 hash of the password", async () => {
    const password = "TestPassword123!";
    const hash = await hashPassword(password);
    expect(typeof hash).toBe("string");
    expect(hash.length).toBe(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    // Check that hash is not the same as the password
    expect(hash).not.toBe(password);
    // Check that hash is deterministic
    const hashAgain = await hashPassword(password);
    expect(hash).toBe(hashAgain);
  });

  it("should return the same hash for the same password", async () => {
    const password = "TestPassword123!";
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);
    expect(hash1).toBe(hash2);
    expect(typeof hash1).toBe("string");
    expect(typeof hash2).toBe("string");
    expect(hash1.length).toBe(64);
    expect(hash2.length).toBe(64);
  });

  it("should return a hash for empty password", async () => {
    const hash = await hashPassword("");
    expect(typeof hash).toBe("string");
    expect(hash.length).toBe(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });
});
