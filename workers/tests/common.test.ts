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
    const json = (await res.json()) as any;
    expect(json.success).toBe(true);
    expect(json.data).toMatchObject({
      message: "NARA Boilerplate API",
      version: "1.0.0",
      environment: "test",
    });
    expect(json.data.requestId).toBeDefined();
    expect(json.data.timestamp).toBeDefined();
  });

  test("GET /api/hello-world", async () => {
    const res = await appRoute.request("/api/hello-world");
    expect(res.status).toBe(200);
    const json = (await res.json()) as any;
    expect(json.success).toBe(true);
    expect(json.data.message).toBe("Hello, World!");
    expect(json.data.requestId).toBeDefined();
  });

  test("GET /api/health", async () => {
    const res = await appRoute.request("/api/health");
    expect(res.status).toBe(200);
    const json = (await res.json()) as any;
    expect(json.success).toBe(true);
    expect(json.data.status).toBe("healthy");
    expect(json.data.checks).toMatchObject({
      database: "operational",
      api: "operational",
      middleware: "operational",
    });
    expect(json.data.requestId).toBeDefined();
    expect(json.data.timestamp).toBeDefined();
  });

  test("POST /api/posts with Request object", async () => {
    const req = new Request("http://localhost/api");
    const res = await appRoute.fetch(req);
    expect(res.status).toBe(200);
    const json = (await res.json()) as any;
    expect(json.success).toBe(true);
    expect(json.data).toMatchObject({
      message: "NARA Boilerplate API",
      version: "1.0.0",
      environment: "test",
    });
    expect(json.data.requestId).toBeDefined();
    expect(json.data.timestamp).toBeDefined();
  });
});
