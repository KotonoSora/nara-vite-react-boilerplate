import { describe, expect, test } from "vitest";

import { default as app } from "../app";

describe("post", () => {
  test("GET /api/posts", async () => {
    const res = await app.request("/api/posts");
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Many posts");
  });

  test("POST /api/posts", async () => {
    const res = await app.request("/api/posts", {
      method: "POST",
    });
    expect(res.status).toBe(201);
    expect(res.headers.get("X-Custom")).toBe("Thank you");
    expect(await res.json()).toEqual({
      message: "Created",
    });
  });

  test("POST /api/posts", async () => {
    const res = await app.request("/api/posts", {
      method: "POST",
      body: JSON.stringify({ message: "hello hono" }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    expect(res.status).toBe(201);
    expect(res.headers.get("X-Custom")).toBe("Thank you");
    expect(await res.json()).toEqual({
      message: "Created",
    });
  });

  test("POST /api/posts", async () => {
    const formData = new FormData();
    formData.append("message", "hello");
    const res = await app.request("/api/posts", {
      method: "POST",
      body: formData,
    });
    expect(res.status).toBe(201);
    expect(res.headers.get("X-Custom")).toBe("Thank you");
    expect(await res.json()).toEqual({
      message: "Created",
    });
  });

  test("POST /api/posts with Request object", async () => {
    const req = new Request("http://localhost/api/posts", {
      method: "POST",
    });
    const res = await app.request(req);
    expect(res.status).toBe(201);
    expect(res.headers.get("X-Custom")).toBe("Thank you");
    expect(await res.json()).toEqual({
      message: "Created",
    });
  });
});
