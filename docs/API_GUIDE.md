# API Development Guide

This guide covers API development with Hono framework on Cloudflare Workers, including routing, middleware, validation, and best practices.

## 📋 Table of Contents

- [🌐 API Architecture Overview](#-api-architecture-overview)
- [🚀 Getting Started](#-getting-started)
- [🛤 Routing Patterns](#-routing-patterns)
- [🔒 Middleware Patterns](#-middleware-patterns)
- [📝 Request/Response Handling](#-requestresponse-handling)
- [🛡 Error Handling](#-error-handling)
- [🧪 Testing APIs](#-testing-apis)
- [📊 Performance Optimization](#-performance-optimization)
- [🔐 Security Best Practices](#-security-best-practices)
- [🔧 Development Best Practices](#-development-best-practices)
- [📚 Advanced Patterns](#-advanced-patterns)
- [🚀 Deployment Considerations](#-deployment-considerations)

---

## 🌐 API Architecture Overview

The NARA boilerplate uses **Hono** as the web framework for building APIs on Cloudflare Workers:

- **Hono Framework** - Fast, lightweight web framework
- **Cloudflare Workers** - Edge runtime environment
- **Type Safety** - End-to-end TypeScript support
- **Performance** - Sub-millisecond response times

### Project Structure

```text
/workers/
├── app.ts              # Main worker entry point
├── /api/               # API route handlers
│   ├── health.ts       # Health check endpoint
│   ├── hello-world.ts  # Example endpoint
│   └── posts.ts        # Posts API example
└── /tests/             # API tests
    └── common.test.ts
```

---

## 🚀 Getting Started

### Basic App Setup

```typescript
// workers/app.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { trimTrailingSlash } from 'hono/trailing-slash'

// Import API routes
import health from './api/health'
import helloWorld from './api/hello-world'
import posts from './api/posts'

const app = new Hono()

// Global middleware
app.use('*', logger())
app.use('*', trimTrailingSlash())
app.use('*', cors({
  origin: ['http://localhost:5173', 'https://your-domain.com'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// API routes
app.route('/api', health)
app.route('/api', helloWorld)
app.route('/api/posts', posts)

// Default route
app.get('/', (c) => {
  return c.json({ 
    message: 'NARA API',
    version: '1.0.0',
    documentation: '/api/docs'
  })
})

export default app
```

### Environment Types

```typescript
// worker-configuration.d.ts
interface Env {
  DB: D1Database
  API_SECRET: string
  ENVIRONMENT: 'development' | 'staging' | 'production'
}

declare global {
  function getMiniflareBindings(): Env
}
```

---

## 🛤 Routing Patterns

### Basic Routes

```typescript
// workers/api/hello-world.ts
import { Hono } from 'hono'

const app = new Hono()

// GET /api/hello-world
app.get('/hello-world', (c) => {
  return c.json({ message: 'Hello, World!' })
})

// GET /api/hello-world/:name
app.get('/hello-world/:name', (c) => {
  const name = c.req.param('name')
  return c.json({ message: `Hello, ${name}!` })
})

export default app
```

### RESTful API Design

```typescript
// workers/api/posts.ts
import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { db } from '~/lib/db'
import { posts, users } from '~/database/schema'
import { eq, desc, and, count } from 'drizzle-orm'

const app = new Hono<{ Bindings: Env }>()

// Validation schemas
const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  published: z.boolean().default(false),
})

const updatePostSchema = createPostSchema.partial()

const querySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  published: z.string().transform(Boolean).optional(),
})

// GET /api/posts - List posts with pagination
app.get('/', zValidator('query', querySchema), async (c) => {
  const { page, limit, published } = c.req.valid('query')
  const offset = (page - 1) * limit
  
  try {
    const whereCondition = published !== undefined 
      ? eq(posts.published, published)
      : undefined

    const [postList, [{ total }]] = await Promise.all([
      db.query.posts.findMany({
        where: whereCondition,
        with: {
          author: {
            columns: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: desc(posts.createdAt),
        limit,
        offset,
      }),
      
      db.select({ total: count() })
        .from(posts)
        .where(whereCondition),
    ])

    return c.json({
      data: postList,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return c.json({ error: 'Failed to fetch posts' }, 500)
  }
})

// GET /api/posts/:id - Get single post
app.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  
  if (isNaN(id)) {
    return c.json({ error: 'Invalid post ID' }, 400)
  }

  try {
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, id),
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!post) {
      return c.json({ error: 'Post not found' }, 404)
    }

    return c.json({ data: post })
  } catch (error) {
    console.error('Error fetching post:', error)
    return c.json({ error: 'Failed to fetch post' }, 500)
  }
})

// POST /api/posts - Create new post
app.post('/', zValidator('json', createPostSchema), async (c) => {
  const postData = c.req.valid('json')
  
  try {
    // TODO: Get authorId from authentication
    const authorId = 1 // Placeholder
    
    const [newPost] = await db.insert(posts)
      .values({
        ...postData,
        authorId,
      })
      .returning()

    const postWithAuthor = await db.query.posts.findFirst({
      where: eq(posts.id, newPost.id),
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return c.json({ data: postWithAuthor }, 201)
  } catch (error) {
    console.error('Error creating post:', error)
    return c.json({ error: 'Failed to create post' }, 500)
  }
})

// PUT /api/posts/:id - Update post
app.put('/:id', zValidator('json', updatePostSchema), async (c) => {
  const id = Number(c.req.param('id'))
  const updateData = c.req.valid('json')
  
  if (isNaN(id)) {
    return c.json({ error: 'Invalid post ID' }, 400)
  }

  try {
    // Check if post exists
    const existingPost = await db.query.posts.findFirst({
      where: eq(posts.id, id),
    })

    if (!existingPost) {
      return c.json({ error: 'Post not found' }, 404)
    }

    // TODO: Check authorization (user can only update their own posts)

    const [updatedPost] = await db.update(posts)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))
      .returning()

    const postWithAuthor = await db.query.posts.findFirst({
      where: eq(posts.id, updatedPost.id),
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return c.json({ data: postWithAuthor })
  } catch (error) {
    console.error('Error updating post:', error)
    return c.json({ error: 'Failed to update post' }, 500)
  }
})

// DELETE /api/posts/:id - Delete post
app.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  
  if (isNaN(id)) {
    return c.json({ error: 'Invalid post ID' }, 400)
  }

  try {
    const existingPost = await db.query.posts.findFirst({
      where: eq(posts.id, id),
    })

    if (!existingPost) {
      return c.json({ error: 'Post not found' }, 404)
    }

    // TODO: Check authorization

    await db.delete(posts).where(eq(posts.id, id))

    return c.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return c.json({ error: 'Failed to delete post' }, 500)
  }
})

export default app
```

---

## 🔒 Middleware Patterns

### Authentication Middleware

```typescript
// workers/middleware/auth.ts
import { createMiddleware } from 'hono/factory'
import { verify } from 'hono/jwt'
import { HTTPException } from 'hono/http-exception'

interface AuthUser {
  id: number
  email: string
  role: string
}

declare module 'hono' {
  interface ContextVariableMap {
    user: AuthUser
  }
}

export const authMiddleware = createMiddleware<{ Bindings: Env }>(async (c, next) => {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'Missing or invalid authorization header' })
  }

  const token = authHeader.substring(7)
  
  try {
    const payload = await verify(token, c.env.JWT_SECRET)
    
    // Verify user exists in database
    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.sub as number),
    })

    if (!user) {
      throw new HTTPException(401, { message: 'Invalid token' })
    }

    c.set('user', {
      id: user.id,
      email: user.email,
      role: user.role,
    })

    await next()
  } catch (error) {
    throw new HTTPException(401, { message: 'Invalid token' })
  }
})

// Usage in routes
app.use('/protected/*', authMiddleware)
app.get('/protected/profile', (c) => {
  const user = c.get('user')
  return c.json({ user })
})
```

### Validation Middleware

```typescript
// Custom validation middleware
import { z } from 'zod'

export const validateBody = <T extends z.ZodType>(schema: T) => 
  createMiddleware(async (c, next) => {
    const body = await c.req.json()
    const result = schema.safeParse(body)
    
    if (!result.success) {
      return c.json({
        error: 'Validation failed',
        details: result.error.flatten()
      }, 400)
    }
    
    c.set('validatedBody', result.data)
    await next()
  })

// Usage
const userSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
})

app.post('/users', validateBody(userSchema), (c) => {
  const userData = c.get('validatedBody')
  // userData is now typed
})
```

### Rate Limiting Middleware

```typescript
// workers/middleware/rate-limit.ts
import { createMiddleware } from 'hono/factory'

interface RateLimitOptions {
  windowMs: number
  maxRequests: number
  keyGenerator?: (c: Context) => string
}

export const rateLimit = (options: RateLimitOptions) =>
  createMiddleware<{ Bindings: Env }>(async (c, next) => {
    const key = options.keyGenerator ? 
      options.keyGenerator(c) : 
      c.req.header('cf-connecting-ip') || 'unknown'
    
    const cacheKey = `rate_limit:${key}`
    
    try {
      // Use Cloudflare KV for rate limiting storage
      const current = await c.env.RATE_LIMIT_KV.get(cacheKey)
      const count = current ? parseInt(current) : 0
      
      if (count >= options.maxRequests) {
        return c.json({ error: 'Rate limit exceeded' }, 429)
      }
      
      // Increment counter
      await c.env.RATE_LIMIT_KV.put(
        cacheKey, 
        (count + 1).toString(), 
        { expirationTtl: Math.floor(options.windowMs / 1000) }
      )
      
      await next()
    } catch (error) {
      console.error('Rate limiting error:', error)
      await next() // Fail open
    }
  })

// Usage
app.use('/api/*', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
}))
```

### Logging Middleware

```typescript
// workers/middleware/logging.ts
export const requestLogger = createMiddleware(async (c, next) => {
  const start = Date.now()
  
  await next()
  
  const duration = Date.now() - start
  const { method, url } = c.req
  const status = c.res.status
  
  console.log(`${method} ${url} ${status} - ${duration}ms`)
  
  // Log to external service in production
  if (c.env.ENVIRONMENT === 'production') {
    // Send to logging service
  }
})
```

---

## 📝 Request/Response Handling

### Request Processing

```typescript
// Reading request data
app.post('/users', async (c) => {
  // JSON body
  const body = await c.req.json()
  
  // Form data
  const formData = await c.req.formData()
  const name = formData.get('name')
  
  // Query parameters
  const page = c.req.query('page') || '1'
  const limit = c.req.query('limit') || '10'
  
  // Route parameters
  const id = c.req.param('id')
  
  // Headers
  const authorization = c.req.header('Authorization')
  const userAgent = c.req.header('User-Agent')
  
  return c.json({ received: 'ok' })
})

// File uploads
app.post('/upload', async (c) => {
  const formData = await c.req.formData()
  const file = formData.get('file') as File
  
  if (!file) {
    return c.json({ error: 'No file provided' }, 400)
  }
  
  // Process file
  const arrayBuffer = await file.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)
  
  // Store in R2 or process as needed
  
  return c.json({ 
    filename: file.name,
    size: file.size,
    type: file.type
  })
})
```

### Response Formatting

```typescript
// JSON responses
app.get('/users', (c) => {
  return c.json({
    data: users,
    meta: {
      total: users.length,
      page: 1,
    }
  })
})

// Custom status codes
app.post('/users', (c) => {
  return c.json({ message: 'Created' }, 201)
})

// Headers
app.get('/download', (c) => {
  c.header('Content-Disposition', 'attachment; filename="data.csv"')
  c.header('Content-Type', 'text/csv')
  return c.text('id,name,email\n1,John,john@example.com')
})

// Redirects
app.get('/old-url', (c) => {
  return c.redirect('/new-url', 301)
})

// Streaming responses
app.get('/stream', (c) => {
  const stream = new ReadableStream({
    start(controller) {
      // Send data chunks
      controller.enqueue('chunk 1\n')
      controller.enqueue('chunk 2\n')
      controller.close()
    }
  })
  
  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain' }
  })
})
```

---

## 🛡 Error Handling

### Global Error Handler

```typescript
// workers/middleware/error-handler.ts
import { HTTPException } from 'hono/http-exception'

export const errorHandler = createMiddleware(async (c, next) => {
  try {
    await next()
  } catch (error) {
    console.error('API Error:', error)
    
    if (error instanceof HTTPException) {
      return c.json({
        error: error.message,
        status: error.status
      }, error.status)
    }
    
    if (error instanceof z.ZodError) {
      return c.json({
        error: 'Validation failed',
        details: error.flatten()
      }, 400)
    }
    
    // Database errors
    if (error.message.includes('UNIQUE constraint failed')) {
      return c.json({
        error: 'Resource already exists'
      }, 409)
    }
    
    // Generic error
    return c.json({
      error: 'Internal server error',
      ...(c.env.ENVIRONMENT === 'development' && { details: error.message })
    }, 500)
  }
})

// Apply globally
app.use('*', errorHandler)
```

### Custom Error Classes

```typescript
// lib/errors.ts
export class ValidationError extends Error {
  constructor(message: string, public details: any) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

// Usage in routes
app.get('/posts/:id', async (c) => {
  const post = await getPost(id)
  if (!post) {
    throw new NotFoundError('Post')
  }
  return c.json({ data: post })
})
```

---

## 🧪 Testing APIs

### Unit Testing

```typescript
// workers/tests/posts.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import app from '../api/posts'

describe('Posts API', () => {
  beforeEach(async () => {
    // Clear test database
  })
  
  it('GET /posts returns paginated posts', async () => {
    const response = await app.request('/posts?page=1&limit=5')
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.data).toBeInstanceOf(Array)
    expect(data.pagination).toHaveProperty('page', 1)
    expect(data.pagination).toHaveProperty('limit', 5)
  })
  
  it('POST /posts creates new post', async () => {
    const postData = {
      title: 'Test Post',
      content: 'Test content',
      published: false
    }
    
    const response = await app.request('/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    })
    
    expect(response.status).toBe(201)
    
    const data = await response.json()
    expect(data.data.title).toBe(postData.title)
    expect(data.data.content).toBe(postData.content)
  })
  
  it('PUT /posts/:id updates existing post', async () => {
    // Create a post first
    const post = await createTestPost()
    
    const updateData = { title: 'Updated Title' }
    
    const response = await app.request(`/posts/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    })
    
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data.data.title).toBe(updateData.title)
  })
})
```

### Integration Testing with Cloudflare Workers

```typescript
// workers/tests/integration.test.ts
import { SELF } from 'cloudflare:test'
import { describe, it, expect } from 'vitest'

describe('API Integration', () => {
  it('handles full request lifecycle', async () => {
    // Test actual worker deployment
    const response = await SELF.fetch('/api/health')
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.status).toBe('ok')
  })
  
  it('enforces rate limiting', async () => {
    // Make multiple requests to test rate limiting
    const requests = Array.from({ length: 150 }, () => 
      SELF.fetch('/api/posts')
    )
    
    const responses = await Promise.all(requests)
    const rateLimited = responses.filter(r => r.status === 429)
    
    expect(rateLimited.length).toBeGreaterThan(0)
  })
})
```

---

## 📊 Performance Optimization

### Caching Strategies

```typescript
// Response caching
app.get('/posts/:id', async (c) => {
  const id = c.req.param('id')
  
  // Check cache first
  const cached = await c.env.CACHE_KV.get(`post:${id}`)
  if (cached) {
    return c.json(JSON.parse(cached))
  }
  
  const post = await getPost(id)
  
  // Cache for 5 minutes
  await c.env.CACHE_KV.put(
    `post:${id}`, 
    JSON.stringify(post),
    { expirationTtl: 300 }
  )
  
  // Set cache headers
  c.header('Cache-Control', 'public, max-age=300')
  
  return c.json(post)
})

// Database connection reuse
const getDB = (env: Env) => {
  if (!globalThis._db) {
    globalThis._db = drizzle(env.DB)
  }
  return globalThis._db
}
```

### Request Optimization

```typescript
// Batch database operations
app.get('/users/with-stats', async (c) => {
  // Single query instead of N+1
  const usersWithStats = await db
    .select({
      user: users,
      postCount: count(posts.id),
    })
    .from(users)
    .leftJoin(posts, eq(users.id, posts.authorId))
    .groupBy(users.id)
  
  return c.json({ data: usersWithStats })
})

// Parallel requests
app.get('/dashboard', async (c) => {
  const [users, posts, comments] = await Promise.all([
    db.select().from(users).limit(10),
    db.select().from(posts).limit(10),
    db.select().from(comments).limit(10),
  ])
  
  return c.json({ users, posts, comments })
})
```

---

## � Security Best Practices

### Input Validation and Sanitization

```typescript
// Enhanced validation with custom error messages
const userRegistrationSchema = z.object({
  email: z.email('Please provide a valid email address')
    .max(255, 'Email address is too long'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'Password must contain uppercase, lowercase, number, and special character'),
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
})

// Sanitization middleware
export const sanitizeInput = createMiddleware(async (c, next) => {
  const body = await c.req.json()
  
  // Remove potential XSS
  const sanitized = Object.keys(body).reduce((acc, key) => {
    if (typeof body[key] === 'string') {
      acc[key] = body[key]
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .trim()
    } else {
      acc[key] = body[key]
    }
    return acc
  }, {} as any)
  
  c.set('sanitizedBody', sanitized)
  await next()
})
```

### Authentication and Authorization

```typescript
// JWT-based authentication with role-based access control
export const createAuthMiddleware = (requiredRoles?: string[]) => 
  createMiddleware<{ Bindings: Env }>(async (c, next) => {
    const authHeader = c.req.header('Authorization')
    
    if (!authHeader?.startsWith('Bearer ')) {
      throw new HTTPException(401, { message: 'Missing or invalid authorization header' })
    }

    const token = authHeader.substring(7)
    
    try {
      const payload = await verify(token, c.env.JWT_SECRET)
      
      // Verify token hasn't been revoked (check against blacklist)
      const isBlacklisted = await c.env.TOKEN_BLACKLIST_KV.get(`token:${token}`)
      if (isBlacklisted) {
        throw new HTTPException(401, { message: 'Token has been revoked' })
      }
      
      const user = await db.query.users.findFirst({
        where: eq(users.id, payload.sub as number),
        columns: {
          id: true,
          email: true,
          role: true,
          isActive: true,
        },
      })

      if (!user || !user.isActive) {
        throw new HTTPException(401, { message: 'Invalid or inactive user' })
      }

      // Check role-based access
      if (requiredRoles && !requiredRoles.includes(user.role)) {
        throw new HTTPException(403, { message: 'Insufficient permissions' })
      }

      c.set('user', user)
      await next()
    } catch (error) {
      if (error instanceof HTTPException) throw error
      throw new HTTPException(401, { message: 'Invalid token' })
    }
  })

// Usage with different permission levels
app.use('/api/admin/*', createAuthMiddleware(['admin']))
app.use('/api/users/*', createAuthMiddleware(['admin', 'user']))
app.use('/api/public/*', createAuthMiddleware()) // Any authenticated user
```

### SQL Injection Prevention

```typescript
// Always use parameterized queries with Drizzle
app.get('/users/search', async (c) => {
  const query = c.req.query('q')
  
  // ❌ NEVER do this - vulnerable to SQL injection
  // const result = await db.execute(`SELECT * FROM users WHERE name LIKE '%${query}%'`)
  
  // ✅ Use Drizzle's query builder - automatically parameterized
  const users = await db.query.users.findMany({
    where: like(users.name, `%${query}%`),
    columns: {
      id: true,
      name: true,
      email: true,
    },
  })
  
  return c.json({ data: users })
})
```

### CORS Configuration

```typescript
// Secure CORS configuration
app.use('*', cors({
  origin: (origin) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://your-domain.com',
      'https://staging.your-domain.com',
    ]
    
    // Allow all origins in development
    if (c.env.ENVIRONMENT === 'development') {
      return origin || true
    }
    
    return allowedOrigins.includes(origin || '')
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['X-Total-Count'],
  credentials: true,
  maxAge: 86400, // 24 hours
}))
```

### Rate Limiting with Multiple Strategies

```typescript
// Advanced rate limiting with different strategies
export const createRateLimit = (options: {
  windowMs: number
  maxRequests: number
  strategy: 'fixed-window' | 'sliding-window'
  skipSuccessfulRequests?: boolean
  keyGenerator?: (c: Context) => string
}) => createMiddleware<{ Bindings: Env }>(async (c, next) => {
  const key = options.keyGenerator?.(c) || 
    c.req.header('cf-connecting-ip') || 
    'unknown'
  
  const now = Date.now()
  const window = Math.floor(now / options.windowMs)
  const cacheKey = `rate_limit:${key}:${window}`
  
  try {
    if (options.strategy === 'sliding-window') {
      // Sliding window implementation
      const requests = await c.env.RATE_LIMIT_KV.get(`sliding:${key}`)
      const requestList = requests ? JSON.parse(requests) : []
      
      // Remove old requests
      const validRequests = requestList.filter(
        (timestamp: number) => now - timestamp < options.windowMs
      )
      
      if (validRequests.length >= options.maxRequests) {
        return c.json({ 
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((validRequests[0] + options.windowMs - now) / 1000)
        }, 429)
      }
      
      validRequests.push(now)
      await c.env.RATE_LIMIT_KV.put(
        `sliding:${key}`,
        JSON.stringify(validRequests),
        { expirationTtl: Math.ceil(options.windowMs / 1000) }
      )
    } else {
      // Fixed window implementation
      const current = await c.env.RATE_LIMIT_KV.get(cacheKey)
      const count = current ? parseInt(current) : 0
      
      if (count >= options.maxRequests) {
        return c.json({ 
          error: 'Rate limit exceeded',
          retryAfter: options.windowMs / 1000
        }, 429)
      }
      
      await c.env.RATE_LIMIT_KV.put(
        cacheKey,
        (count + 1).toString(),
        { expirationTtl: Math.floor(options.windowMs / 1000) }
      )
    }
    
    await next()
    
    // Skip counting successful requests if option is set
    if (options.skipSuccessfulRequests && c.res.status >= 400) {
      // Would need to decrement counter here
    }
    
    // Add rate limit headers
    c.header('X-RateLimit-Limit', options.maxRequests.toString())
    c.header('X-RateLimit-Window', (options.windowMs / 1000).toString())
    
  } catch (error) {
    console.error('Rate limiting error:', error)
    await next() // Fail open
  }
})

// Different rate limits for different endpoints
app.use('/api/auth/*', createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // Very restrictive for auth
  strategy: 'sliding-window'
}))

app.use('/api/*', createRateLimit({
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
  strategy: 'fixed-window',
  skipSuccessfulRequests: true
}))
```

---

## 📚 Advanced Patterns

### Request Context and Dependency Injection

```typescript
// Service container pattern
interface Services {
  userService: UserService
  emailService: EmailService
  auditService: AuditService
}

declare module 'hono' {
  interface ContextVariableMap {
    services: Services
  }
}

export const servicesMiddleware = createMiddleware<{ Bindings: Env }>(async (c, next) => {
  const db = getDB(c.env)
  
  const services: Services = {
    userService: new UserService(db),
    emailService: new EmailService(c.env),
    auditService: new AuditService(db),
  }
  
  c.set('services', services)
  await next()
})

// Usage in routes
app.use('*', servicesMiddleware)

app.post('/users', async (c) => {
  const { userService, emailService, auditService } = c.get('services')
  const userData = await c.req.json()
  
  const user = await userService.create(userData)
  await emailService.sendWelcomeEmail(user.email)
  await auditService.logUserCreation(user.id)
  
  return c.json({ data: user }, 201)
})
```

### Event-Driven Architecture

```typescript
// Event system for decoupled architecture
interface DomainEvent {
  type: string
  payload: any
  timestamp: Date
  correlationId: string
}

class EventBus {
  private handlers: Map<string, Array<(event: DomainEvent) => Promise<void>>> = new Map()
  
  subscribe(eventType: string, handler: (event: DomainEvent) => Promise<void>) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, [])
    }
    this.handlers.get(eventType)!.push(handler)
  }
  
  async publish(event: DomainEvent) {
    const handlers = this.handlers.get(event.type) || []
    await Promise.all(handlers.map(handler => handler(event)))
  }
}

// Event handlers
const eventBus = new EventBus()

eventBus.subscribe('user.created', async (event) => {
  const { userService, emailService } = event.payload
  await emailService.sendWelcomeEmail(event.payload.user.email)
})

eventBus.subscribe('user.created', async (event) => {
  const { auditService } = event.payload
  await auditService.logUserCreation(event.payload.user.id)
})

// Usage in routes
app.post('/users', async (c) => {
  const services = c.get('services')
  const userData = await c.req.json()
  
  const user = await services.userService.create(userData)
  
  await eventBus.publish({
    type: 'user.created',
    payload: { user, ...services },
    timestamp: new Date(),
    correlationId: crypto.randomUUID(),
  })
  
  return c.json({ data: user }, 201)
})
```

### Background Job Processing

```typescript
// Queue-based background processing
interface Job {
  id: string
  type: string
  payload: any
  retryCount: number
  maxRetries: number
  scheduledAt: Date
}

class JobQueue {
  constructor(private kv: KVNamespace) {}
  
  async enqueue(job: Omit<Job, 'id' | 'retryCount'>) {
    const fullJob: Job = {
      id: crypto.randomUUID(),
      retryCount: 0,
      ...job,
    }
    
    await this.kv.put(
      `job:${fullJob.id}`,
      JSON.stringify(fullJob),
      { expirationTtl: 86400 } // 24 hours
    )
    
    return fullJob.id
  }
  
  async process(jobType: string, handler: (payload: any) => Promise<void>) {
    // This would be called by a separate worker or cron job
    const jobs = await this.getJobsByType(jobType)
    
    for (const job of jobs) {
      try {
        await handler(job.payload)
        await this.kv.delete(`job:${job.id}`)
      } catch (error) {
        await this.handleJobFailure(job, error)
      }
    }
  }
  
  private async handleJobFailure(job: Job, error: any) {
    if (job.retryCount < job.maxRetries) {
      job.retryCount++
      job.scheduledAt = new Date(Date.now() + Math.pow(2, job.retryCount) * 1000) // Exponential backoff
      
      await this.kv.put(`job:${job.id}`, JSON.stringify(job))
    } else {
      // Move to dead letter queue
      await this.kv.put(`dlq:${job.id}`, JSON.stringify({ job, error: error.message }))
      await this.kv.delete(`job:${job.id}`)
    }
  }
}

// Usage
app.post('/users', async (c) => {
  const userData = await c.req.json()
  const user = await createUser(userData)
  
  // Queue background jobs
  const jobQueue = new JobQueue(c.env.JOB_QUEUE_KV)
  
  await jobQueue.enqueue({
    type: 'send-welcome-email',
    payload: { userId: user.id, email: user.email },
    maxRetries: 3,
    scheduledAt: new Date(),
  })
  
  await jobQueue.enqueue({
    type: 'setup-user-workspace',
    payload: { userId: user.id },
    maxRetries: 5,
    scheduledAt: new Date(Date.now() + 5000), // Delay 5 seconds
  })
  
  return c.json({ data: user }, 201)
})
```

### API Versioning

```typescript
// Version-aware routing
const v1 = new Hono().basePath('/v1')
const v2 = new Hono().basePath('/v2')

// V1 API
v1.get('/users', async (c) => {
  const users = await db.query.users.findMany({
    columns: {
      id: true,
      name: true,
      email: true,
    },
  })
  
  return c.json({ users }) // Old format
})

// V2 API with enhanced response format
v2.get('/users', async (c) => {
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '10')
  const offset = (page - 1) * limit
  
  const [users, [{ total }]] = await Promise.all([
    db.query.users.findMany({
      columns: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        lastLoginAt: true,
      },
      limit,
      offset,
    }),
    db.select({ total: count() }).from(users),
  ])
  
  return c.json({
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
    meta: {
      version: '2.0',
      timestamp: new Date().toISOString(),
    },
  })
})

// Mount versioned APIs
app.route('/api', v1)
app.route('/api', v2)

// Version deprecation middleware
const deprecationMiddleware = (version: string, sunsetDate: string) =>
  createMiddleware(async (c, next) => {
    c.header('Deprecation', 'true')
    c.header('Sunset', sunsetDate)
    c.header('Link', `</api/v${parseInt(version) + 1}>; rel="successor-version"`)
    
    await next()
  })

v1.use('*', deprecationMiddleware('1', '2025-12-31'))
```

---

## 🚀 Deployment Considerations

### Environment Configuration

```typescript
// Environment-specific configurations
interface DeploymentConfig {
  environment: 'development' | 'staging' | 'production'
  database: {
    maxConnections: number
    queryTimeout: number
  }
  cache: {
    defaultTtl: number
    maxSize: number
  }
  rateLimit: {
    enabled: boolean
    windowMs: number
    maxRequests: number
  }
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error'
    enableRequestLogging: boolean
  }
}

const getConfig = (env: Env): DeploymentConfig => {
  const base: DeploymentConfig = {
    environment: env.ENVIRONMENT,
    database: {
      maxConnections: 10,
      queryTimeout: 30000,
    },
    cache: {
      defaultTtl: 300, // 5 minutes
      maxSize: 1000,
    },
    rateLimit: {
      enabled: true,
      windowMs: 15 * 60 * 1000,
      maxRequests: 100,
    },
    logging: {
      level: 'info',
      enableRequestLogging: true,
    },
  }
  
  if (env.ENVIRONMENT === 'development') {
    return {
      ...base,
      rateLimit: { ...base.rateLimit, enabled: false },
      logging: { ...base.logging, level: 'debug' },
    }
  }
  
  if (env.ENVIRONMENT === 'production') {
    return {
      ...base,
      database: { ...base.database, maxConnections: 50 },
      cache: { ...base.cache, defaultTtl: 600 }, // 10 minutes
      logging: { ...base.logging, level: 'warn' },
    }
  }
  
  return base // staging
}
```

### Health Checks and Monitoring

```typescript
// Comprehensive health check endpoint
app.get('/api/health', async (c) => {
  const startTime = Date.now()
  const checks: Record<string, any> = {}
  
  // Database health check
  try {
    await db.select({ value: sql`1` }).limit(1)
    checks.database = { status: 'healthy', responseTime: Date.now() - startTime }
  } catch (error) {
    checks.database = { status: 'unhealthy', error: error.message }
  }
  
  // KV store health check
  try {
    const testKey = `health-check-${Date.now()}`
    await c.env.CACHE_KV.put(testKey, 'test', { expirationTtl: 60 })
    await c.env.CACHE_KV.delete(testKey)
    checks.kv = { status: 'healthy' }
  } catch (error) {
    checks.kv = { status: 'unhealthy', error: error.message }
  }
  
  // External service health checks
  try {
    const response = await fetch('https://external-api.example.com/health', {
      signal: AbortSignal.timeout(5000)
    })
    checks.externalService = { 
      status: response.ok ? 'healthy' : 'unhealthy',
      statusCode: response.status
    }
  } catch (error) {
    checks.externalService = { status: 'unhealthy', error: error.message }
  }
  
  const overallStatus = Object.values(checks).every(check => check.status === 'healthy')
    ? 'healthy' : 'unhealthy'
  
  const response = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    environment: c.env.ENVIRONMENT,
    version: '1.0.0',
    uptime: Date.now() - startTime,
    checks,
  }
  
  return c.json(response, overallStatus === 'healthy' ? 200 : 503)
})

// Metrics endpoint for monitoring
app.get('/api/metrics', async (c) => {
  // This would integrate with your monitoring system
  const metrics = {
    requests_total: await getMetric('requests_total'),
    requests_duration_ms: await getMetric('requests_duration_ms'),
    active_connections: await getMetric('active_connections'),
    memory_usage_mb: await getMetric('memory_usage_mb'),
  }
  
  return c.text(
    Object.entries(metrics)
      .map(([key, value]) => `${key} ${value}`)
      .join('\n'),
    200,
    { 'Content-Type': 'text/plain' }
  )
})
```

### Graceful Shutdown and Cleanup

```typescript
// Cleanup middleware for long-running operations
export const cleanupMiddleware = createMiddleware(async (c, next) => {
  const cleanup: Array<() => Promise<void>> = []
  
  c.set('addCleanup', (fn: () => Promise<void>) => {
    cleanup.push(fn)
  })
  
  try {
    await next()
  } finally {
    // Execute cleanup functions
    await Promise.allSettled(cleanup.map(fn => fn()))
  }
})

// Usage in routes
app.use('*', cleanupMiddleware)

app.post('/bulk-import', async (c) => {
  const addCleanup = c.get('addCleanup')
  
  // Register cleanup for temporary files or resources
  addCleanup(async () => {
    await cleanupTempFiles()
  })
  
  // Your bulk import logic here
  
  return c.json({ status: 'completed' })
})
```

---

## 🔧 Development Best Practices

### API Design Principles

#### 1. **RESTful Design**

- Use HTTP methods correctly (GET, POST, PUT, DELETE)
- Use meaningful resource names (`/users`, `/posts`, not `/getUsers`)
- Return appropriate status codes
- Use plural nouns for collections (`/users`, not `/user`)

#### 2. **Consistent Response Format**

```typescript
// Success response structure
interface SuccessResponse<T> {
  data: T
  meta?: {
    pagination?: {
      page: number
      limit: number
      total: number
      pages: number
    }
    timestamp?: string
    version?: string
  }
}

// Error response structure
interface ErrorResponse {
  error: string
  code?: string
  details?: any
  timestamp: string
  path: string
}

// Implementation
const formatSuccess = <T>(data: T, meta?: any): SuccessResponse<T> => ({
  data,
  ...(meta && { meta }),
})

const formatError = (error: string, code?: string, details?: any): ErrorResponse => ({
  error,
  ...(code && { code }),
  ...(details && { details }),
  timestamp: new Date().toISOString(),
  path: c.req.path,
})
```

#### 3. **Enhanced Validation with Custom Messages**

```typescript
// Reusable validation schemas with detailed error messages
const commonSchemas = {
  id: z.coerce.number().int().positive('ID must be a positive integer'),
  email: z.email('Please provide a valid email address')
    .max(255, 'Email address is too long'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number, and special character'
    ),
  pagination: z.object({
    page: z.coerce.number().int().min(1, 'Page must be at least 1').default(1),
    limit: z.coerce.number().int().min(1).max(100, 'Limit cannot exceed 100').default(10),
  }),
}

// Enhanced validation middleware with better error formatting
export const validateRequest = <T extends z.ZodType>(
  schema: T,
  source: 'body' | 'query' | 'params' = 'body'
) => createMiddleware(async (c, next) => {
  try {
    const data = source === 'body' ? await c.req.json() :
                source === 'query' ? c.req.query() :
                c.req.param()
    
    const result = schema.safeParse(data)
    
    if (!result.success) {
      const formattedErrors = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }))
      
      return c.json(formatError(
        'Validation failed',
        'VALIDATION_ERROR',
        { fields: formattedErrors }
      ), 400)
    }
    
    c.set(`validated${source.charAt(0).toUpperCase() + source.slice(1)}`, result.data)
    await next()
  } catch (error) {
    return c.json(formatError('Invalid request format', 'PARSE_ERROR'), 400)
  }
})
```

#### 4. **Advanced Error Handling with Context**

```typescript
// Enhanced error classes with context
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public context?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details: any) {
    super(message, 400, 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string, id?: string | number) {
    super(`${resource} not found`, 404, 'NOT_FOUND', { resource, id })
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends ApiError {
  constructor(message: string, conflictingField?: string) {
    super(message, 409, 'CONFLICT', { field: conflictingField })
    this.name = 'ConflictError'
  }
}

// Global error handler with detailed logging
export const globalErrorHandler = createMiddleware(async (c, next) => {
  try {
    await next()
  } catch (error) {
    console.error('API Error:', {
      error: error.message,
      stack: error.stack,
      path: c.req.path,
      method: c.req.method,
      timestamp: new Date().toISOString(),
      userAgent: c.req.header('User-Agent'),
      ip: c.req.header('cf-connecting-ip'),
    })
    
    if (error instanceof ApiError) {
      return c.json(formatError(error.message, error.code, error.context), error.statusCode)
    }
    
    if (error instanceof z.ZodError) {
      return c.json(formatError(
        'Validation failed',
        'VALIDATION_ERROR',
        error.flatten()
      ), 400)
    }
    
    // Database constraint violations
    if (error.message.includes('UNIQUE constraint failed')) {
      const field = error.message.match(/UNIQUE constraint failed: \w+\.(\w+)/)?.[1]
      return c.json(formatError(
        'Resource already exists',
        'UNIQUE_VIOLATION',
        { field }
      ), 409)
    }
    
    // Generic error with environment-specific details
    return c.json(formatError(
      'Internal server error',
      'INTERNAL_ERROR',
      c.env.ENVIRONMENT === 'development' ? { 
        message: error.message,
        stack: error.stack 
      } : undefined
    ), 500)
  }
})
```

#### 5. **Comprehensive Security Implementation**

```typescript
// Security headers middleware
export const securityHeaders = createMiddleware(async (c, next) => {
  await next()
  
  // Security headers
  c.header('X-Content-Type-Options', 'nosniff')
  c.header('X-Frame-Options', 'DENY')
  c.header('X-XSS-Protection', '1; mode=block')
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
  c.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  
  // CSP for API responses
  if (c.res.headers.get('Content-Type')?.includes('text/html')) {
    c.header('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none';")
  }
})

// Request size limiting
export const requestSizeLimit = (maxSize: number) => 
  createMiddleware(async (c, next) => {
    const contentLength = c.req.header('content-length')
    if (contentLength && parseInt(contentLength) > maxSize) {
      return c.json(formatError(
        'Request entity too large',
        'REQUEST_TOO_LARGE',
        { maxSize }
      ), 413)
    }
    await next()
  })
```

### Code Organization and Architecture

#### Feature-Based Structure

```text
/workers/
├── app.ts                    # Main application entry
├── /middleware/              # Shared middleware
│   ├── auth.ts
│   ├── validation.ts
│   ├── rate-limit.ts
│   └── error-handler.ts
├── /lib/                     # Shared utilities
│   ├── db.ts
│   ├── errors.ts
│   ├── validation.ts
│   └── utils.ts
├── /types/                   # Shared type definitions
│   ├── api.ts
│   ├── auth.ts
│   └── database.ts
└── /features/                # Feature-based organization
    ├── /auth/
    │   ├── routes.ts         # Auth routes
    │   ├── middleware.ts     # Auth-specific middleware
    │   ├── service.ts        # Business logic
    │   ├── validation.ts     # Auth validation schemas
    │   └── types.ts          # Auth type definitions
    ├── /users/
    │   ├── routes.ts
    │   ├── service.ts
    │   ├── validation.ts
    │   └── types.ts
    └── /posts/
        ├── routes.ts
        ├── service.ts
        ├── validation.ts
        └── types.ts
```

#### Service Layer Pattern

```typescript
// Base service class
export abstract class BaseService {
  constructor(protected db: DrizzleDB) {}
  
  protected async handleDatabaseError(error: any, operation: string) {
    console.error(`Database error in ${operation}:`, error)
    
    if (error.message.includes('UNIQUE constraint failed')) {
      throw new ConflictError('Resource already exists')
    }
    
    if (error.message.includes('FOREIGN KEY constraint failed')) {
      throw new ValidationError('Invalid reference', { constraint: 'foreign_key' })
    }
    
    throw new ApiError(`Database operation failed: ${operation}`)
  }
}

// User service implementation
export class UserService extends BaseService {
  async findById(id: number): Promise<User> {
    try {
      const user = await this.db.query.users.findFirst({
        where: eq(users.id, id),
        with: {
          profile: true,
          posts: {
            limit: 5,
            orderBy: desc(posts.createdAt),
          },
        },
      })
      
      if (!user) {
        throw new NotFoundError('User', id)
      }
      
      return user
    } catch (error) {
      if (error instanceof ApiError) throw error
      await this.handleDatabaseError(error, 'findById')
    }
  }
  
  async create(userData: CreateUserRequest): Promise<User> {
    try {
      const [user] = await this.db.insert(users)
        .values({
          ...userData,
          passwordHash: await hashPassword(userData.password),
        })
        .returning()
      
      return user
    } catch (error) {
      await this.handleDatabaseError(error, 'create')
    }
  }
  
  async update(id: number, updateData: UpdateUserRequest): Promise<User> {
    try {
      const [user] = await this.db.update(users)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning()
      
      if (!user) {
        throw new NotFoundError('User', id)
      }
      
      return user
    } catch (error) {
      if (error instanceof ApiError) throw error
      await this.handleDatabaseError(error, 'update')
    }
  }
}
```

### API Documentation and OpenAPI

```typescript
// OpenAPI schema generation
import { OpenAPIHono } from '@hono/zod-openapi'

const app = new OpenAPIHono<{ Bindings: Env }>()

// Define schemas for OpenAPI
const UserSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'John Doe' }),
  email: z.email().openapi({ example: 'john@example.com' }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
})

const CreateUserSchema = z.object({
  name: z.string().min(1).max(100).openapi({ 
    example: 'John Doe',
    description: 'Full name of the user'
  }),
  email: z.email().openapi({ 
    example: 'john@example.com',
    description: 'User email address'
  }),
  password: z.string().min(8).openapi({ 
    example: 'SecurePass123!',
    description: 'User password (min 8 characters)'
  }),
})

// Define routes with OpenAPI
const createUserRoute = createRoute({
  method: 'post',
  path: '/users',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateUserSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: z.object({
            data: UserSchema,
          }),
        },
      },
      description: 'User created successfully',
    },
    400: {
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            code: z.string(),
            details: z.any(),
          }),
        },
      },
      description: 'Validation error',
    },
  },
  tags: ['Users'],
  summary: 'Create a new user',
  description: 'Creates a new user account with the provided information',
})

app.openapi(createUserRoute, async (c) => {
  const userData = c.req.valid('json')
  const userService = c.get('services').userService
  
  const user = await userService.create(userData)
  
  return c.json(formatSuccess(user), 201)
})

// Auto-generated documentation
app.doc('/api/docs', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'NARA API',
    description: 'Comprehensive API for the NARA application',
  },
  servers: [
    {
      url: 'https://api.nara.dev',
      description: 'Production server',
    },
    {
      url: 'http://localhost:8787',
      description: 'Development server',
    },
  ],
})

// Swagger UI
app.get('/api/docs/ui', swaggerUI({ url: '/api/docs' }))
```

### Performance and Monitoring

```typescript
// Performance monitoring middleware
export const performanceMonitoring = createMiddleware(async (c, next) => {
  const start = performance.now()
  const timestamp = new Date().toISOString()
  
  // Track memory usage
  const memoryStart = process.memoryUsage?.() || { heapUsed: 0 }
  
  await next()
  
  const duration = performance.now() - start
  const memoryEnd = process.memoryUsage?.() || { heapUsed: 0 }
  const memoryDelta = memoryEnd.heapUsed - memoryStart.heapUsed
  
  // Log performance metrics
  const metrics = {
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
    duration: Math.round(duration * 100) / 100, // Round to 2 decimal places
    memoryDelta: memoryDelta / 1024 / 1024, // Convert to MB
    timestamp,
    userAgent: c.req.header('User-Agent'),
    ip: c.req.header('cf-connecting-ip'),
  }
  
  console.log('Performance:', metrics)
  
  // Send to analytics in production
  if (c.env.ENVIRONMENT === 'production') {
    // await sendToAnalytics(metrics)
  }
  
  // Add performance headers
  c.header('X-Response-Time', `${duration}ms`)
})

// Database query optimization
export class OptimizedQueryBuilder {
  static async findWithPagination<T>(
    db: DrizzleDB,
    table: any,
    options: {
      where?: any
      orderBy?: any
      page: number
      limit: number
      include?: any
    }
  ) {
    const { where, orderBy, page, limit, include } = options
    const offset = (page - 1) * limit
    
    // Use Promise.all for parallel queries
    const [items, [{ total }]] = await Promise.all([
      db.query[table].findMany({
        where,
        orderBy,
        limit,
        offset,
        ...(include && { with: include }),
      }),
      db.select({ total: count() }).from(table).where(where),
    ])
    
    return {
      data: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    }
  }
}
```

---

This enhanced API development guide provides a comprehensive foundation for building robust, scalable, and secure APIs with Hono and Cloudflare Workers in the NARA boilerplate. The guide now includes:

- **Advanced Security Patterns** - Comprehensive authentication, authorization, and input validation
- **Performance Optimization** - Caching strategies, query optimization, and monitoring
- **Error Handling** - Detailed error classes and context-aware error responses
- **Advanced Middleware** - Rate limiting, logging, security headers, and request processing
- **Code Organization** - Feature-based architecture and service layer patterns
- **API Documentation** - OpenAPI/Swagger integration for auto-generated docs
- **Deployment Considerations** - Health checks, monitoring, and environment-specific configs
- **Testing Strategies** - Unit, integration, and performance testing examples

These enhancements help developers build production-ready APIs that are secure, performant, and maintainable.

---

Built with ❤️ by KotonoSora — to help you ship faster and with confidence.
