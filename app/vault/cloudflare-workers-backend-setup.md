---
title: "Cloudflare Workers Backend Setup"
description: "Backend implementation using Cloudflare Workers, Hono framework, and D1 database"
date: "2026-02-22"
published: true
author: "Development Team"
tags: ["workers", "cloudflare", "backend", "hono", "serverless"]
---

# Cloudflare Workers Backend Setup

## Overview

NARA's backend runs on **Cloudflare Workers** using the **Hono** web framework, providing zero-cold-start serverless computing with global edge distribution and integrated D1 database access.

## Architecture

### Worker Structure

```
workers/
├── app.ts                    # Hono app initialization
├── routes.ts                 # Route mounting
├── api/                      # API endpoint implementations
│   ├── auth.ts              # Authentication endpoints
│   ├── users.ts             # User management
│   ├── posts.ts             # Blog posts
│   ├── comments.ts          # Comments system
│   └── ... more routes
├── middleware/              # Worker middleware
│   ├── cors.ts
│   ├── errorHandler.ts
│   ├── auth.ts
│   └── validation.ts
└── types.ts                 # Type definitions

wrangler.jsonc              # Cloudflare configuration
```

## Worker Setup

### Wrangler Configuration

`wrangler.jsonc`:

```jsonc
{
  "name": "nara-worker",
  "main": "workers/app.ts",
  "type": "service",
  
  // Database binding
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "nara-db",
      "database_id": "your-db-id"
    }
  ],
  
  // Environment variables
  "vars": {
    "ENVIRONMENT": "production",
    "APP_URL": "https://example.com"
  },
  
  // Secrets (via wrangler secret put)
  "secrets": ["JWT_SECRET", "API_KEY"],
  
  // Build configuration
  "build": {
    "command": "npm run build"
  },
  
  // Routes
  "routes": [
    { "pattern": "example.com/api/*", "zone_name": "example.com" }
  ],
  
  // Compatibility date (use latest stable)
  "compatibility_date": "2026-02-22",
  
  // Triggers
  "triggers": {
    "crons": ["0 0 * * *"]  // Cron jobs
  }
}
```

### Main App File

`workers/app.ts`:

```typescript
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { poweredBy } from 'hono/powered-by'
import { errorHandler } from './middleware/errorHandler'
import { authMiddleware } from './middleware/auth'
import { routes } from './routes'

type Bindings = {
  DB: D1Database
}

type Variables = {
  userId?: string
  user?: any
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

// Global middleware
app.use('*', poweredBy())
app.use('*', logger())
app.use(
  '*',
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  })
)

// Mount routes
routes(app)

// Error handling
app.onError(errorHandler)

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

export default app
```

### Routes Setup

`workers/routes.ts`:

```typescript
import { Hono } from 'hono'
import { authRoutes } from './api/auth'
import { userRoutes } from './api/users'
import { postRoutes } from './api/posts'
import { commentRoutes } from './api/comments'

export function routes(app: Hono) {
  // API routes
  app.route('/api/auth', authRoutes)
  app.route('/api/users', userRoutes)
  app.route('/api/posts', postRoutes)
  app.route('/api/comments', commentRoutes)
  
  // Health check
  app.get('/health', (c) => {
    return c.json({ status: 'ok' })
  })
}
```

## API Endpoints

### Authentication API

`workers/api/auth.ts`:

```typescript
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { drizzle } from 'drizzle-orm/d1'
import { users } from '~/database/schema'
import { eq } from 'drizzle-orm'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const authRoutes = new Hono()

// Login endpoint
authRoutes.post(
  '/login',
  zValidator('json', loginSchema),
  async (c) => {
    const db = drizzle(c.env.DB)
    const { email, password } = c.req.valid('json')

    // Verify credentials
    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    })

    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Verify password (async hash comparison)
    const passwordValid = await verifyPassword(password, user.passwordHash)
    if (!passwordValid) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Create JWT token
    const token = await createJWT({
      userId: user.id,
      email: user.email
    }, c.env.JWT_SECRET)

    return c.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
  }
)

// Logout endpoint
authRoutes.post('/logout', (c) => {
  // Invalidate token (implementation depends on strategy)
  return c.json({ success: true })
})

// Verify token endpoint
authRoutes.get(
  '/verify',
  async (c) => {
    const token = c.req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return c.json({ error: 'No token provided' }, 401)
    }

    try {
      const payload = await verifyJWT(token, c.env.JWT_SECRET)
      return c.json({ valid: true, userId: payload.userId })
    } catch (error) {
      return c.json({ error: 'Invalid token' }, 401)
    }
  }
)
```

### User API

`workers/api/users.ts`:

```typescript
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { drizzle } from 'drizzle-orm/d1'
import { users as usersTable } from '~/database/schema'
import { eq } from 'drizzle-orm'

const updateUserSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  picture: z.string().url().optional()
})

export const userRoutes = new Hono()

// Get current user
userRoutes.get('/me', async (c) => {
  const userId = c.get('userId')
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const db = drizzle(c.env.DB)
  const user = await db.query.users.findFirst({
    where: eq(usersTable.id, userId)
  })

  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  const { passwordHash, ...userWithoutPassword } = user
  return c.json(userWithoutPassword)
})

// Get user by ID
userRoutes.get('/:id', async (c) => {
  const db = drizzle(c.env.DB)
  const user = await db.query.users.findFirst({
    where: eq(usersTable.id, c.req.param('id'))
  })

  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  const { passwordHash, ...userWithoutPassword } = user
  return c.json(userWithoutPassword)
})

// Update user
userRoutes.put(
  '/me',
  zValidator('json', updateUserSchema),
  async (c) => {
    const userId = c.get('userId')
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const db = drizzle(c.env.DB)
    const data = c.req.valid('json')

    const updated = await db.update(usersTable)
      .set(data)
      .where(eq(usersTable.id, userId))
      .returning()

    return c.json(updated[0])
  }
)

// List users (paginated)
userRoutes.get('', async (c) => {
  const db = drizzle(c.env.DB)
  const limit = parseInt(c.req.query('limit') || '10')
  const offset = parseInt(c.req.query('offset') || '0')

  const allUsers = await db.query.users.findMany({
    limit,
    offset
  })

  return c.json(allUsers.map(u => {
    const { passwordHash, ...rest } = u
    return rest
  }))
})
```

### Post API

`workers/api/posts.ts`:

```typescript
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { drizzle } from 'drizzle-orm/d1'
import { posts, users } from '~/database/schema'
import { eq, desc } from 'drizzle-orm'

const createPostSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  content: z.string(),
  excerpt: z.string().optional(),
  category: z.string().optional()
})

export const postRoutes = new Hono()

// Get all posts
postRoutes.get('', async (c) => {
  const db = drizzle(c.env.DB)
  const limit = parseInt(c.req.query('limit') || '20')
  const offset = parseInt(c.req.query('offset') || '0')
  const published = c.req.query('published') === 'true'

  let query = db.query.posts.findMany({
    with: {
      author: {
        columns: {
          id: true,
          name: true,
          picture: true
        }
      }
    },
    orderBy: desc(posts.createdAt),
    limit,
    offset
  })

  // Filter by published status if not admin
  const allPosts = await query

  return c.json(allPosts)
})

// Get post by slug
postRoutes.get('/:slug', async (c) => {
  const db = drizzle(c.env.DB)
  
  const post = await db.query.posts.findFirst({
    where: eq(posts.slug, c.req.param('slug')),
    with: {
      author: true
    }
  })

  if (!post) {
    return c.json({ error: 'Post not found' }, 404)
  }

  return c.json(post)
})

// Create post
postRoutes.post(
  '',
  zValidator('json', createPostSchema),
  async (c) => {
    const userId = c.get('userId')
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const db = drizzle(c.env.DB)
    const data = c.req.valid('json')

    const newPost = await db.insert(posts).values({
      id: crypto.randomUUID(),
      userId,
      ...data,
      published: false
    }).returning()

    return c.json(newPost[0], 201)
  }
)

// Update post
postRoutes.put(
  '/:id',
  zValidator('json', createPostSchema.partial()),
  async (c) => {
    const userId = c.get('userId')
    const postId = c.req.param('id')

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const db = drizzle(c.env.DB)
    
    // Check ownership
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, postId)
    })

    if (!post || post.userId !== userId) {
      return c.json({ error: 'Forbidden' }, 403)
    }

    const data = c.req.valid('json')
    const updated = await db.update(posts)
      .set(data)
      .where(eq(posts.id, postId))
      .returning()

    return c.json(updated[0])
  }
)

// Delete post
postRoutes.delete('/:id', async (c) => {
  const userId = c.get('userId')
  const postId = c.req.param('id')

  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const db = drizzle(c.env.DB)
  
  // Check ownership
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, postId)
  })

  if (!post || post.userId !== userId) {
    return c.json({ error: 'Forbidden' }, 403)
  }

  await db.delete(posts).where(eq(posts.id, postId))
  
  return c.json({ success: true })
})
```

## Middleware

### Authentication Middleware

`workers/middleware/auth.ts`:

```typescript
import { Hono } from 'hono'
import { bearerAuth } from 'hono/bearer-auth'

export function authMiddleware(app: Hono) {
  app.use('/api/*', async (c, next) => {
    // Skip auth for public endpoints
    const publicEndpoints = ['/api/auth/login', '/api/posts']
    if (publicEndpoints.includes(c.req.path)) {
      return await next()
    }

    const token = c.req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return c.json({ error: 'No token provided' }, 401)
    }

    try {
      const payload = await verifyJWT(token, c.env.JWT_SECRET)
      c.set('userId', payload.userId)
    } catch (error) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    await next()
  })
}
```

### Error Handler

`workers/middleware/errorHandler.ts`:

```typescript
import { HTTPException } from 'hono/http-exception'

export const errorHandler = (err: Error | HTTPException, c: Context) => {
  console.error('Error:', err)

  if (err instanceof HTTPException) {
    return err.getResponse()
  }

  if (err instanceof ZodError) {
    return c.json({
      error: 'Validation error',
      details: err.flatten()
    }, 400)
  }

  return c.json({
    error: 'Internal server error',
    message: err.message
  }, 500)
}
```

## Database Access

### Drizzle Integration

```typescript
import { drizzle } from 'drizzle-orm/d1'
import * as schema from '~/database/schema'

authRoutes.get('/data', async (c) => {
  const db = drizzle(c.env.DB, { schema })

  const users = await db.query.users.findMany()
  return c.json(users)
})
```

## Deployment

### Deploy to Cloudflare

```bash
# Login to Cloudflare
wrangler login

# Deploy
wrangler deploy

# Deploy to specific environment
wrangler deploy --env production

# View logs
wrangler tail
```

### Environment Setup

```bash
# Set secrets
wrangler secret put JWT_SECRET
wrangler secret put DATABASE_URL

# Check bindings
wrangler tail
```

## Local Development

### Run Local Worker

```bash
# Start local server
npm run dev

# Runs on http://localhost:8787/api/*
```

### Test API Locally

```bash
# Login
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get posts
curl http://localhost:8787/api/posts

# Create post with auth
curl -X POST http://localhost:8787/api/posts \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Post","slug":"new-post","content":"Content..."}'
```

## Performance & Optimization

### Caching

```typescript
export const postRoutes = new Hono()

postRoutes.get('/:slug', async (c) => {
  // Set cache headers
  c.header('Cache-Control', 'public, max-age=3600')
  
  const db = drizzle(c.env.DB)
  const post = await db.query.posts.findFirst({
    where: eq(posts.slug, c.req.param('slug'))
  })

  return c.json(post)
})
```

### Request Validation

```typescript
import { zValidator } from '@hono/zod-validator'

app.post('/submit', zValidator('json', schema), (c) => {
  // Validated data is available via c.req.valid('json')
  const data = c.req.valid('json')
  return c.json({ success: true })
})
```

## Monitoring

### Error Tracking

```typescript
export const errorHandler = (err: Error, c: Context) => {
  // Send to error tracking service
  await sendToSentry({
    exception: err,
    request: c.req
  })

  return c.json({ error: 'Internal error' }, 500)
}
```

### Request Logging

```typescript
app.use('*', logger())

app.use('*', async (c, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  console.log(`${c.req.method} ${c.req.path} - ${ms}ms`)
})
```

## Best Practices

1. **Validate input**: Use Zod validators for all endpoints
2. **Error handling**: Proper error responses with status codes
3. **Database queries**: Use relations efficiently, avoid N+1
4. **Authentication**: Always verify tokens server-side
5. **CORS**: Configure properly for security
6. **Rate limiting**: Implement to prevent abuse
7. **Logging**: Monitor and debug with proper logs
8. **Type safety**: Use TypeScript for type-safe APIs
9. **Testing**: Test endpoints before deployment
10. **Monitoring**: Track performance and errors

---

Cloudflare Workers provides a powerful, serverless backend platform fully integrated with the NARA full-stack framework.
