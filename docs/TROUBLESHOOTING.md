# Troubleshooting Guide

This guide covers common issues, their solutions, and debugging strategies for the NARA boilerplate.

> **📋 Quick Diagnosis**
>
> **Most Common Issues:**
>
> - **Build Fails:** Check Node.js version → [E001](#e001-nodejs-version-mismatch)
> - **Database Error:** Check migrations → [E002](#e002-database-migration-failed)
> - **Type Errors:** Regenerate types → [E003](#e003-route-types-not-generated)
> - **Port in Use:** Kill process → [E004](#e004-port-already-in-use)
>
> **Emergency Reset:** Run [health check script](#health-check-script) first
>
> **Quick Navigation:** Development → [Environment Issues](#development-environment-issues) | React Router → [Framework Issues](#react-router-v7-framework-mode-issues) | Database → [Database Issues](#database-issues) | API → [Hono Issues](#hono-framework-issues)
>
> **Difficulty:** 🟡 Intermediate | **Time:** Variable (5-60 min per issue)

---

## 🚨 Common Issues and Solutions

### Development Environment Issues

#### **Bun Installation Problems**

**Problem**: `bun: command not found`

**Solution**:

**For Windows (PowerShell):**

```powershell
# Install Bun using PowerShell
irm bun.sh/install.ps1 | iex

# Add to PATH (run as Administrator if needed)
$env:PATH += ";$env:USERPROFILE\.bun\bin"

# Make PATH change permanent
[Environment]::SetEnvironmentVariable("PATH", $env:PATH, [EnvironmentVariableTarget]::User)

# Restart PowerShell or refresh environment
refreshenv  # if you have Chocolatey, otherwise restart terminal

# Verify installation
bun --version
```

**For Unix/Linux/macOS:**

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Add to PATH (add to ~/.bashrc or ~/.zshrc)
export PATH="$HOME/.bun/bin:$PATH"

# Reload shell
source ~/.bashrc  # or source ~/.zshrc

# Verify installation
bun --version
```

**Problem**: Bun version mismatch

**Solution**:

**For Windows (PowerShell):**

```powershell
# Check required version
Get-Content .bun-version

# Update Bun to latest
bun upgrade

# Or install specific version (1.2.19 as per package.json)
irm bun.sh/install.ps1 | iex -ArgumentList "bun-v1.2.19"

# Verify version
bun --version  # Should output 1.2.19
```

**For Unix/Linux/macOS:**

```bash
# Check required version
cat .bun-version

# Update Bun to latest
bun upgrade

# Or install specific version
curl -fsSL https://bun.sh/install | bash -s "bun-v1.2.19"

# Verify version
bun --version  # Should output 1.2.19
```

#### **Node.js Version Issues**

##### E001: Node.js Version Mismatch

**Problem**: Node.js version mismatch causing build failures

**Solution**:

**For Windows (PowerShell):**

```powershell
# Check required version (should be v22.17.0)
Get-Content .nvmrc

# Using nvm-windows (install from github.com/coreybutler/nvm-windows)
nvm install 22.17.0
nvm use 22.17.0

# Verify version
node --version  # Should match v22.17.0

# Alternative: Using fnm (Fast Node Manager)
fnm install 22.17.0
fnm use 22.17.0
```

**For Unix/Linux/macOS:**

```bash
# Check required version
cat .nvmrc

# Using nvm
nvm install
nvm use

# Verify version
node --version  # Should match .nvmrc (v22.17.0)
```

**Problem**: `Cannot find module` errors with Node.js

**Solution**:

**For Windows (PowerShell):**

```powershell
# Clear caches and reinstall
Remove-Item -Recurse -Force node_modules, bun.lock -ErrorAction SilentlyContinue
bun install

# If still failing, try with clean cache
bun install --no-cache

# Check for permission issues (run as Administrator if needed)
Get-Acl node_modules  # Check permissions

# Clear Bun cache if needed
bun pm cache rm
```

**For Unix/Linux/macOS:**

```bash
# Clear caches and reinstall
rm -rf node_modules bun.lock
bun install

# If still failing, try with clean cache
bun install --no-cache

# Clear Bun cache if needed
bun pm cache rm
```

---

### React Router v7 Framework Mode Issues

#### **Route Type Generation Problems**

##### E003: Route Types Not Generated

**Problem**: `Types are not being generated for routes` or `Cannot find module './+types/route'`

**Solution**:

```bash
# Clean generated types and regenerate
Remove-Item -Recurse -Force .react-router -ErrorAction SilentlyContinue  # PowerShell
# rm -rf .react-router  # Unix/Linux/macOS

# Regenerate route types
bun run typecheck

# If still failing, try manual generation
bunx react-router typegen

# Verify route configuration
Get-Content app/routes.ts  # PowerShell
# cat app/routes.ts  # Unix/Linux/macOS
```

**Problem**: `Type imports from +types are incorrect`

**Solution**:

```typescript
// ✅ CORRECT - Always use relative imports for route types
import type { LoaderFunctionArgs } from './+types/dashboard'
import type { ActionFunctionArgs } from './+types/settings'

// ❌ WRONG - Don't use absolute imports for route types
import type { LoaderFunctionArgs } from '@react-router/node'
```

#### **File-Based Routing Issues**

**Problem**: Routes not being recognized or 404 errors

**Solution**:

1. **Check file naming conventions:**

   ```text
   app/routes/
   ├── _index.tsx          # / (homepage)
   ├── about.tsx           # /about
   ├── blog._index.tsx     # /blog (blog homepage)
   ├── blog.$slug.tsx      # /blog/:slug (dynamic route)
   ├── dashboard.tsx       # /dashboard (layout route)
   ├── dashboard._index.tsx # /dashboard (dashboard homepage)
   └── admin.users.tsx     # /admin/users (nested route)
   ```

2. **Verify route exports:**

   ```typescript
   // Each route file must have a default export
   export default function BlogPost() {
     return <div>Blog Post</div>
   }
   
   // Optional: loader and action exports
   export async function loader({ params }: LoaderFunctionArgs) {
     return { slug: params.slug }
   }
   
   export async function action({ request }: ActionFunctionArgs) {
     const formData = await request.formData()
     return { success: true }
   }
   ```

**Problem**: Layout routes not working properly

**Solution**:

```typescript
// app/routes/dashboard.tsx (Layout route)
import { Outlet } from 'react-router'

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <nav>Dashboard Navigation</nav>
      <main>
        <Outlet />  {/* This renders child routes */}
      </main>
    </div>
  )
}

// app/routes/dashboard._index.tsx (Index route)
export default function DashboardHome() {
  return <div>Dashboard Home Content</div>
}
```

#### **Data Loading and Type Safety Issues**

**Problem**: `useLoaderData` type errors

**Solution**:

```typescript
// app/routes/users.$id.tsx
import type { LoaderFunctionArgs } from './+types/users.$id'
import { useLoaderData } from 'react-router'
import { db } from '~/database'

export async function loader({ params }: LoaderFunctionArgs) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, parseInt(params.id))
  })
  
  if (!user) {
    throw new Response('User not found', { status: 404 })
  }
  
  return { user }
}

export default function UserProfile() {
  // Type is automatically inferred from loader
  const { user } = useLoaderData<typeof loader>()
  
  return <div>User: {user.name}</div>
}
```

**Problem**: `useActionData` type errors

**Solution**:

```typescript
// app/routes/contact.tsx
import type { ActionFunctionArgs } from './+types/contact'
import { Form, useActionData } from 'react-router'

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const email = formData.get('email') as string
  
  // Validate and process form
  if (!email) {
    return { error: 'Email is required' }
  }
  
  return { success: true, message: 'Email sent!' }
}

export default function Contact() {
  const actionData = useActionData<typeof action>()
  
  return (
    <Form method="post">
      <input name="email" type="email" required />
      <button type="submit">Submit</button>
      
      {actionData?.error && <p className="error">{actionData.error}</p>}
      {actionData?.success && <p className="success">{actionData.message}</p>}
    </Form>
  )
}
```

---

### Database Issues

#### **Database Connection Problems**

**Problem**: `D1_ERROR: Database not found`

**Solution**:

1. Check `wrangler.jsonc` configuration:

   ```json
   {
     "d1_databases": [
       {
         "binding": "DB",
         "database_name": "your-database-name",
         "database_id": "your-database-id"
       }
     ]
   }
   ```

2. Verify environment variables in `.dev.vars`:

   ```text
   D1_DATABASE_ID=your-database-id
   ```

3. Create database if missing:

   ```bash
   npx wrangler d1 create your-database-name
   ```

**Problem**: Migration failures

##### E002: Database Migration Failed

**Solution**:

**For Windows (PowerShell):**

```powershell
# Check migration status
npx wrangler d1 migrations list DB --local

# Reset local database
Remove-Item -Force ".wrangler\state\v3\d1\miniflare-D1DatabaseObject\*.sqlite" -ErrorAction SilentlyContinue

# Re-run migrations
bun run db:migrate

# For production
bun run db:migrate-production

# If migrations are stuck, reset completely
Remove-Item -Recurse -Force .wrangler\state -ErrorAction SilentlyContinue
bun run db:generate
bun run db:migrate
```

**For Unix/Linux/macOS:**

```bash
# Check migration status
npx wrangler d1 migrations list DB --local

# Reset local database
rm -f .wrangler/state/v3/d1/miniflare-D1DatabaseObject/your-db.sqlite

# Re-run migrations
bun run db:migrate

# For production
bun run db:migrate-production
```

**Problem**: `table doesn't exist` errors

**Solution**:

```bash
# Generate and apply missing migrations
bun run db:generate
bun run db:migrate

# Check schema consistency
npx drizzle-kit introspect

# Verify database schema in Drizzle Studio
bunx drizzle-kit studio
```

**Problem**: `Database is locked` errors

**Solution**:

**For Windows (PowerShell):**

```powershell
# Stop any running development servers
# Press Ctrl+C in terminals running bun run dev or bun run start

# Kill any processes using the database
Get-Process | Where-Object {$_.ProcessName -like "*wrangler*" -or $_.ProcessName -like "*miniflare*"} | Stop-Process -Force

# Remove lock files
Remove-Item -Force ".wrangler\state\v3\d1\*.lock" -ErrorAction SilentlyContinue

# Restart development
bun run dev
```

**For Unix/Linux/macOS:**

```bash
# Stop any running development servers
pkill -f wrangler
pkill -f miniflare

# Remove lock files
rm -f .wrangler/state/v3/d1/*.lock

# Restart development
bun run dev
```

#### **Drizzle ORM Issues**

**Problem**: Type errors with Drizzle queries

**Solution**:

```typescript
// Make sure to import correct types from drizzle-orm ~0.44.3
import { eq, and, or, desc, count } from 'drizzle-orm'
import { users } from '~/database/schema'
import { db } from '~/database'

// ✅ CORRECT - Use proper typing for single result
const user: typeof users.$inferSelect | undefined = await db
  .select()
  .from(users)
  .where(eq(users.id, 1))
  .get() // Use .get() for single result

// ✅ CORRECT - Use proper typing for multiple results
const userList: (typeof users.$inferSelect)[] = await db
  .select()
  .from(users)
  .where(eq(users.active, true))
  .all() // Use .all() for multiple results

// ✅ CORRECT - Insert with proper typing
const newUser: typeof users.$inferInsert = {
  email: 'user@example.com',
  name: 'John Doe'
}
const result = await db.insert(users).values(newUser).returning()
```

**Problem**: Relation queries not working

**Solution**:

```typescript
// Make sure relations are properly defined in schema
import { relations } from 'drizzle-orm'

export const usersRelations = relations(users, ({ many, one }) => ({
  posts: many(posts),
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId]
  })
}))

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id]
  })
}))

// ✅ CORRECT - Use query API for relations (Drizzle v0.44+)
const usersWithPosts = await db.query.users.findMany({
  with: { 
    posts: {
      limit: 5,
      orderBy: desc(posts.createdAt)
    }
  }
})

// ✅ CORRECT - Nested relations
const userWithFullData = await db.query.users.findFirst({
  where: eq(users.id, 1),
  with: {
    posts: {
      with: {
        comments: true
      }
    },
    profile: true
  }
})
```

**Problem**: `Cannot read properties of undefined` with D1 database

**Solution**:

```typescript
// Make sure database connection is properly initialized
// database/index.ts
import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema'

export function createDbConnection(db: D1Database) {
  return drizzle(db, { schema })
}

// In your API route (workers/api/users.ts)
import { createDbConnection } from '~/database'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const db = createDbConnection(env.DB) // Make sure env.DB is defined
    
    // Check if database is available
    if (!env.DB) {
      return new Response('Database not available', { status: 500 })
    }
    
    try {
      const users = await db.query.users.findMany()
      return Response.json({ users })
    } catch (error) {
      console.error('Database error:', error)
      return new Response('Database error', { status: 500 })
    }
  }
}
```

**Problem**: Migration generation issues

**Solution**:

```bash
# Check drizzle.config.ts configuration
Get-Content drizzle.config.ts  # PowerShell
# cat drizzle.config.ts  # Unix/Linux/macOS

# Ensure proper configuration for D1
```

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './database/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.D1_DATABASE_ID!,
    token: process.env.CLOUDFLARE_API_TOKEN!,
  },
})
```

```bash
# Generate migrations with proper schema
bun run db:generate

# If generation fails, check schema syntax
bun run typecheck
```

---

### Hono Framework Issues

#### **API Route Problems**

**Problem**: `Cannot find module 'hono'` or Hono routes not working

**Solution**:

```typescript
// ✅ CORRECT - Proper Hono setup for Cloudflare Workers
// workers/api/index.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: ['http://localhost:5173', 'https://your-domain.com'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Routes
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api/users', async (c) => {
  const db = drizzle(c.env.DB, { schema })
  const users = await db.query.users.findMany()
  return c.json({ users })
})

export default app
```

**Problem**: `Context type errors` or `c.env` is undefined

**Solution**:

```typescript
// Make sure to properly type your Hono app with Bindings
import { Hono } from 'hono'

// Define your environment bindings
interface Env {
  DB: D1Database
  API_SECRET: string
  // Add other environment variables
}

const app = new Hono<{ Bindings: Env }>()

app.get('/api/users', async (c) => {
  // Now c.env is properly typed
  const db = drizzle(c.env.DB, { schema })
  const secret = c.env.API_SECRET
  
  // Rest of your code
})
```

**Problem**: CORS issues with Hono

**Solution**:

```typescript
import { cors } from 'hono/cors'

// ✅ CORRECT - Configure CORS properly
app.use('*', cors({
  origin: (origin) => {
    // Allow localhost in development
    if (origin?.includes('localhost') || origin?.includes('127.0.0.1')) {
      return origin
    }
    // Add your production domains
    return 'https://your-domain.com'
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
}))

// Handle preflight requests
app.options('*', (c) => c.text('OK'))
```

#### **Middleware Issues**

**Problem**: Middleware not executing or wrong order

**Solution**:

```typescript
// ✅ CORRECT - Middleware order matters
const app = new Hono<{ Bindings: Env }>()

// 1. CORS should be first (for preflight requests)
app.use('*', cors({ /* config */ }))

// 2. Logger for all requests
app.use('*', logger())

// 3. Authentication middleware for protected routes
app.use('/api/protected/*', async (c, next) => {
  const token = c.req.header('Authorization')
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  // Validate token
  await next()
})

// 4. Routes
app.get('/api/users', handler)
```

**Problem**: Custom middleware not working

**Solution**:

```typescript
// ✅ CORRECT - Custom middleware pattern
const authMiddleware = async (c: Context<{ Bindings: Env }>, next: Next) => {
  try {
    const token = c.req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return c.json({ error: 'Token required' }, 401)
    }
    
    // Validate token logic here
    // c.set('user', user) // Store user in context
    
    await next()
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401)
  }
}

// Use the middleware
app.use('/api/protected/*', authMiddleware)
```

#### **Request/Response Handling**

**Problem**: Request body parsing issues

**Solution**:

```typescript
app.post('/api/users', async (c) => {
  try {
    // ✅ CORRECT - Parse JSON body
    const body = await c.req.json()
    
    // ✅ CORRECT - Parse form data
    // const formData = await c.req.formData()
    // const name = formData.get('name') as string
    
    // ✅ CORRECT - Parse query parameters
    const page = c.req.query('page') || '1'
    const limit = c.req.query('limit') || '10'
    
    // Validate request body
    if (!body.email) {
      return c.json({ error: 'Email is required' }, 400)
    }
    
    // Process request
    const result = await createUser(body)
    
    return c.json({ success: true, data: result }, 201)
  } catch (error) {
    console.error('Request parsing error:', error)
    return c.json({ error: 'Invalid request body' }, 400)
  }
})
```

**Problem**: File upload handling

**Solution**:

```typescript
app.post('/api/upload', async (c) => {
  try {
    const formData = await c.req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return c.json({ error: 'No file uploaded' }, 400)
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type' }, 400)
    }
    
    // Process file (save to R2, etc.)
    const arrayBuffer = await file.arrayBuffer()
    
    return c.json({ 
      success: true, 
      filename: file.name,
      size: file.size 
    })
  } catch (error) {
    return c.json({ error: 'Upload failed' }, 500)
  }
})
```

---

### Build and Deployment Issues

#### **TypeScript Compilation Errors**

**Problem**: `Type error: Cannot find module` or path resolution issues

**Solution**:

1. Check `tsconfig.json` paths configuration:

   ```json
   {
     "compilerOptions": {
       "paths": {
         "~/*": ["./app/*"]
       }
     }
   }
   ```

2. Ensure `vite-tsconfig-paths` is configured:

   ```typescript
   // vite.config.ts
   import tsconfigPaths from 'vite-tsconfig-paths'
   
   export default defineConfig({
     plugins: [tsconfigPaths()]
   })
   ```

3. Regenerate route types:

   ```bash
   bun run typecheck
   ```

**Problem**: React Router type generation failures

**Solution**:

```bash
# Clean generated types
rm -rf .react-router

# Regenerate types
bunx react-router typegen

# Check route configuration
cat app/routes.ts
```

#### **Build Failures**

**Problem**: Vite build fails with memory errors

**Solution**:

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" bun run build

# Or update package.json
{
  "scripts": {
    "build": "NODE_OPTIONS=--max-old-space-size=4096 react-router build"
  }
}
```

**Problem**: Wrangler deployment failures

**Solution**:

```bash
# Check wrangler configuration
npx wrangler whoami

# Login if needed
npx wrangler login

# Verify configuration
npx wrangler preview

# Check compatibility date
# Update wrangler.jsonc if needed
{
  "compatibility_date": "2024-01-01"
}
```

---

### Runtime Issues

#### **React Router SSR Issues**

**Problem**: Hydration mismatches

**Solution**:

1. Ensure consistent rendering:

   ```typescript
   // Avoid date/time in initial render
   export default function Component() {
     const [mounted, setMounted] = useState(false)
     
     useEffect(() => {
       setMounted(true)
     }, [])
     
     if (!mounted) {
       return <div>Loading...</div>
     }
     
     return <div>{new Date().toLocaleDateString()}</div>
   }
   ```

2. Use proper data loading:

   ```typescript
   // Use loader for SSR-compatible data
   export async function loader() {
     return { timestamp: Date.now() }
   }
   
   export default function Component() {
     const { timestamp } = useLoaderData<typeof loader>()
     return <div>{new Date(timestamp).toLocaleDateString()}</div>
   }
   ```

**Problem**: Route not found errors

**Solution**:

1. Check file naming conventions:

   ```text
   app/routes/
   ├── _index.tsx          # /
   ├── about.tsx           # /about
   ├── users._index.tsx    # /users
   ├── users.$id.tsx       # /users/:id
   └── admin.users.tsx     # /admin/users
   ```

2. Verify route exports:

   ```typescript
   // Must have default export
   export default function UsersPage() {
     return <div>Users</div>
   }
   
   // Optional loader/action exports
   export async function loader() {}
   export async function action() {}
   ```

#### **Cloudflare Workers Issues**

**Problem**: Worker exceeds CPU time limit

**Solution**:

```typescript
// Optimize database queries
const users = await db.query.users.findMany({
  limit: 100, // Add pagination
  with: {
    posts: {
      limit: 5 // Limit relations
    }
  }
})

// Use indexes for better performance
const posts = await db
  .select()
  .from(posts)
  .where(eq(posts.authorId, userId)) // Make sure authorId has index
  .orderBy(desc(posts.createdAt))
```

**Problem**: Worker memory limits exceeded

**Solution**:

```typescript
// Stream large responses
app.get('/export', async (c) => {
  const stream = new ReadableStream({
    async start(controller) {
      const data = await db.select().from(largeTable)
      
      for (const row of data) {
        controller.enqueue(JSON.stringify(row) + '\n')
      }
      
      controller.close()
    }
  })
  
  return new Response(stream)
})

// Process data in batches
const batchSize = 1000
let offset = 0

while (true) {
  const batch = await db
    .select()
    .from(users)
    .limit(batchSize)
    .offset(offset)
  
  if (batch.length === 0) break
  
  await processBatch(batch)
  offset += batchSize
}
```

---

### Performance Issues

#### **Slow Database Queries**

**Problem**: Database queries taking too long

**Diagnosis**:

```typescript
// Add query timing
const start = Date.now()
const result = await db.select().from(users)
console.log(`Query took ${Date.now() - start}ms`)
```

**Solution**:

```typescript
// Add indexes
export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  email: text('email').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }),
}, (table) => ({
  emailIdx: uniqueIndex('email_idx').on(table.email),
  createdAtIdx: index('created_at_idx').on(table.createdAt),
}))

// Optimize query structure
const usersWithPostCount = await db
  .select({
    user: users,
    postCount: count(posts.id)
  })
  .from(users)
  .leftJoin(posts, eq(users.id, posts.authorId))
  .groupBy(users.id)
  .limit(10)
```

#### **Large Bundle Sizes**

**Problem**: JavaScript bundle too large

**Diagnosis**:

```bash
# Analyze bundle
bunx vite-bundle-analyzer

# Check individual chunks
bun run build && ls -la dist/assets/
```

**Solution**:

```typescript
// Lazy load components
const LazyComponent = lazy(() => import('./heavy-component'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  )
}

// Code split by route (automatic with React Router)
// Tree shake unused dependencies
import { specificFunction } from 'large-library/specific-function'
```

#### **Slow Page Loads**

**Problem**: Pages loading slowly

**Solution**:

```typescript
// Prefetch critical data
export async function loader() {
  const [users, posts] = await Promise.all([
    db.select().from(users).limit(10),
    db.select().from(posts).limit(5)
  ])
  
  return { users, posts }
}

// Use React Router's prefetch
<Link to="/users" prefetch="intent">Users</Link>

// Optimize images
<img 
  src="/image.jpg" 
  loading="lazy"
  width={300}
  height={200}
/>
```

---

### Testing Issues

#### **Test Failures**

**Problem**: Tests failing inconsistently

**Solution**:

```typescript
// Use proper test isolation
beforeEach(async () => {
  await db.delete(users)
  await db.delete(posts)
})

// Avoid race conditions
test('concurrent operations', async () => {
  const promises = [
    createUser({ email: 'user1@example.com' }),
    createUser({ email: 'user2@example.com' }),
  ]
  
  const users = await Promise.all(promises)
  expect(users).toHaveLength(2)
})

// Mock time-dependent code
vi.useFakeTimers()
vi.setSystemTime(new Date('2024-01-01'))
```

**Problem**: Cloudflare Workers tests not running

**Solution**:

```typescript
// Check vitest.config.ts
import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config'

export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.jsonc' },
      },
    },
  },
})

// Ensure test files use SELF
import { SELF } from 'cloudflare:test'

test('API endpoint', async () => {
  const response = await SELF.fetch('/api/health')
  expect(response.status).toBe(200)
})
```

---

### Environment Configuration Issues

#### **Environment Variables Not Loading**

**Problem**: Environment variables undefined in development

**Solution**:

1. Check `.dev.vars` file exists and has correct format:

   ```text
   DATABASE_URL=file:./local.db
   API_SECRET=your-secret-key
   ```

2. Verify wrangler.jsonc references the file:

   ```json
   {
     "vars": {
       "ENVIRONMENT": "development"
     }
   }
   ```

3. Access variables correctly:

   ```typescript
   // In worker context
   export default {
     async fetch(request: Request, env: Env) {
       console.log(env.API_SECRET)
       return new Response('OK')
     }
   }
   ```

#### **CORS Issues**

**Problem**: Cross-origin requests blocked

**Solution**:

```typescript
// Configure CORS properly
import { cors } from 'hono/cors'

app.use('*', cors({
  origin: [
    'http://localhost:5173',
    'https://your-domain.com'
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Handle preflight requests
app.options('*', (c) => c.text('OK'))
```

---

## 🔍 Debugging Strategies

### Logging and Monitoring

```typescript
// Structured logging
const logger = {
  info: (message: string, data?: any) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      data,
      timestamp: new Date().toISOString()
    }))
  },
  error: (message: string, error?: Error) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error?.message,
      stack: error?.stack,
      timestamp: new Date().toISOString()
    }))
  }
}

// Use in API handlers
app.get('/api/users', async (c) => {
  try {
    logger.info('Fetching users', { query: c.req.query() })
    const users = await db.select().from(users)
    logger.info('Users fetched successfully', { count: users.length })
    return c.json({ data: users })
  } catch (error) {
    logger.error('Failed to fetch users', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})
```

### Development Tools

```typescript
// React Developer Tools
// Install React Developer Tools browser extension

// Database inspection
// Use Drizzle Studio
bunx drizzle-kit studio

// Worker debugging
// Use wrangler dev with debugger
npx wrangler dev --local --inspect

// Network debugging
// Use browser dev tools Network tab
// Or use curl for API testing
curl -X GET http://localhost:5173/api/users \
  -H "Content-Type: application/json"
```

### Performance Profiling

```typescript
// Profile database queries
const profileQuery = async (name: string, queryFn: () => Promise<any>) => {
  const start = performance.now()
  const result = await queryFn()
  const duration = performance.now() - start
  console.log(`Query ${name} took ${duration.toFixed(2)}ms`)
  return result
}

// Usage
const users = await profileQuery('get-users', () =>
  db.select().from(users).limit(10)
)

// Profile API responses
app.use('*', async (c, next) => {
  const start = Date.now()
  await next()
  const duration = Date.now() - start
  c.header('X-Response-Time', `${duration}ms`)
})
```

---

## 📱 Browser-Specific Issues

### Safari Issues

**Problem**: Date parsing issues in Safari

**Solution**:

```typescript
// Use ISO format for dates
const date = new Date('2024-01-15T10:30:00.000Z') // ✅ ISO format
const date = new Date('2024-01-15 10:30:00') // ❌ Non-standard format

// Parse dates safely
const parseDate = (dateString: string) => {
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? null : date
}
```

### Chrome DevTools

**Problem**: Source maps not working

**Solution**:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    sourcemap: true, // Enable source maps
  },
})
```

---

## 🛠 Quick Fixes

### E004: Port Already in Use

**Problem**: `Port 5173 is already in use` or `EADDRINUSE: address already in use`

**Solution**:

**For Windows (PowerShell):**

```powershell
# Find and kill process using port 5173
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Or use npx to find and kill
npx kill-port 5173
```

**For Unix/Linux/macOS:**

```bash
# Find and kill process using port 5173
lsof -ti:5173 | xargs kill -9

# Or use npx to find and kill  
npx kill-port 5173
```

### Reset Development Environment

**For Windows (PowerShell):**

```powershell
# reset-dev.ps1

Write-Host "Resetting development environment..." -ForegroundColor Yellow

# Clean dependencies
Write-Host "Cleaning dependencies..." -ForegroundColor Cyan
Remove-Item -Recurse -Force node_modules, bun.lock -ErrorAction SilentlyContinue

# Clean build artifacts
Write-Host "Cleaning build artifacts..." -ForegroundColor Cyan
Remove-Item -Recurse -Force dist, .react-router -ErrorAction SilentlyContinue

# Clean database
Write-Host "Cleaning database..." -ForegroundColor Cyan
Remove-Item -Recurse -Force .wrangler\state -ErrorAction SilentlyContinue

# Reinstall dependencies
Write-Host "Reinstalling dependencies..." -ForegroundColor Cyan
bun install

# Reset database
Write-Host "Resetting database..." -ForegroundColor Cyan
bun run db:generate
bun run db:migrate

# Run tests
Write-Host "Running tests..." -ForegroundColor Cyan
bun run test

Write-Host "Environment reset complete!" -ForegroundColor Green
```

**For Unix/Linux/macOS:**

```bash
#!/bin/bash
# reset-dev.sh

echo "Resetting development environment..."

# Clean dependencies
rm -rf node_modules bun.lock

# Clean build artifacts
rm -rf dist .react-router

# Clean database
rm -rf .wrangler/state

# Reinstall dependencies
bun install

# Reset database
bun run db:generate
bun run db:migrate

# Run tests
bun run test

echo "Environment reset complete!"
```

### Health Check Script

**For Windows (PowerShell):**

```powershell
# health-check.ps1

Write-Host "Running health checks..." -ForegroundColor Yellow

# Check Node version
$nodeVersion = node --version
Write-Host "Node.js version: $nodeVersion" -ForegroundColor Cyan
$requiredNode = "v22.17.0"
if ($nodeVersion -ne $requiredNode) {
    Write-Host "❌ Node.js version mismatch. Required: $requiredNode" -ForegroundColor Red
    exit 1
}

# Check Bun version
$bunVersion = bun --version
Write-Host "Bun version: $bunVersion" -ForegroundColor Cyan
$requiredBun = "1.2.19"
if ($bunVersion -ne $requiredBun) {
    Write-Host "❌ Bun version mismatch. Required: $requiredBun" -ForegroundColor Red
    exit 1
}

# Check if dependencies are installed
if (!(Test-Path "node_modules")) {
    Write-Host "❌ Dependencies not installed. Run: bun install" -ForegroundColor Red
    exit 1
}

# Check if database exists
if (!(Test-Path ".wrangler\state\v3\d1\miniflare-D1DatabaseObject\DB.sqlite")) {
    Write-Host "❌ Database not initialized. Run: bun run db:migrate" -ForegroundColor Red
    exit 1
}

# Check TypeScript
Write-Host "Checking TypeScript..." -ForegroundColor Cyan
bun run typecheck

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ All health checks passed!" -ForegroundColor Green
} else {
    Write-Host "❌ TypeScript check failed!" -ForegroundColor Red
    exit 1
}
```

**For Unix/Linux/macOS:**

```bash
#!/bin/bash
# health-check.sh

echo "Running health checks..."

# Check Node version
echo "Node.js version: $(node --version)"
REQUIRED_NODE="v22.17.0"
if [ "$(node --version)" != "$REQUIRED_NODE" ]; then
  echo "❌ Node.js version mismatch. Required: $REQUIRED_NODE"
  exit 1
fi

# Check Bun version
echo "Bun version: $(bun --version)"
REQUIRED_BUN="1.2.19"
if [ "$(bun --version)" != "$REQUIRED_BUN" ]; then
  echo "❌ Bun version mismatch. Required: $REQUIRED_BUN"
  exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
  echo "❌ Dependencies not installed. Run: bun install"
  exit 1
fi

# Check if database exists
if [ ! -f ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/DB.sqlite" ]; then
  echo "❌ Database not initialized. Run: bun run db:migrate"
  exit 1
fi

# Check TypeScript
echo "Checking TypeScript..."
bun run typecheck

echo "✅ All health checks passed!"
```

### Development Workflow Helper

**For Windows (PowerShell):**

```powershell
# dev-start.ps1 - Complete development startup script

Write-Host "🚀 Starting NARA development environment..." -ForegroundColor Yellow

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Cyan

# Check Bun
if (!(Get-Command bun -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Bun not found. Please install Bun first." -ForegroundColor Red
    exit 1
}

# Check Node
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Install dependencies if needed
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
    bun install
}

# Setup database if needed
if (!(Test-Path ".wrangler\state\v3\d1")) {
    Write-Host "🗄️ Setting up database..." -ForegroundColor Cyan
    bun run db:generate
    bun run db:migrate
}

# Generate types
Write-Host "🔧 Generating types..." -ForegroundColor Cyan
bun run typecheck

# Start development server
Write-Host "🌟 Starting development server..." -ForegroundColor Green
Write-Host "Visit: http://localhost:5173" -ForegroundColor Cyan
bun run dev
```

---

## 📞 Getting Help

### Resources

1. **Official Documentation**
   - [React Router v7](https://reactrouter.com)
   - [Cloudflare Workers](https://developers.cloudflare.com/workers/)
   - [Drizzle ORM](https://orm.drizzle.team)
   - [Hono](https://hono.dev)

2. **Community Support**
   - GitHub Issues: Create detailed bug reports
   - Discord Communities: React Router, Cloudflare
   - Stack Overflow: Tag questions appropriately

3. **Project-Specific Help**
   - Check existing GitHub issues
   - Review documentation in `/docs/`
   - Run health check script

### Bug Report Template

```markdown
## Bug Description
Brief description of the issue

## Environment
- OS: [e.g., Windows 11, macOS 14.0, Ubuntu 22.04]
- Node.js: [e.g., v22.17.0]
- Bun: [e.g., 1.2.19]
- Browser: [e.g., Chrome 120, Firefox 119, Safari 17]
- Shell: [e.g., PowerShell 7.x, bash, zsh]

## NARA Stack Versions
- React Router: [e.g., 7.7.1]
- Drizzle ORM: [e.g., 0.44.3]
- Hono: [e.g., 4.8.5]
- Cloudflare Workers: [e.g., compatibility date]

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Error Messages

Paste any error messages here, including:

- Console errors (browser dev tools)
- Terminal output
- TypeScript compilation errors
- Wrangler deployment errors

## Code Samples

```typescript
// Include relevant code snippets
// that might be causing the issue
```

## Additional Context

- Have you run the health check script?
- Have you tried resetting the development environment?
- Any recent changes to dependencies or configuration?
- Does this happen in a fresh project clone?

## Workaround (if any)

Any temporary solutions you've found

## Related Issues

Link to any related GitHub issues or Stack Overflow questions

---

This troubleshooting guide should help you resolve most common issues encountered while developing with the NARA boilerplate. When in doubt, start with the health check script and work through the common issues systematically.

---

Built with ❤️ by KotonoSora — to help you ship faster and with confidence.
