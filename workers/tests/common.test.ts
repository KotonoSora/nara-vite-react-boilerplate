import { describe, expect, test } from "vitest";

import { default as app } from "../app";

const MOCK_ENV = {
  VALUE_FROM_CLOUDFLARE: "test value",
};

describe("common", () => {
  test("GET /api", async () => {
    const res = await app.request("/api", {}, MOCK_ENV);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      message: `Hello from Hono! Running in API`,
      env: MOCK_ENV.VALUE_FROM_CLOUDFLARE,
    });
  });

  test("GET /api/hello-world", async () => {
    const res = await app.request("/api/hello-world");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Hello, World!" });
  });

  test("GET /api/health", async () => {
    const res = await app.request("/api/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });

  test("POST /api/posts with Request object", async () => {
    const req = new Request("http://localhost/api");
    const res = await app.fetch(req, MOCK_ENV);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      message: `Hello from Hono! Running in API`,
      env: MOCK_ENV.VALUE_FROM_CLOUDFLARE,
    });
  });
});
