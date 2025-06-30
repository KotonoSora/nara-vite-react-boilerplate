import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";

import { default as appRoute } from "../app";

const MOCK_ENV = {
  LANDING_PAGE_TITLE: "Test Title",
  LANDING_PAGE_DESCRIPTION: "Test Description",
  LANDING_PAGE_REPOSITORY: "https://github.com/test/repo",
  LANDING_PAGE_COMMERCIAL_LINK: "https://gumroad.com/test",
  DB: {} as any, // will stub this below
};

// Mock drizzle and db query result
const mockRows = [
  {
    id: 1,
    name: "Test Project",
    description: "Description",
    url: "https://example.com",
    image: "/test.png",
    tag: "SaaS",
  },
  {
    id: 1,
    name: "Test Project",
    description: "Description",
    url: "https://example.com",
    image: "/test.png",
    tag: "Open Source",
  },
  {
    id: 2,
    name: "Another App",
    description: "More stuff",
    url: "https://another.com",
    image: "/another.png",
    tag: null,
  },
];

const mockSelect = vi.fn().mockReturnThis();
const mockFrom = vi.fn().mockReturnThis();
const mockJoin = vi.fn().mockResolvedValue(mockRows);

describe("landing-page", () => {
  beforeAll(() => {
    vi.stubEnv("NODE_ENV", "vitest");
  });

  afterAll(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  test("GET /api/landing-page returns expected page info with showcases", async () => {
    vi.mock("drizzle-orm/d1", async () => {
      const actual =
        await vi.importActual<typeof import("drizzle-orm/d1")>(
          "drizzle-orm/d1",
        );
      return {
        ...actual,
        drizzle: vi.fn(() => ({
          select: mockSelect,
          from: mockFrom,
          leftJoin: mockJoin,
        })),
      };
    });

    const response = await appRoute.request("/api/landing-page", {}, MOCK_ENV);

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data).toMatchObject({
      title: "Test Title",
      description: "Test Description",
      githubRepository: "https://github.com/test/repo",
      commercialLink: "https://gumroad.com/test",
      showcases: [
        {
          id: 1,
          name: "Test Project",
          description: "Description",
          url: "https://example.com",
          image: "/test.png",
          tags: ["SaaS", "Open Source"],
        },
        {
          id: 2,
          name: "Another App",
          description: "More stuff",
          url: "https://another.com",
          image: "/another.png",
          tags: [],
        },
      ],
    });
  });
});
