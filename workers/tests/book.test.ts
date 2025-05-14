import { describe, expect, test } from "vitest";

import { default as app } from "../app";

describe("book", () => {
  test("GET /api/book", async () => {
    const res = await app.request("/api/book");
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("List Books");
  });

  test("GET /api/book:id", async () => {
    const res = await app.request("/api/book/123");
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Get Book: 123");
  });

  test("POST /api/book", async () => {
    const res = await app.request("/api/book", {
      method: "POST",
    });
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Create Book");
  });

  test("POST /api/book with JSON body", async () => {
    const res = await app.request("/api/book", {
      method: "POST",
      body: JSON.stringify({ title: "New Book" }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Create Book");
  });

  test("POST /api/book with Request object", async () => {
    const req = new Request("http://localhost/api/book", {
      method: "POST",
    });
    const res = await app.request(req);
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Create Book");
  });
});
