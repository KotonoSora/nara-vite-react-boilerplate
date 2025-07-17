# Troubleshooting Guide

This guide covers common issues, their solutions, and debugging strategies for the NARA boilerplate.

---

## 🚨 Common Issues and Solutions

### Development Environment Issues

#### **Bun Installation Problems**

**Problem**: `bun: command not found`

**Solution**:
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
```bash
# Check required version
cat .bun-version

# Update Bun to latest
bun upgrade

# Or install specific version
curl -fsSL https://bun.sh/install | bash -s "bun-v1.2.18"
```

#### **Node.js Version Issues**

**Problem**: Node.js version mismatch causing build failures

**Solution**:
```bash
# Check required version
cat .nvmrc

# Using nvm
nvm install
nvm use

# Verify version
node --version  # Should match .nvmrc
```

**Problem**: `Cannot find module` errors with Node.js

**Solution**:
```bash
# Clear caches and reinstall
rm -rf node_modules bun.lock
bun install

# If still failing, try with clean cache
bun install --no-cache
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
   ```
   D1_DATABASE_ID=your-database-id
   ```

3. Create database if missing:
   ```bash
   npx wrangler d1 create your-database-name
   ```

**Problem**: Migration failures

**Solution**:
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
```

#### **Drizzle ORM Issues**

**Problem**: Type errors with Drizzle queries

**Solution**:
```typescript
// Make sure to import correct types
import { eq, and, or } from 'drizzle-orm'
import { users } from '~/database/schema'

// Use proper typing
const user: typeof users.$inferSelect = await db
  .select()
  .from(users)
  .where(eq(users.id, 1))
  .get() // Use .get() for single result
```

**Problem**: Relation queries not working

**Solution**:
```typescript
// Make sure relations are properly defined
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}))

// Use query API for relations
const usersWithPosts = await db.query.users.findMany({
  with: { posts: true }
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
   ```
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
   ```
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

### Reset Development Environment

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
REQUIRED_BUN="1.2.18"
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
bun run lint

echo "✅ All health checks passed!"
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
- OS: [e.g., macOS 14.0]
- Node.js: [e.g., v22.17.0]
- Bun: [e.g., 1.2.18]
- Browser: [e.g., Chrome 120]

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Error Messages
```
Paste any error messages here
```

## Additional Context
Any other relevant information
```

---

This troubleshooting guide should help you resolve most common issues encountered while developing with the NARA boilerplate. When in doubt, start with the health check script and work through the common issues systematically.

---

Built with ❤️ by KotonoSora — to help you ship faster and with confidence.