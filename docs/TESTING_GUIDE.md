# Testing Guide

This guide covers testing strategies, patterns, and best practices for the NARA boilerplate, including unit tests, integration tests, and end-to-end testing.

## Table of Contents

- [🧪 Testing Overview](#-testing-overview)
- [🏗 Testing Architecture](#-testing-architecture)
- [🔧 Unit Testing](#-unit-testing)
- [🧩 Component Testing](#-component-testing)
- [🔌 API Testing](#-api-testing)
- [🗄 Database Testing](#-database-testing)
- [🎭 End-to-End Testing](#-end-to-end-testing)
- [📊 Test Coverage and Reports](#-test-coverage-and-reports)
- [🛠 Testing Best Practices](#-testing-best-practices)
- [🔍 Debugging Tests](#-debugging-tests)
- [⚡ Performance Testing](#-performance-testing)
- [🚀 Continuous Integration](#-continuous-integration)

---

## 🧪 Testing Overview

> **📋 Quick Reference**
>
> **Essential Commands:**
>
> - `bun test` - Run all tests
> - `bun test --watch` - Watch mode
> - `bun test --ui` - Interactive UI
> - `bun run coverage` - Generate coverage report
> - `bun test <pattern>` - Run specific tests
>
> **Test Types:** Unit (many) → Integration (some) → E2E (few)  
> **When to use:** Component changed → Write test → Refactor → Verify  
> **Common Issues:** Tests fail → [Troubleshooting Guide](./TROUBLESHOOTING.md#testing-issues)  
> **Difficulty:** 🟡 Intermediate | **Time:** 45 min to learn basics

The NARA boilerplate uses **Vitest** as the primary testing framework with Cloudflare Workers testing utilities:

- **Vitest** - Fast unit testing framework
- **@cloudflare/vitest-pool-workers** - Cloudflare Workers test environment
- **React Testing Library** - Component testing utilities
- **MSW** - API mocking for frontend tests

### Test Configuration

```typescript
// vitest.config.ts
import path from "node:path";

import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig({
  resolve: {
    alias: {
      "~/workers": path.resolve(__dirname, "./workers/"),
      "~/database": path.resolve(__dirname, "./database/"),
      "~": path.resolve(__dirname, "./app/"),
    },
  },
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: "./wrangler.jsonc" },
      },
    },
    coverage: {
      provider: "istanbul",
      include: ["app/routes/**", "workers/api/**"],
      reporter: ["text", "html", "json"],
      exclude: [
        "node_modules/**",
        "drizzle/**",
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/test-utils.ts",
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
```

### Test Dependencies

The project includes these testing dependencies:

- **vitest 3.2.4** - Fast unit testing framework
- **@cloudflare/vitest-pool-workers 0.8.55** - Cloudflare Workers test environment
- **@vitest/coverage-istanbul 3.2.4** - Code coverage provider
- **@vitest/ui 3.2.4** - Interactive testing UI
- **@testing-library/react** - Component testing utilities (when added)
- **MSW** - API mocking for frontend tests (when added)

---

## 🏗 Testing Architecture

### Testing Pyramid

```text
    /\
   /  \    E2E Tests (Few)
  /    \   - Critical user journeys
 /______\  - Browser automation
/        \
|        | Integration Tests (Some)
|        | - API endpoints
|        | - Database operations
|________| - Component integration
|        |
|        | Unit Tests (Many)
|        | - Pure functions
|        | - Components
|________| - Business logic
```

### Test Categories

1. **Unit Tests** - Test individual functions and components
2. **Integration Tests** - Test interaction between modules
3. **API Tests** - Test HTTP endpoints
4. **Component Tests** - Test React components
5. **E2E Tests** - Test complete user flows

---

## 🔧 Unit Testing

### Testing Utilities

```typescript
// lib/test-utils.ts
import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router'

// Custom render function with React Router v7 providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
  route?: string
}

const createTestRouter = (initialEntries = ['/']) => {
  return createMemoryRouter(
    [
      {
        path: "*",
        element: <div data-testid="test-route">Test Route</div>,
      },
    ],
    {
      initialEntries,
    }
  )
}

const AllTheProviders = ({
  children,
  initialEntries = ['/']
}: {
  children: React.ReactNode
  initialEntries?: string[]
}) => {
  const router = createTestRouter(initialEntries)

  return (
    <RouterProvider router={router}>
      {children}
    </RouterProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  const { initialEntries, ...renderOptions } = options || {}

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders initialEntries={initialEntries}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions
  })
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Helper functions
export const renderWithRouter = (
  ui: ReactElement,
  initialEntries = ['/']
) => {
  return customRender(ui, { initialEntries })
}

// Mock functions
export const createMockFetch = (responses: Record<string, any>) => {
  return vi.fn().mockImplementation((url: string) => {
    const response = responses[url]
    if (!response) {
      return Promise.reject(new Error(`No mock response for ${url}`))
    }

    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
    })
  })
}

export { customRender as render }
```

### Testing Pure Functions

```typescript
// lib/utils.test.ts
import { describe, expect, it } from "vitest";

import { cn, formatDate, validateEmail } from "./utils";

describe("Utils", () => {
  describe("cn (className merge)", () => {
    it("merges class names correctly", () => {
      expect(cn("base", "extra")).toBe("base extra");
      expect(cn("base", undefined, "extra")).toBe("base extra");
      expect(cn("px-4", "px-2")).toBe("px-2"); // Tailwind merge
    });
  });

  describe("formatDate", () => {
    it("formats dates correctly", () => {
      const date = new Date("2024-01-15T10:30:00Z");
      expect(formatDate(date)).toBe("January 15, 2024");
      expect(formatDate(date, "short")).toBe("Jan 15, 2024");
    });

    it("handles invalid dates", () => {
      expect(formatDate(null)).toBe("Invalid Date");
      expect(formatDate(undefined)).toBe("Invalid Date");
    });
  });

  describe("validateEmail", () => {
    it("validates correct emails", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user.name+tag@domain.co.uk")).toBe(true);
    });

    it("rejects invalid emails", () => {
      expect(validateEmail("invalid")).toBe(false);
      expect(validateEmail("test@")).toBe(false);
      expect(validateEmail("@domain.com")).toBe(false);
    });
  });
});
```

### Testing React Hooks

```typescript
// hooks/use-mobile.test.ts
import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { useMobile } from "./use-mobile";

// Mock matchMedia
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

describe("useMobile", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns true for mobile viewport", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useMobile());
    expect(result.current).toBe(true);
  });

  it("returns false for desktop viewport", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useMobile());
    expect(result.current).toBe(false);
  });
});
```

---

## 🧩 Component Testing

### Testing UI Components

```typescript
// components/ui/button.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '~/lib/test-utils'
import { Button } from './button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-destructive')
  })

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:pointer-events-none')
  })

  it('renders as different elements', () => {
    render(<Button asChild><a href="/test">Link</a></Button>)
    expect(screen.getByRole('link')).toBeInTheDocument()
  })
})
```

### Testing Complex Components

```typescript
// features/landing-page/components/user-card.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '~/lib/test-utils'
import { UserCard } from './user-card'

const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user' as const,
  avatar: 'https://example.com/avatar.jpg',
  createdAt: new Date('2024-01-01'),
}

describe('UserCard', () => {
  it('displays user information', () => {
    render(<UserCard user={mockUser} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('user')).toBeInTheDocument()
  })

  it('shows actions when showActions is true', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()

    render(
      <UserCard
        user={mockUser}
        showActions
        onEdit={onEdit}
        onDelete={onDelete}
      />
    )

    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn()

    render(<UserCard user={mockUser} showActions onEdit={onEdit} />)

    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(onEdit).toHaveBeenCalledWith(mockUser.id)
  })

  it('shows confirmation dialog before delete', async () => {
    const onDelete = vi.fn()

    render(<UserCard user={mockUser} showActions onDelete={onDelete} />)

    fireEvent.click(screen.getByRole('button', { name: /delete/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /confirm/i }))

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith(mockUser.id)
    })
  })

  it('renders loading state', () => {
    render(<UserCard user={mockUser} loading />)

    expect(screen.getByTestId('user-card-skeleton')).toBeInTheDocument()
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
  })
})
```

### Testing Forms

```typescript
// components/forms/user-form.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '~/lib/test-utils'
import { UserForm } from './user-form'

describe('UserForm', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form fields', () => {
    render(<UserForm {...defaultProps} />)

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(<UserForm {...defaultProps} />)

    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })

    expect(defaultProps.onSubmit).not.toHaveBeenCalled()
  })

  it('validates email format', async () => {
    render(<UserForm {...defaultProps} />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' }
    })

    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument()
    })
  })

  it('submits valid form data', async () => {
    render(<UserForm {...defaultProps} />)

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' }
    })

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    })

    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com'
      })
    })
  })

  it('populates form with initial data', () => {
    const initialData = {
      name: 'Jane Doe',
      email: 'jane@example.com'
    }

    render(<UserForm {...defaultProps} initialData={initialData} />)

    expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument()
  })
})
```

---

## 🔌 API Testing

### Testing Cloudflare Workers with Actual Project Examples

```typescript
// workers/tests/api.test.ts
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";

import { default as appRoute } from "~/workers/app";

describe("API Routes", () => {
  beforeAll(() => {
    vi.stubEnv("NODE_ENV", "test");
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  describe("/api", () => {
    test("GET /api returns welcome message", async () => {
      const res = await appRoute.request("/api");

      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data).toEqual({
        message: "Hello from Hono! Running in API",
        env: expect.any(Object),
      });
    });
  });

  describe("/api/hello-world", () => {
    test("GET /api/hello-world returns hello message", async () => {
      const res = await appRoute.request("/api/hello-world");

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        message: "Hello, World!",
      });
    });
  });

  describe("/api/health", () => {
    test("GET /api/health returns health status", async () => {
      const res = await appRoute.request("/api/health");

      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data).toHaveProperty("status");
      expect(data).toHaveProperty("timestamp");
      expect(data.status).toBe("ok");
    });
  });

  describe("Error Handling", () => {
    test("handles 404 for non-existent routes", async () => {
      const res = await appRoute.request("/api/non-existent");

      expect(res.status).toBe(404);
    });

    test("handles invalid request methods", async () => {
      const res = await appRoute.request("/api/hello-world", {
        method: "DELETE",
      });

      expect(res.status).toBe(405); // Method Not Allowed
    });
  });
});
```

### Testing API Endpoints with Database

```typescript
// workers/tests/showcases-api.test.ts
import { SELF } from "cloudflare:test";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

describe("/api/showcases", () => {
  beforeEach(async () => {
    // Setup test data
    await setupTestDatabase();
  });

  afterEach(async () => {
    // Cleanup test data
    await cleanupTestDatabase();
  });

  test("GET /api/showcases returns showcases list", async () => {
    // Create test showcase
    await createTestShowcase({
      name: "Test Showcase",
      description: "Test Description",
      url: "https://example.com",
      image: "https://example.com/image.jpg",
    });

    const response = await SELF.fetch("/api/showcases");

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.data).toBeInstanceOf(Array);
    expect(data.data).toHaveLength(1);
    expect(data.data[0]).toMatchObject({
      name: "Test Showcase",
      description: "Test Description",
      url: "https://example.com",
    });
  });

  test("POST /api/showcases creates new showcase", async () => {
    const showcaseData = {
      name: "New Showcase",
      description: "New Description",
      url: "https://new-example.com",
      image: "https://new-example.com/image.jpg",
    };

    const response = await SELF.fetch("/api/showcases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(showcaseData),
    });

    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data.data).toMatchObject(showcaseData);
    expect(data.data.id).toBeDefined();
    expect(data.data.createdAt).toBeDefined();
  });

  test("validates showcase data", async () => {
    const invalidData = {
      name: "", // Invalid: empty name
      description: "Valid description",
      url: "not-a-url", // Invalid: bad URL format
    };

    const response = await SELF.fetch("/api/showcases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidData),
    });

    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe("Validation failed");
    expect(data.details).toHaveProperty("fieldErrors");
  });
});

// Test helpers
async function setupTestDatabase() {
  // Initialize test database state
  await SELF.fetch("/test/setup-db", { method: "POST" });
}

async function cleanupTestDatabase() {
  // Clean up test database
  await SELF.fetch("/test/cleanup-db", { method: "POST" });
}

async function createTestShowcase(data: any) {
  return await SELF.fetch("/api/showcases", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
```

### Testing with Mock Service Worker (MSW)

```typescript
// lib/mocks/handlers.ts
import { http, HttpResponse } from "msw";
// lib/mocks/server.ts
import { setupServer } from "msw/node";
// vitest.setup.ts
import { afterAll, afterEach, beforeAll } from "vitest";

import { handlers } from "./handlers";
import { server } from "./lib/mocks/server";

export const handlers = [
  // GET /api/users
  http.get("/api/users", () => {
    return HttpResponse.json({
      data: [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
      ],
      pagination: { page: 1, limit: 10, total: 2, pages: 1 },
    });
  }),

  // POST /api/users
  http.post("/api/users", async ({ request }) => {
    const userData = await request.json();
    return HttpResponse.json(
      {
        data: {
          id: 3,
          ...userData,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 },
    );
  }),

  // Error scenario
  http.get("/api/users/error", () => {
    return HttpResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }),
];

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## 🗄 Database Testing

### Testing Repository Layer

```typescript
// repositories/user-repository.test.ts
import { beforeEach, describe, expect, it } from "vitest";

import { users } from "~/database/schema";
import { db } from "~/lib/db";

import { userRepository } from "./user-repository";

describe("UserRepository", () => {
  beforeEach(async () => {
    // Clean database before each test
    await db.delete(users);
  });

  it("creates a user", async () => {
    const userData = {
      name: "John Doe",
      email: "john@example.com",
    };

    const user = await userRepository.create(userData);

    expect(user.id).toBeDefined();
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it("finds user by email", async () => {
    const userData = {
      name: "John Doe",
      email: "john@example.com",
    };

    const createdUser = await userRepository.create(userData);
    const foundUser = await userRepository.findByEmail(userData.email);

    expect(foundUser).toEqual(createdUser);
  });

  it("returns null for non-existent user", async () => {
    const user = await userRepository.findByEmail("notfound@example.com");
    expect(user).toBeNull();
  });

  it("updates user", async () => {
    const user = await userRepository.create({
      name: "John Doe",
      email: "john@example.com",
    });

    const updatedUser = await userRepository.update(user.id, {
      name: "Jane Doe",
    });

    expect(updatedUser.name).toBe("Jane Doe");
    expect(updatedUser.email).toBe("john@example.com");
    expect(updatedUser.updatedAt).not.toEqual(user.updatedAt);
  });

  it("soft deletes user", async () => {
    const user = await userRepository.create({
      name: "John Doe",
      email: "john@example.com",
    });

    await userRepository.softDelete(user.id);

    const deletedUser = await userRepository.findById(user.id);
    expect(deletedUser).toBeNull();
  });
});
```

### Testing Database Migrations

```typescript
// tests/migrations.test.ts
import { sql } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import { db } from "~/lib/db";

describe("Database Migrations", () => {
  it("creates users table with correct schema", async () => {
    const result = await db.all(sql`
      SELECT name, type FROM sqlite_master 
      WHERE type='table' AND name='users'
    `);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("users");
  });

  it("creates indexes correctly", async () => {
    const indexes = await db.all(sql`
      SELECT name FROM sqlite_master 
      WHERE type='index' AND tbl_name='users'
    `);

    const indexNames = indexes.map((idx) => idx.name);
    expect(indexNames).toContain("users_email_unique");
    expect(indexNames).toContain("users_created_at_idx");
  });

  it("enforces unique constraints", async () => {
    const userData = {
      name: "John Doe",
      email: "john@example.com",
    };

    // First insert should succeed
    await db.insert(users).values(userData);

    // Second insert should fail
    await expect(db.insert(users).values(userData)).rejects.toThrow(
      /UNIQUE constraint failed/,
    );
  });
});
```

---

## 🎭 End-to-End Testing

### Playwright Setup

```typescript
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: "bun run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Examples

```typescript
// e2e/user-management.spec.ts
// e2e/responsive.spec.ts
import { devices, expect, expect, test, test } from "@playwright/test";

test.describe("User Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("displays users list", async ({ page }) => {
    await page.getByRole("link", { name: "Users" }).click();

    await expect(page).toHaveURL("/users");
    await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();

    // Check if users are displayed
    const userCards = page.getByTestId("user-card");
    await expect(userCards).toHaveCount(2); // Assuming test data
  });

  test("creates a new user", async ({ page }) => {
    await page.getByRole("link", { name: "Users" }).click();
    await page.getByRole("button", { name: "Add User" }).click();

    // Fill form
    await page.getByLabel("Name").fill("John Doe");
    await page.getByLabel("Email").fill("john@example.com");

    // Submit form
    await page.getByRole("button", { name: "Save" }).click();

    // Verify success
    await expect(page.getByText("User created successfully")).toBeVisible();
    await expect(page.getByText("John Doe")).toBeVisible();
  });

  test("validates form fields", async ({ page }) => {
    await page.getByRole("link", { name: "Users" }).click();
    await page.getByRole("button", { name: "Add User" }).click();

    // Try to submit empty form
    await page.getByRole("button", { name: "Save" }).click();

    // Check validation errors
    await expect(page.getByText("Name is required")).toBeVisible();
    await expect(page.getByText("Email is required")).toBeVisible();
  });

  test("edits existing user", async ({ page }) => {
    await page.getByRole("link", { name: "Users" }).click();

    // Click edit on first user
    await page
      .getByTestId("user-card")
      .first()
      .getByRole("button", { name: "Edit" })
      .click();

    // Update name
    await page.getByLabel("Name").clear();
    await page.getByLabel("Name").fill("Jane Doe");

    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("User updated successfully")).toBeVisible();
    await expect(page.getByText("Jane Doe")).toBeVisible();
  });

  test("deletes user with confirmation", async ({ page }) => {
    await page.getByRole("link", { name: "Users" }).click();

    // Click delete on first user
    await page
      .getByTestId("user-card")
      .first()
      .getByRole("button", { name: "Delete" })
      .click();

    // Confirm deletion
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Delete" })
      .click();

    await expect(page.getByText("User deleted successfully")).toBeVisible();
  });
});

test.describe("Responsive Design", () => {
  test("mobile navigation works correctly", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto("/");

    // Mobile menu should be hidden initially
    await expect(page.getByRole("navigation")).not.toBeVisible();

    // Open mobile menu
    await page.getByRole("button", { name: "Menu" }).click();
    await expect(page.getByRole("navigation")).toBeVisible();

    // Navigate using mobile menu
    await page.getByRole("link", { name: "Users" }).click();
    await expect(page).toHaveURL("/users");
  });

  test("desktop layout displays correctly", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");

    // Desktop navigation should be visible
    await expect(page.getByRole("navigation")).toBeVisible();

    // Sidebar should be visible
    await expect(page.getByTestId("sidebar")).toBeVisible();
  });
});
```

---

## 📊 Test Coverage and Reports

### Coverage Configuration

```typescript
// vitest.config.ts
export default defineWorkersConfig({
  test: {
    coverage: {
      provider: "istanbul",
      reporter: ["text", "html", "json"],
      reportsDirectory: "./coverage",
      exclude: [
        "node_modules/**",
        "drizzle/**",
        "public/**",
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/*.config.ts",
        "**/test-utils.ts",
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
```

### Running Tests

```bash
# Run all tests
bun run test

# Run tests with coverage
bun run coverage

# Run tests in watch mode
bun run test --watch

# Run specific test file
bun run test user-repository.test.ts

# Run tests matching pattern
bun run test --grep "user"

# Run UI mode
bun run test --ui

# Run E2E tests
bunx playwright test

# Run E2E tests in UI mode
bunx playwright test --ui
```

---

## 🛠 Testing Best Practices

### Test Organization

```typescript
// Good test structure
describe("UserService", () => {
  describe("createUser", () => {
    it("creates user with valid data", () => {});
    it("throws error for invalid email", () => {});
    it("throws error for duplicate email", () => {});
  });

  describe("updateUser", () => {
    it("updates existing user", () => {});
    it("throws error for non-existent user", () => {});
  });
});
```

### Test Data Management

```typescript
// factories/user.factory.ts
export const createUserData = (overrides = {}) => ({
  name: "John Doe",
  email: "john@example.com",
  role: "user",
  ...overrides,
});

export const createUser = async (overrides = {}) => {
  const userData = createUserData(overrides);
  return await userRepository.create(userData);
};

// Usage in tests
it("updates user name", async () => {
  const user = await createUser();
  const updated = await userService.updateUser(user.id, { name: "Jane Doe" });
  expect(updated.name).toBe("Jane Doe");
});
```

### Async Testing

```typescript
// Testing async operations
it("fetches user data", async () => {
  const promise = userService.getUser(1);
  await expect(promise).resolves.toEqual(expectedUser);
});

it("handles network errors", async () => {
  const promise = userService.getUser(999);
  await expect(promise).rejects.toThrow("User not found");
});

// Testing with timeouts
it("completes within time limit", async () => {
  const start = Date.now();
  await userService.processLargeData();
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(5000);
});
```

### Mocking Guidelines

```typescript
// Mock external dependencies
vi.mock("~/lib/email-service", () => ({
  sendEmail: vi.fn().mockResolvedValue(true),
}));

// Partial mocking
vi.mock("~/lib/utils", async () => {
  const actual = await vi.importActual("~/lib/utils");
  return {
    ...actual,
    getCurrentTimestamp: vi.fn(() => "2024-01-01T00:00:00Z"),
  };
});

// Spy on console methods
it("logs error message", () => {
  const consoleSpy = vi.spyOn(console, "error");
  service.handleError(new Error("Test error"));
  expect(consoleSpy).toHaveBeenCalledWith("Test error");
  consoleSpy.mockRestore();
});
```

---

## 🔍 Debugging Tests

### Debug Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run", "--reporter=verbose"],
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### Debug Strategies

```typescript
// Debug with console.log
it("debugs complex logic", () => {
  const result = complexFunction(input);
  console.log("Debug result:", result); // Remove before commit
  expect(result).toBe(expected);
});

// Debug with debugger
it("steps through code", () => {
  debugger; // Execution will pause here
  const result = complexFunction(input);
  expect(result).toBe(expected);
});

// Debug failed tests
it("investigates failure", () => {
  const result = unreliableFunction();

  // Log state for investigation
  if (result !== expected) {
    console.log("Unexpected result:", result);
    console.log("Expected:", expected);
    console.log("Input state:", getInputState());
  }

  expect(result).toBe(expected);
});
```

---

## ⚡ Performance Testing

### Testing Application Performance

```typescript
// tests/performance/api-performance.test.ts
import { SELF } from "cloudflare:test";
import { describe, expect, test } from "vitest";

describe("API Performance", () => {
  test("API responses are under acceptable latency", async () => {
    const start = performance.now();

    const response = await SELF.fetch("/api/showcases");

    const end = performance.now();
    const duration = end - start;

    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(1000); // Under 1 second
  });

  test("handles concurrent requests efficiently", async () => {
    const concurrentRequests = 10;
    const start = performance.now();

    const promises = Array.from({ length: concurrentRequests }, () =>
      SELF.fetch("/api/health"),
    );

    const responses = await Promise.all(promises);
    const end = performance.now();

    // All requests should succeed
    responses.forEach((response) => {
      expect(response.status).toBe(200);
    });

    // Total time should be reasonable for concurrent requests
    const totalDuration = end - start;
    expect(totalDuration).toBeLessThan(2000); // Under 2 seconds for 10 requests
  });
});
```

---

## 🚀 Continuous Integration

### GitHub Actions Test Configuration

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [22]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Run type checking
        run: bun run typecheck

      - name: Run unit tests
        run: bun run test

      - name: Run tests with coverage
        run: bun run coverage
```

### Test Commands Reference

| Command              | Description              | When to Use             | Troubleshooting                                         |
| -------------------- | ------------------------ | ----------------------- | ------------------------------------------------------- |
| `bun test`           | Run all tests once       | Before commits, CI      | [Test failures](./TROUBLESHOOTING.md#test-failures)     |
| `bun test --watch`   | Run tests in watch mode  | Active development      | Performance issues if too many files                    |
| `bun test --ui`      | Open Vitest UI           | Debugging test failures | [UI not opening](./TROUBLESHOOTING.md#vitest-ui-issues) |
| `bun run coverage`   | Generate coverage report | Before releases         | Low coverage warnings                                   |
| `bun test <pattern>` | Run specific tests       | Testing single feature  | Pattern matching help                                   |

---

This testing guide provides comprehensive coverage of testing strategies and patterns for building reliable applications with the NARA boilerplate.

---

Built with ❤️ by KotonoSora — to help you ship faster and with confidence.
