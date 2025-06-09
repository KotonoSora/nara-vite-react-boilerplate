import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";

import { default as appRoute } from "../app";

const MOCK_ENV = {
  VALUE_FROM_CLOUDFLARE: "test value",
};

describe("common", () => {
  beforeAll(() => {
    vi.stubEnv("NODE_ENV", "vitest");
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  test("GET /api", async () => {
    const res = await appRoute.request("/api", {}, MOCK_ENV);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      message: `Hello from Hono! Running in API`,
      env: MOCK_ENV.VALUE_FROM_CLOUDFLARE,
    });
  });

  test("GET /api/hello-world", async () => {
    const res = await appRoute.request("/api/hello-world");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Hello, World!" });
  });

  test("GET /api/health", async () => {
    const res = await appRoute.request("/api/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });

  test("POST /api/posts with Request object", async () => {
    const req = new Request("http://localhost/api");
    const res = await appRoute.fetch(req, MOCK_ENV);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      message: `Hello from Hono! Running in API`,
      env: MOCK_ENV.VALUE_FROM_CLOUDFLARE,
    });
  });
});
