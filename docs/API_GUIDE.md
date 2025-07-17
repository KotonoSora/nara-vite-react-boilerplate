# API Development Guide

This guide covers API development with Hono framework on Cloudflare Workers, including routing, middleware, validation, and best practices.

---

## 🌐 API Architecture Overview

The NARA boilerplate uses **Hono** as the web framework for building APIs on Cloudflare Workers:

- **Hono Framework** - Fast, lightweight web framework
- **Cloudflare Workers** - Edge runtime environment
- **Type Safety** - End-to-end TypeScript support
- **Performance** - Sub-millisecond response times

### Project Structure

```
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
  email: z.string().email(),
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

## 🔧 Development Best Practices

### API Design Principles

1. **RESTful Design**
   - Use HTTP methods correctly (GET, POST, PUT, DELETE)
   - Use meaningful resource names
   - Return appropriate status codes

2. **Consistent Response Format**
   ```typescript
   // Success response
   {
     data: any,
     meta?: any
   }
   
   // Error response
   {
     error: string,
     details?: any
   }
   ```

3. **Validation**
   - Validate all inputs
   - Return detailed validation errors
   - Use TypeScript for compile-time safety

4. **Error Handling**
   - Return consistent error formats
   - Use appropriate HTTP status codes
   - Log errors for debugging

5. **Security**
   - Validate and sanitize inputs
   - Use authentication/authorization
   - Implement rate limiting
   - Set appropriate CORS headers

### Code Organization

```typescript
// Feature-based API structure
/api/
├── users/
│   ├── index.ts        # Main routes
│   ├── middleware.ts   # User-specific middleware
│   ├── validation.ts   # Schemas
│   └── service.ts      # Business logic
├── posts/
│   ├── index.ts
│   ├── middleware.ts
│   ├── validation.ts
│   └── service.ts
└── shared/
    ├── middleware/
    ├── types/
    └── utils/
```

---

This API development guide provides a comprehensive foundation for building robust, scalable APIs with Hono and Cloudflare Workers in the NARA boilerplate.

---

Built with ❤️ by KotonoSora — to help you ship faster and with confidence.