import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { Hono } from "hono";

// Mock drizzle
vi.mock("drizzle-orm/d1", () => ({
  drizzle: vi.fn(() => ({
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn().mockResolvedValue([{ id: 1 }]),
        leftJoin: vi.fn().mockReturnValue([]),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn().mockResolvedValue(undefined),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn().mockResolvedValue(undefined),
    })),
    insert: vi.fn(() => ({
      values: vi.fn().mockResolvedValue(undefined),
    })),
  })),
}));

// Mock utility functions
vi.mock("~/features/landing-page/utils/get-page-information", () => ({
  getPageInformation: vi.fn(),
}));

vi.mock("~/features/landing-page/utils/get-showcases", () => ({
  getShowcases: vi.fn(),
}));

vi.mock("~/features/landing-page/utils/seed-showcase", () => ({
  seedShowcases: vi.fn(),
}));

// Mock database schema
vi.mock("~/database/schema/showcase", () => ({
  showcase: {
    id: "id",
    name: "name",
    description: "description",
    url: "url",
    image: "image",
  },
  showcaseTag: {
    id: "id",
    showcaseId: "showcaseId",
    tag: "tag",
  },
}));

// Import after mocking
import landingPageRoute from "~/workers/api/features/landing-page";
import { getPageInformation } from "~/features/landing-page/utils/get-page-information";
import { getShowcases } from "~/features/landing-page/utils/get-showcases";
import { seedShowcases } from "~/features/landing-page/utils/seed-showcase";
import { drizzle } from "drizzle-orm/d1";

// Get mocked functions
const mockGetPageInformation = vi.mocked(getPageInformation);
const mockGetShowcases = vi.mocked(getShowcases);
const mockSeedShowcases = vi.mocked(seedShowcases);
const mockDrizzle = vi.mocked(drizzle);

// Create a test app that provides proper environment context
function createTestApp() {
  const app = new Hono<{ Bindings: Env }>();
  
  // Add middleware to provide mock environment
  app.use("*", async (c, next) => {
    // Mock the environment
    c.env = { DB: {} } as any;
    await next();
  });
  
  // Mount the landing page routes
  app.route("/", landingPageRoute);
  
  return app;
}

function createTestAppWithoutDb() {
  const app = new Hono<{ Bindings: Env }>();
  
  // Add middleware to provide mock environment without DB
  app.use("*", async (c, next) => {
    c.env = {} as any; // No DB property
    await next();
  });
  
  // Mount the landing page routes
  app.route("/", landingPageRoute);
  
  return app;
}

describe("landing-page API routes", () => {
  let testApp: Hono;

  beforeAll(() => {
    vi.stubEnv("NODE_ENV", "vitest");
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    testApp = createTestApp();
  });

  describe("GET /", () => {
    test("should return page information and showcases successfully", async () => {
      const mockPageInfo = {
        title: "Test Title",
        description: "Test Description",
        githubRepository: "https://github.com/test/repo",
        commercialLink: "https://test.com",
      };

      const mockShowcases = [
        {
          id: 1,
          name: "Test Project",
          description: "Test Description",
          url: "https://test.com",
          tags: ["test"],
        },
      ];

      mockGetPageInformation.mockResolvedValue(mockPageInfo);
      mockGetShowcases.mockResolvedValue(mockShowcases);

      const req = new Request("http://localhost/", {
        method: "GET",
      });

      const res = await testApp.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({
        ...mockPageInfo,
        showcases: mockShowcases,
      });
    });

    test("should return 500 when database is not available", async () => {
      const appWithoutDb = createTestAppWithoutDb();

      const req = new Request("http://localhost/", {
        method: "GET",
      });

      const res = await appWithoutDb.request(req);

      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data).toEqual({
        success: false,
        error: "Database not available",
      });
    });

    test("should handle errors from utility functions", async () => {
      mockGetPageInformation.mockRejectedValue(new Error("Page info error"));

      const req = new Request("http://localhost/", {
        method: "GET",
      });

      const res = await testApp.request(req);

      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data).toEqual({
        success: false,
        error: "Unexpected server error",
      });
    });
  });

  describe("POST /showcase/seed", () => {
    test("should seed showcases successfully", async () => {
      mockSeedShowcases.mockResolvedValue(undefined);

      const req = new Request("http://localhost/showcase/seed", {
        method: "POST",
      });

      const res = await testApp.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({ success: true });
    });

    test("should return 500 when database is not available", async () => {
      const appWithoutDb = createTestAppWithoutDb();

      const req = new Request("http://localhost/showcase/seed", {
        method: "POST",
      });

      const res = await appWithoutDb.request(req);

      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data).toEqual({
        success: false,
        error: "Database not available",
      });
    });

    test("should handle seeding errors", async () => {
      mockSeedShowcases.mockRejectedValue(new Error("Seeding failed"));

      const req = new Request("http://localhost/showcase/seed", {
        method: "POST",
      });

      const res = await testApp.request(req);

      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data).toEqual({
        success: false,
        error: "Failed to seed showcases",
      });
    });
  });

  describe("PUT /showcase/:id", () => {
    const validShowcaseData = {
      name: "Updated Project",
      description: "Updated Description",
      url: "https://updated.com",
      image: "updated-image.jpg",
      tags: ["updated", "test"],
    };

    test("should update showcase successfully", async () => {
      const req = new Request("http://localhost/showcase/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validShowcaseData),
      });

      const res = await testApp.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({ success: true });
    });

    test("should return 400 for invalid ID", async () => {
      const req = new Request("http://localhost/showcase/invalid", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validShowcaseData),
      });

      const res = await testApp.request(req);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data).toEqual({ error: "Invalid ID" });
    });

    test("should return 400 for invalid request body", async () => {
      const invalidData = {
        name: "", // Invalid: empty string
        description: "Valid description",
        url: "not-a-url", // Invalid: not a URL
      };

      const req = new Request("http://localhost/showcase/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidData),
      });

      const res = await testApp.request(req);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data).toHaveProperty("error");
    });

    test("should return 404 when showcase not found", async () => {
      // Create a test app with a custom db mock for this test
      const appWithNoShowcase = new Hono<{ Bindings: Env }>();
      
      // Mock drizzle to return empty array for this test
      const customDrizzle = vi.fn(() => ({
        select: vi.fn(() => ({
          from: vi.fn(() => ({
            where: vi.fn().mockResolvedValue([]), // Empty array - no showcase found
            leftJoin: vi.fn().mockReturnValue([]),
          })),
        })),
        update: vi.fn(() => ({
          set: vi.fn(() => ({
            where: vi.fn().mockResolvedValue(undefined),
          })),
        })),
        delete: vi.fn(() => ({
          where: vi.fn().mockResolvedValue(undefined),
        })),
        insert: vi.fn(() => ({
          values: vi.fn().mockResolvedValue(undefined),
        })),
      }));

      appWithNoShowcase.use("*", async (c, next) => {
        c.env = { DB: {} } as any;
        // Override the drizzle function temporarily
        const originalDrizzle = vi.mocked(drizzle);
        originalDrizzle.mockImplementationOnce(customDrizzle);
        await next();
      });
      
      appWithNoShowcase.route("/", landingPageRoute);

      const req = new Request("http://localhost/showcase/999", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validShowcaseData),
      });

      const res = await appWithNoShowcase.request(req);

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data).toEqual({ error: "Showcase not found" });
    });

    test("should return 500 when database is not available", async () => {
      const appWithoutDb = createTestAppWithoutDb();

      const req = new Request("http://localhost/showcase/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validShowcaseData),
      });

      const res = await appWithoutDb.request(req);

      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data).toEqual({
        success: false,
        error: "Database not available",
      });
    });

    test("should handle database errors during update", async () => {
      // Create a test app with a custom db mock that throws an error
      const appWithDbError = new Hono<{ Bindings: Env }>();
      
      const errorDrizzle = vi.fn(() => ({
        select: vi.fn(() => ({
          from: vi.fn(() => ({
            where: vi.fn().mockResolvedValue([{ id: 1 }]), // Showcase exists
            leftJoin: vi.fn().mockReturnValue([]),
          })),
        })),
        update: vi.fn(() => ({
          set: vi.fn(() => ({
            where: vi.fn().mockRejectedValue(new Error("Database error")), // Throw error
          })),
        })),
        delete: vi.fn(() => ({
          where: vi.fn().mockResolvedValue(undefined),
        })),
        insert: vi.fn(() => ({
          values: vi.fn().mockResolvedValue(undefined),
        })),
      }));

      appWithDbError.use("*", async (c, next) => {
        c.env = { DB: {} } as any;
        // Override the drizzle function temporarily
        const originalDrizzle = vi.mocked(drizzle);
        originalDrizzle.mockImplementationOnce(errorDrizzle);
        await next();
      });
      
      appWithDbError.route("/", landingPageRoute);

      const req = new Request("http://localhost/showcase/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validShowcaseData),
      });

      const res = await appWithDbError.request(req);

      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data).toEqual({
        success: false,
        error: "Unexpected server error",
      });
    });

    test("should update showcase without tags", async () => {
      const dataWithoutTags = {
        name: "Updated Project",
        description: "Updated Description",
        url: "https://updated.com",
      };

      const req = new Request("http://localhost/showcase/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataWithoutTags),
      });

      const res = await testApp.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({ success: true });
    });

    test("should update showcase with empty tags array", async () => {
      const dataWithEmptyTags = {
        ...validShowcaseData,
        tags: [],
      };

      const req = new Request("http://localhost/showcase/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataWithEmptyTags),
      });

      const res = await testApp.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({ success: true });
    });
  });
});