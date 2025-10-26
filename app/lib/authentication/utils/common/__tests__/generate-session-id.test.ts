import { describe, expect, it } from "vitest";

import { generateSessionId } from "../generate-session-id";

describe("generateSessionId", () => {
  it("should return a valid UUID string", () => {
    const id = generateSessionId();
    const pattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(typeof id).toBe("string");
    expect(id.length).toBe(36);
    expect(id).toMatch(pattern);
  });

  it("should generate unique IDs on subsequent calls", () => {
    const id1 = generateSessionId();
    const id2 = generateSessionId();
    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe("string");
    expect(typeof id2).toBe("string");
    expect(id1.length).toBe(36);
    expect(id2.length).toBe(36);
  });

  it("should return a string for empty call", () => {
    const id = generateSessionId();
    expect(typeof id).toBe("string");
    expect(id.length).toBe(36);
  });
});
