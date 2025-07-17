# Testing Guide

This guide covers testing strategies, patterns, and best practices for the NARA boilerplate, including unit tests, integration tests, and end-to-end testing.

---

## 🧪 Testing Overview

The NARA boilerplate uses **Vitest** as the primary testing framework with Cloudflare Workers testing utilities:

- **Vitest** - Fast unit testing framework
- **@cloudflare/vitest-pool-workers** - Cloudflare Workers test environment
- **React Testing Library** - Component testing utilities
- **MSW** - API mocking for frontend tests

### Test Configuration

```typescript
// vitest.config.ts
import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config'

export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.jsonc' },
      },
    },
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/**',
        'drizzle/**',
        '**/*.test.ts',
        '**/*.spec.ts',
      ],
    },
  },
})
```

---

## 🏗 Testing Architecture

### Testing Pyramid

```
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
import { BrowserRouter } from 'react-router-dom'

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
```

### Testing Pure Functions

```typescript
// lib/utils.test.ts
import { describe, it, expect } from 'vitest'
import { cn, formatDate, validateEmail } from './utils'

describe('Utils', () => {
  describe('cn (className merge)', () => {
    it('merges class names correctly', () => {
      expect(cn('base', 'extra')).toBe('base extra')
      expect(cn('base', undefined, 'extra')).toBe('base extra')
      expect(cn('px-4', 'px-2')).toBe('px-2') // Tailwind merge
    })
  })

  describe('formatDate', () => {
    it('formats dates correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z')
      expect(formatDate(date)).toBe('January 15, 2024')
      expect(formatDate(date, 'short')).toBe('Jan 15, 2024')
    })

    it('handles invalid dates', () => {
      expect(formatDate(null)).toBe('Invalid Date')
      expect(formatDate(undefined)).toBe('Invalid Date')
    })
  })

  describe('validateEmail', () => {
    it('validates correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true)
    })

    it('rejects invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
    })
  })
})
```

### Testing React Hooks

```typescript
// hooks/use-mobile.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useMobile } from './use-mobile'

// Mock matchMedia
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

describe('useMobile', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns true for mobile viewport', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => useMobile())
    expect(result.current).toBe(true)
  })

  it('returns false for desktop viewport', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() => useMobile())
    expect(result.current).toBe(false)
  })
})
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

### Testing Cloudflare Workers

```typescript
// workers/tests/api.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { SELF } from 'cloudflare:test'

describe('API Routes', () => {
  beforeEach(async () => {
    // Reset database state
    await SELF.fetch('/test/reset-db', { method: 'POST' })
  })

  describe('/api/health', () => {
    it('returns health status', async () => {
      const response = await SELF.fetch('/api/health')
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.status).toBe('ok')
      expect(data.timestamp).toBeDefined()
    })
  })

  describe('/api/users', () => {
    it('GET /api/users returns users list', async () => {
      // Create test data
      await createTestUsers()
      
      const response = await SELF.fetch('/api/users')
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.data).toBeInstanceOf(Array)
      expect(data.pagination).toHaveProperty('page')
      expect(data.pagination).toHaveProperty('total')
    })

    it('POST /api/users creates new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com'
      }
      
      const response = await SELF.fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      
      expect(response.status).toBe(201)
      
      const data = await response.json()
      expect(data.data.name).toBe(userData.name)
      expect(data.data.email).toBe(userData.email)
      expect(data.data.id).toBeDefined()
    })

    it('validates user data', async () => {
      const invalidData = {
        name: '', // Invalid: empty name
        email: 'not-an-email' // Invalid: bad email format
      }
      
      const response = await SELF.fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      })
      
      expect(response.status).toBe(400)
      
      const data = await response.json()
      expect(data.error).toBe('Validation failed')
      expect(data.details).toHaveProperty('fieldErrors')
    })

    it('handles duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com'
      }
      
      // Create first user
      await SELF.fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      
      // Try to create duplicate
      const response = await SELF.fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      
      expect(response.status).toBe(409)
      
      const data = await response.json()
      expect(data.error).toContain('already exists')
    })
  })

  describe('Authentication', () => {
    it('protects authenticated routes', async () => {
      const response = await SELF.fetch('/api/protected/profile')
      
      expect(response.status).toBe(401)
      
      const data = await response.json()
      expect(data.error).toContain('authorization')
    })

    it('allows access with valid token', async () => {
      const token = await createTestToken()
      
      const response = await SELF.fetch('/api/protected/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      expect(response.status).toBe(200)
    })
  })

  describe('Rate Limiting', () => {
    it('enforces rate limits', async () => {
      const requests = Array.from({ length: 110 }, () =>
        SELF.fetch('/api/users')
      )
      
      const responses = await Promise.all(requests)
      const rateLimited = responses.filter(r => r.status === 429)
      
      expect(rateLimited.length).toBeGreaterThan(0)
    })
  })
})

// Test helpers
async function createTestUsers() {
  const users = [
    { name: 'User 1', email: 'user1@example.com' },
    { name: 'User 2', email: 'user2@example.com' },
  ]
  
  for (const user of users) {
    await SELF.fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
  }
}

async function createTestToken() {
  // Implementation depends on your auth system
  return 'test-jwt-token'
}
```

### Testing with Mock Service Worker (MSW)

```typescript
// lib/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  // GET /api/users
  http.get('/api/users', () => {
    return HttpResponse.json({
      data: [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      ],
      pagination: { page: 1, limit: 10, total: 2, pages: 1 }
    })
  }),

  // POST /api/users
  http.post('/api/users', async ({ request }) => {
    const userData = await request.json()
    return HttpResponse.json({
      data: {
        id: 3,
        ...userData,
        createdAt: new Date().toISOString()
      }
    }, { status: 201 })
  }),

  // Error scenario
  http.get('/api/users/error', () => {
    return HttpResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }),
]

// lib/mocks/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)

// vitest.setup.ts
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './lib/mocks/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

---

## 🗄 Database Testing

### Testing Repository Layer

```typescript
// repositories/user-repository.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { userRepository } from './user-repository'
import { db } from '~/lib/db'
import { users } from '~/database/schema'

describe('UserRepository', () => {
  beforeEach(async () => {
    // Clean database before each test
    await db.delete(users)
  })

  it('creates a user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com'
    }
    
    const user = await userRepository.create(userData)
    
    expect(user.id).toBeDefined()
    expect(user.name).toBe(userData.name)
    expect(user.email).toBe(userData.email)
    expect(user.createdAt).toBeInstanceOf(Date)
  })

  it('finds user by email', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com'
    }
    
    const createdUser = await userRepository.create(userData)
    const foundUser = await userRepository.findByEmail(userData.email)
    
    expect(foundUser).toEqual(createdUser)
  })

  it('returns null for non-existent user', async () => {
    const user = await userRepository.findByEmail('notfound@example.com')
    expect(user).toBeNull()
  })

  it('updates user', async () => {
    const user = await userRepository.create({
      name: 'John Doe',
      email: 'john@example.com'
    })
    
    const updatedUser = await userRepository.update(user.id, {
      name: 'Jane Doe'
    })
    
    expect(updatedUser.name).toBe('Jane Doe')
    expect(updatedUser.email).toBe('john@example.com')
    expect(updatedUser.updatedAt).not.toEqual(user.updatedAt)
  })

  it('soft deletes user', async () => {
    const user = await userRepository.create({
      name: 'John Doe',
      email: 'john@example.com'
    })
    
    await userRepository.softDelete(user.id)
    
    const deletedUser = await userRepository.findById(user.id)
    expect(deletedUser).toBeNull()
  })
})
```

### Testing Database Migrations

```typescript
// tests/migrations.test.ts
import { describe, it, expect } from 'vitest'
import { db } from '~/lib/db'
import { sql } from 'drizzle-orm'

describe('Database Migrations', () => {
  it('creates users table with correct schema', async () => {
    const result = await db.all(sql`
      SELECT name, type FROM sqlite_master 
      WHERE type='table' AND name='users'
    `)
    
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('users')
  })

  it('creates indexes correctly', async () => {
    const indexes = await db.all(sql`
      SELECT name FROM sqlite_master 
      WHERE type='index' AND tbl_name='users'
    `)
    
    const indexNames = indexes.map(idx => idx.name)
    expect(indexNames).toContain('users_email_unique')
    expect(indexNames).toContain('users_created_at_idx')
  })

  it('enforces unique constraints', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com'
    }
    
    // First insert should succeed
    await db.insert(users).values(userData)
    
    // Second insert should fail
    await expect(
      db.insert(users).values(userData)
    ).rejects.toThrow(/UNIQUE constraint failed/)
  })
})
```

---

## 🎭 End-to-End Testing

### Playwright Setup

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

### E2E Test Examples

```typescript
// e2e/user-management.spec.ts
import { test, expect } from '@playwright/test'

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays users list', async ({ page }) => {
    await page.getByRole('link', { name: 'Users' }).click()
    
    await expect(page).toHaveURL('/users')
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible()
    
    // Check if users are displayed
    const userCards = page.getByTestId('user-card')
    await expect(userCards).toHaveCount(2) // Assuming test data
  })

  test('creates a new user', async ({ page }) => {
    await page.getByRole('link', { name: 'Users' }).click()
    await page.getByRole('button', { name: 'Add User' }).click()
    
    // Fill form
    await page.getByLabel('Name').fill('John Doe')
    await page.getByLabel('Email').fill('john@example.com')
    
    // Submit form
    await page.getByRole('button', { name: 'Save' }).click()
    
    // Verify success
    await expect(page.getByText('User created successfully')).toBeVisible()
    await expect(page.getByText('John Doe')).toBeVisible()
  })

  test('validates form fields', async ({ page }) => {
    await page.getByRole('link', { name: 'Users' }).click()
    await page.getByRole('button', { name: 'Add User' }).click()
    
    // Try to submit empty form
    await page.getByRole('button', { name: 'Save' }).click()
    
    // Check validation errors
    await expect(page.getByText('Name is required')).toBeVisible()
    await expect(page.getByText('Email is required')).toBeVisible()
  })

  test('edits existing user', async ({ page }) => {
    await page.getByRole('link', { name: 'Users' }).click()
    
    // Click edit on first user
    await page.getByTestId('user-card').first().getByRole('button', { name: 'Edit' }).click()
    
    // Update name
    await page.getByLabel('Name').clear()
    await page.getByLabel('Name').fill('Jane Doe')
    
    await page.getByRole('button', { name: 'Save' }).click()
    
    await expect(page.getByText('User updated successfully')).toBeVisible()
    await expect(page.getByText('Jane Doe')).toBeVisible()
  })

  test('deletes user with confirmation', async ({ page }) => {
    await page.getByRole('link', { name: 'Users' }).click()
    
    // Click delete on first user
    await page.getByTestId('user-card').first().getByRole('button', { name: 'Delete' }).click()
    
    // Confirm deletion
    await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click()
    
    await expect(page.getByText('User deleted successfully')).toBeVisible()
  })
})

// e2e/responsive.spec.ts
import { test, expect, devices } from '@playwright/test'

test.describe('Responsive Design', () => {
  test('mobile navigation works correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }) // iPhone SE
    await page.goto('/')
    
    // Mobile menu should be hidden initially
    await expect(page.getByRole('navigation')).not.toBeVisible()
    
    // Open mobile menu
    await page.getByRole('button', { name: 'Menu' }).click()
    await expect(page.getByRole('navigation')).toBeVisible()
    
    // Navigate using mobile menu
    await page.getByRole('link', { name: 'Users' }).click()
    await expect(page).toHaveURL('/users')
  })

  test('desktop layout displays correctly', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')
    
    // Desktop navigation should be visible
    await expect(page.getByRole('navigation')).toBeVisible()
    
    // Sidebar should be visible
    await expect(page.getByTestId('sidebar')).toBeVisible()
  })
})
```

---

## 📊 Test Coverage and Reports

### Coverage Configuration

```typescript
// vitest.config.ts
export default defineWorkersConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html', 'json'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/**',
        'drizzle/**',
        'public/**',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/*.config.ts',
        '**/test-utils.ts',
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
})
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
describe('UserService', () => {
  describe('createUser', () => {
    it('creates user with valid data', () => {})
    it('throws error for invalid email', () => {})
    it('throws error for duplicate email', () => {})
  })
  
  describe('updateUser', () => {
    it('updates existing user', () => {})
    it('throws error for non-existent user', () => {})
  })
})
```

### Test Data Management

```typescript
// factories/user.factory.ts
export const createUserData = (overrides = {}) => ({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
  ...overrides,
})

export const createUser = async (overrides = {}) => {
  const userData = createUserData(overrides)
  return await userRepository.create(userData)
}

// Usage in tests
it('updates user name', async () => {
  const user = await createUser()
  const updated = await userService.updateUser(user.id, { name: 'Jane Doe' })
  expect(updated.name).toBe('Jane Doe')
})
```

### Async Testing

```typescript
// Testing async operations
it('fetches user data', async () => {
  const promise = userService.getUser(1)
  await expect(promise).resolves.toEqual(expectedUser)
})

it('handles network errors', async () => {
  const promise = userService.getUser(999)
  await expect(promise).rejects.toThrow('User not found')
})

// Testing with timeouts
it('completes within time limit', async () => {
  const start = Date.now()
  await userService.processLargeData()
  const duration = Date.now() - start
  expect(duration).toBeLessThan(5000)
})
```

### Mocking Guidelines

```typescript
// Mock external dependencies
vi.mock('~/lib/email-service', () => ({
  sendEmail: vi.fn().mockResolvedValue(true),
}))

// Partial mocking
vi.mock('~/lib/utils', async () => {
  const actual = await vi.importActual('~/lib/utils')
  return {
    ...actual,
    getCurrentTimestamp: vi.fn(() => '2024-01-01T00:00:00Z'),
  }
})

// Spy on console methods
it('logs error message', () => {
  const consoleSpy = vi.spyOn(console, 'error')
  service.handleError(new Error('Test error'))
  expect(consoleSpy).toHaveBeenCalledWith('Test error')
  consoleSpy.mockRestore()
})
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
it('debugs complex logic', () => {
  const result = complexFunction(input)
  console.log('Debug result:', result) // Remove before commit
  expect(result).toBe(expected)
})

// Debug with debugger
it('steps through code', () => {
  debugger // Execution will pause here
  const result = complexFunction(input)
  expect(result).toBe(expected)
})

// Debug failed tests
it('investigates failure', () => {
  const result = unreliableFunction()
  
  // Log state for investigation
  if (result !== expected) {
    console.log('Unexpected result:', result)
    console.log('Expected:', expected)
    console.log('Input state:', getInputState())
  }
  
  expect(result).toBe(expected)
})
```

---

This testing guide provides comprehensive coverage of testing strategies and patterns for building reliable applications with the NARA boilerplate.

---

Built with ❤️ by KotonoSora — to help you ship faster and with confidence.