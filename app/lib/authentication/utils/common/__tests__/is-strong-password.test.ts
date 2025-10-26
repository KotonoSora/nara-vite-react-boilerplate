import { describe, expect, it } from "vitest";

import { isStrongPassword } from "../is-strong-password";

describe("isStrongPassword", () => {
  it("should validate a strong password", () => {
    const result = isStrongPassword("Str0ng!Password");
    expect(result.isValid).toBe(true);
    expect(typeof result.isValid).toBe("boolean");
    expect(result.requirements).toBeDefined();
    expect(Object.values(result.requirements).every(Boolean)).toBe(true);
    expect(result.requirements).toStrictEqual({
      hasUppercase: true,
      hasLowercase: true,
      hasNumber: true,
      hasSpecialChar: true,
      minLength: true,
    });
  });

  it("should fail if missing uppercase", () => {
    const result = isStrongPassword("str0ng!password");
    expect(result.isValid).toBe(false);
    expect(typeof result.isValid).toBe("boolean");
    expect(result.requirements.hasUppercase).toBe(false);
    expect(result.requirements.hasLowercase).toBe(true);
    expect(result.requirements.hasNumber).toBe(true);
    expect(result.requirements.hasSpecialChar).toBe(true);
    expect(result.requirements.minLength).toBe(true);
  });

  it("should fail if missing lowercase", () => {
    const result = isStrongPassword("STR0NG!PASSWORD");
    expect(result.isValid).toBe(false);
    expect(typeof result.isValid).toBe("boolean");
    expect(result.requirements.hasLowercase).toBe(false);
    expect(result.requirements.hasUppercase).toBe(true);
    expect(result.requirements.hasNumber).toBe(true);
    expect(result.requirements.hasSpecialChar).toBe(true);
    expect(result.requirements.minLength).toBe(true);
  });

  it("should fail if missing number", () => {
    const result = isStrongPassword("Strong!Password");
    expect(result.isValid).toBe(false);
    expect(typeof result.isValid).toBe("boolean");
    expect(result.requirements.hasNumber).toBe(false);
    expect(result.requirements.hasUppercase).toBe(true);
    expect(result.requirements.hasLowercase).toBe(true);
    expect(result.requirements.hasSpecialChar).toBe(true);
    expect(result.requirements.minLength).toBe(true);
  });

  it("should fail if missing special character", () => {
    const result = isStrongPassword("Str0ngPassword");
    expect(result.isValid).toBe(false);
    expect(typeof result.isValid).toBe("boolean");
    expect(result.requirements.hasSpecialChar).toBe(false);
    expect(result.requirements.hasUppercase).toBe(true);
    expect(result.requirements.hasLowercase).toBe(true);
    expect(result.requirements.hasNumber).toBe(true);
    expect(result.requirements.minLength).toBe(true);
  });

  it("should fail if too short", () => {
    const result = isStrongPassword("S0!a");
    expect(result.isValid).toBe(false);
    expect(typeof result.isValid).toBe("boolean");
    expect(result.requirements.minLength).toBe(false);
    // Other requirements may still be true
    expect(result.requirements.hasUppercase).toBe(true);
    expect(result.requirements.hasLowercase).toBe(true);
    expect(result.requirements.hasNumber).toBe(true);
    expect(result.requirements.hasSpecialChar).toBe(true);
  });

  it("should fail for empty password", () => {
    const result = isStrongPassword("");
    expect(result.isValid).toBe(false);
    expect(typeof result.isValid).toBe("boolean");
    expect(result.requirements.minLength).toBe(false);
    expect(result.requirements.hasUppercase).toBe(false);
    expect(result.requirements.hasLowercase).toBe(false);
    expect(result.requirements.hasNumber).toBe(false);
    expect(result.requirements.hasSpecialChar).toBe(false);
  });
});
