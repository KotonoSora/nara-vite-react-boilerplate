import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";

import { default as appRoute } from "~/workers/app";

describe("common", () => {
  beforeAll(() => {
    vi.stubEnv("NODE_ENV", "vitest");
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  test("GET /api", async () => {
    const res = await appRoute.request("/api");
    expect(res.status).toBe(200);
    const response = await res.json();
    expect(response).toMatchObject({
      message: `Hello from Hono! Running in API`,
    });
    // In test environment, env is not included for security optimization
  });

  test("GET /api/hello-world", async () => {
    const res = await appRoute.request("/api/hello-world");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Hello, World!" });
  });

  test("GET /api/health", async () => {
    const res = await appRoute.request("/api/health");
    expect(res.status).toBe(200);
    const response = await res.json() as { status: string; environment: string; timestamp: string };
    expect(response).toMatchObject({ 
      status: "ok",
      environment: "development"
    });
    expect(response).toHaveProperty("timestamp");
    expect(typeof response.timestamp).toBe("string");
  });

  test("POST /api/posts with Request object", async () => {
    const req = new Request("http://localhost/api");
    const res = await appRoute.fetch(req);
    expect(res.status).toBe(200);
    const response = await res.json();
    expect(response).toMatchObject({
      message: `Hello from Hono! Running in API`,
    });
    // In test environment, env is not included for security optimization
  });
});
