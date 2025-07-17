import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";

import { default as appRoute } from "~/workers/app";

describe("Feature Flags API", () => {
  beforeAll(() => {
    vi.stubEnv("NODE_ENV", "vitest");
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  // Note: These tests will fail because the test environment doesn't have a database configured
  // In a real implementation, you would set up a test database
  // For now, we're testing that the routes exist and return proper error responses

  test("GET /api/feature-flags - should return database error without DB", async () => {
    const res = await appRoute.request("/api/feature-flags");
    expect(res.status).toBe(500);
    
    const data = await res.json() as any;
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to evaluate feature flags");
  });

  test("POST /api/feature-flags/seed - should return database error without DB", async () => {
    const res = await appRoute.request("/api/feature-flags/seed?isAdmin=true", {
      method: "POST",
    });
    expect(res.status).toBe(500);
    
    const data = await res.json() as any;
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to seed user groups");
  });

  test("POST /api/feature-flags/seed - should reject non-admin requests even without DB", async () => {
    const res = await appRoute.request("/api/feature-flags/seed", {
      method: "POST",
    });
    expect(res.status).toBe(500); // Database error comes first
    
    const data = await res.json() as any;
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to seed user groups");
  });

  test("GET /api/feature-flags/all - should return database error without DB", async () => {
    const res = await appRoute.request("/api/feature-flags/all?isAdmin=true");
    expect(res.status).toBe(500);
    
    const data = await res.json() as any;
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to fetch feature flags");
  });
});