import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";

import landingPageRoute from "~/workers/api/features/landing-page";

// Mock the database and utility functions
vi.mock("~/features/landing-page/utils/get-page-information", () => ({
  getPageInformation: vi.fn(() => 
    Promise.resolve({
      title: "NARA Boilerplate - Production-Ready React Starter",
      description: "Fast, opinionated starter template for building full-stack React apps with modern tooling and Cloudflare Workers deployment.",
      githubRepository: "https://github.com/KotonoSora/nara-vite-react-boilerplate",
      commercialLink: undefined,
    })
  ),
}));

vi.mock("~/features/landing-page/utils/get-showcases", () => ({
  getShowcases: vi.fn(() => Promise.resolve([])),
}));

vi.mock("~/features/landing-page/utils/seed-showcase", () => ({
  seedShowcases: vi.fn(() => Promise.resolve()),
}));

vi.mock("drizzle-orm/d1", () => ({
  drizzle: vi.fn(() => ({
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => Promise.resolve([{ id: 1, name: "Test", description: "Test", url: "https://test.com" }])),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => Promise.resolve()),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn(() => Promise.resolve()),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => Promise.resolve()),
    })),
  })),
}));

describe("landing-page worker feature", () => {
  beforeAll(() => {
    vi.stubEnv("NODE_ENV", "vitest");
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  test("GET / returns page information and showcases", async () => {
    // Create a mock context with required DB
    const mockContext = {
      env: { DB: {} },
      json: vi.fn((data, status) => new Response(JSON.stringify(data), { status: status || 200 })),
    };

    const res = await landingPageRoute.request("/", {
      headers: { "Content-Type": "application/json" },
    }, mockContext.env);
    
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data).toHaveProperty("title");
    expect(data).toHaveProperty("description");
    expect(data).toHaveProperty("githubRepository");
    expect(data).toHaveProperty("showcases");
    
    // Check default values are used
    expect(data.title).toBe("NARA Boilerplate - Production-Ready React Starter");
    expect(data.description).toBe("Fast, opinionated starter template for building full-stack React apps with modern tooling and Cloudflare Workers deployment.");
    expect(data.githubRepository).toBe("https://github.com/KotonoSora/nara-vite-react-boilerplate");
    expect(Array.isArray(data.showcases)).toBe(true);
  });

  test("GET / with custom env vars", async () => {
    const { getPageInformation } = await import("~/features/landing-page/utils/get-page-information");
    
    // Mock custom values
    vi.mocked(getPageInformation).mockResolvedValueOnce({
      title: "Custom Title",
      description: "Custom Description",
      githubRepository: "https://github.com/custom/repo",
      commercialLink: "https://custom.com",
    });

    const mockContext = {
      env: { 
        DB: {},
        LANDING_PAGE_TITLE: "Custom Title",
        LANDING_PAGE_DESCRIPTION: "Custom Description",
        LANDING_PAGE_REPOSITORY: "https://github.com/custom/repo",
        LANDING_PAGE_COMMERCIAL_LINK: "https://custom.com"
      },
    };

    const res = await landingPageRoute.request("/", {
      headers: { "Content-Type": "application/json" },
    }, mockContext.env);
    
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data.title).toBe("Custom Title");
    expect(data.description).toBe("Custom Description");
    expect(data.githubRepository).toBe("https://github.com/custom/repo");
    expect(data.commercialLink).toBe("https://custom.com");
  });

  test("POST /showcase/seed succeeds", async () => {
    const mockContext = {
      env: { DB: {} },
    };

    const res = await landingPageRoute.request("/showcase/seed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }, mockContext.env);
    
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data).toEqual({ success: true });
  });

  test("PUT /showcase/:id with valid data", async () => {
    const showcaseData = {
      name: "Test Showcase",
      description: "Test Description", 
      url: "https://test.com",
      image: "https://test.com/image.jpg",
      tags: ["test", "showcase"]
    };

    const mockContext = {
      env: { DB: {} },
    };

    const res = await landingPageRoute.request("/showcase/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(showcaseData),
    }, mockContext.env);
    
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data).toEqual({ success: true });
  });

  test("PUT /showcase/:id with invalid ID", async () => {
    const showcaseData = {
      name: "Test Showcase",
      description: "Test Description",
      url: "https://test.com",
    };

    const mockContext = {
      env: { DB: {} },
    };

    const res = await landingPageRoute.request("/showcase/invalid", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(showcaseData),
    }, mockContext.env);
    
    expect(res.status).toBe(400);
    
    const data = await res.json();
    expect(data).toHaveProperty("error");
    expect(data.error).toBe("Invalid ID");
  });

  test("PUT /showcase/:id with invalid data", async () => {
    const invalidData = {
      name: "", // Invalid: empty name
      description: "Test Description",
      url: "not-a-url", // Invalid: not a proper URL
    };

    const mockContext = {
      env: { DB: {} },
    };

    const res = await landingPageRoute.request("/showcase/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidData),
    }, mockContext.env);
    
    expect(res.status).toBe(400);
    
    const data = await res.json();
    expect(data).toHaveProperty("error");
  });

  test("PUT /showcase/:id with non-existent ID", async () => {
    // Create a new mock for this test that returns empty results
    const mockDb = {
      select: vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn(() => Promise.resolve([])), // Empty result for non-existent ID
        })),
      })),
      update: vi.fn(() => ({
        set: vi.fn(() => ({
          where: vi.fn(() => Promise.resolve()),
        })),
      })),
      delete: vi.fn(() => ({
        where: vi.fn(() => Promise.resolve()),
      })),
      insert: vi.fn(() => ({
        values: vi.fn(() => Promise.resolve()),
      })),
    };

    // Mock drizzle to return our custom mock for this test
    const { drizzle } = await import("drizzle-orm/d1");
    vi.mocked(drizzle).mockReturnValueOnce(mockDb as any);

    const showcaseData = {
      name: "Test Showcase",
      description: "Test Description",
      url: "https://test.com",
    };

    const mockContext = {
      env: { DB: {} },
    };

    const res = await landingPageRoute.request("/showcase/999", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(showcaseData),
    }, mockContext.env);
    
    expect(res.status).toBe(404);
    
    const data = await res.json();
    expect(data).toHaveProperty("error");
    expect(data.error).toBe("Showcase not found");
  });

  test("GET / handles database error gracefully", async () => {
    const { getShowcases } = await import("~/features/landing-page/utils/get-showcases");
    
    // Mock database error
    vi.mocked(getShowcases).mockRejectedValueOnce(new Error("Database connection failed"));

    const mockContext = {
      env: { DB: {} },
    };

    const res = await landingPageRoute.request("/", {
      headers: { "Content-Type": "application/json" },
    }, mockContext.env);
    
    expect(res.status).toBe(500);
    
    const data = await res.json();
    expect(data).toHaveProperty("success", false);
    expect(data).toHaveProperty("error", "Unexpected server error");
  });

  test("POST /showcase/seed handles database error", async () => {
    const { seedShowcases } = await import("~/features/landing-page/utils/seed-showcase");
    
    // Mock database error
    vi.mocked(seedShowcases).mockRejectedValueOnce(new Error("Seeding failed"));

    const mockContext = {
      env: { DB: {} },
    };

    const res = await landingPageRoute.request("/showcase/seed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }, mockContext.env);
    
    expect(res.status).toBe(500);
    
    const data = await res.json();
    expect(data).toEqual({ success: false, error: "Failed to seed showcases" });
  });

  test("GET / handles missing database", async () => {
    const mockContext = {
      env: {}, // No DB property
    };

    const res = await landingPageRoute.request("/", {
      headers: { "Content-Type": "application/json" },
    }, mockContext.env);
    
    expect(res.status).toBe(500);
    
    const data = await res.json();
    expect(data).toEqual({ success: false, error: "Database not available" });
  });
});