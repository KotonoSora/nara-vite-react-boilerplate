# Developer Onboarding Guide

Welcome to the NARA (Non‑Abstract Reusable App) boilerplate! This guide will help you get up and running as a developer on this project.

## Table of Contents

- [🚀 Quick Setup Checklist](#-quick-setup-checklist)
- [📁 Understanding the Project Structure](#-understanding-the-project-structure)
- [🛠 Development Workflow](#-development-workflow)
- [🧩 Core Technologies Overview](#-core-technologies-overview)
- [🌐 Environment Setup](#-environment-setup)
- [🎯 Common Development Tasks](#-common-development-tasks)
- [🔧 VS Code Setup](#-vs-code-setup)
- [🧪 Testing Guide](#-testing-guide)
- [🚀 Performance Tips](#-performance-tips)
- [🆘 Getting Help](#-getting-help)
- [🎉 Next Steps](#-next-steps)

---

## 🚀 Quick Setup Checklist

> **📋 Quick Reference**
>
> **Essential Commands:**
>
> - `bun install` - Install dependencies
> - `bun run dev` - Start development server (<http://localhost:5173>)
> - `bun run test` - Run tests
> - `bun run db:migrate` - Apply database migrations
> - `bun run typecheck` - TypeScript validation
>
> **Common Issues:** Port 5173 in use → [Troubleshooting Guide](./TROUBLESHOOTING.md#port-already-in-use)  
> **Time to setup:** ~30 minutes | **Difficulty:** 🟢 Beginner

### Prerequisites

- [ ] **Node.js v22.17.1** (use `.nvmrc`: `nvm use`)

  ```bash
  # Install Node.js using nvm (recommended)
  nvm install 22.17.1
  nvm use 22.17.1
  # Or download from https://nodejs.org/
  ```

- [ ] **Bun 1.2.18** (install from [bun.sh](https://bun.sh))

  ```bash
  # Install Bun (fast package manager)
  curl -fsSL https://bun.sh/install | bash
  # Verify installation
  bun --version
  ```

- [ ] **Git** for version control

  ```bash
  # Verify Git installation
  git --version
  ```

- [ ] **VS Code** (recommended) with suggested extensions
  - Extensions will be automatically suggested when you open the project
  - See [VS Code Setup](#-vs-code-setup) for details

### Initial Setup

- [ ] **Clone the repository**

  ```bash
  git clone <repository-url>
  cd nara-vite-react-boilerplate
  ```

- [ ] **Install dependencies**

  ```bash
  bun install
  ```

- [ ] **Set up environment variables** (see [Environment Setup](#-environment-setup))
- [ ] **Initialize database**

  ```bash
  bun run db:generate && bun run db:migrate
  ```

- [ ] **Start development server**

  ```bash
  bun run dev
  ```

- [ ] **Verify setup** by visiting `http://localhost:5173`
  - You should see the NARA boilerplate landing page
  - Check browser console for any errors

---

## 📁 Understanding the Project Structure

The NARA boilerplate follows a feature-based architecture with clear separation of concerns:

```text
/app
  /components       # Shared UI components (shadcn/ui system)
  /features         # Feature-based modules (landing-page, showcases)
  /routes           # File-based routing (React Router v7)
  /hooks            # Custom React hooks
  /lib              # Utility functions and shared logic
  root.tsx          # App shell and layout
  entry.server.tsx  # Server-side rendering entry point

/workers            # Cloudflare Workers backend
  /api              # API route handlers (Hono framework)
  app.ts            # Worker entry point

/database           # Database layer
  schema.ts         # Drizzle ORM schema definitions

/docs               # Project documentation
```

### Key Concepts

#### **1. Feature-Based Organization**

- Each feature lives in `/app/features/[feature-name]/`
- Features contain their own components, utils, types, and context
- Features export a main `page.tsx` component

#### **2. File-Based Routing**

- Routes are defined by file structure in `/app/routes/`
- Use `_index.tsx` for index routes
- Use `action.*.ts` for server actions
- Route types are automatically generated

#### **3. Full-Stack Integration**

- Frontend (React Router v7) + Backend (Hono on Cloudflare Workers)
- Type-safe end-to-end with TypeScript
- Database integration via Drizzle ORM + Cloudflare D1

---

## 🛠 Development Workflow

### Day-to-Day Development

> **📋 Quick Reference**
>
> **Cross-Platform Commands:**
>
> - `bun run dev` - Start development server
> - `bun run test` - Run all tests
> - `bun run test --watch` - Run tests in watch mode
> - `bun run typecheck` - TypeScript validation
> - `bun run db:generate` - Generate migrations
> - `bun run db:migrate` - Apply migrations locally
>
> **Common Workflows:**
>
> - **New Feature:** Create feature → Add route → Write tests → Commit
> - **Database Change:** Update schema → Generate migration → Test → Deploy
> - **Bug Fix:** Identify issue → Write test → Fix → Verify → Commit
> - **Problem Solving:** Issue occurs → Check [Troubleshooting Guide](./TROUBLESHOOTING.md) → Apply solution
>
> **Need Help:** [Troubleshooting Guide](./TROUBLESHOOTING.md) | [Testing Guide](./TESTING_GUIDE.md) | [Project Overview](./PROJECT_OVERVIEW.md)

1. **Start Development Server**

   ```bash
   bun run dev
   # → Frontend: http://localhost:5173
   # → API: Available through React Router proxy
   ```

2. **Run Tests**

   ```bash
   bun run test          # Run tests
   bun run test --ui     # Run tests with UI
   bun run coverage      # Generate coverage report
   ```

3. **Type Checking**

   ```bash
   bun run typecheck     # TypeScript + React Router type generation
   bun run lint          # TypeScript no-emit check
   ```

4. **Database Operations**

   ```bash
   bun run db:generate   # Generate migrations from schema changes
   bun run db:migrate    # Apply migrations locally
   ```

### Code Quality Checks

The project enforces code quality through:

- **TypeScript** strict mode
- **Prettier** for code formatting
- **Commitlint** for commit message convention
- **Husky** for pre-commit hooks
- **Vitest** for testing

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add user authentication
fix: resolve database connection issue
docs: update API documentation
style: fix code formatting
refactor: restructure user components
test: add unit tests for auth flow
chore: update dependencies
```

---

## 🧩 Core Technologies Overview

### Frontend Stack

- **React 19.1.0** - UI library with latest features
- **React Router v7.7.0** - File-based routing with SSR
- **TypeScript 5.8.3** - Type safety
- **TailwindCSS** - Utility-first styling (version in package.json)
- **shadcn/ui** - Component system built on Radix UI
- **Lucide React 0.525.0** - Icon library
- **React Hook Form 7.60.0** - Form handling with validation

### Backend Stack

- **Hono 4.8.5** - Lightweight web framework for Cloudflare Workers
- **Cloudflare Workers** - Edge runtime environment
- **Cloudflare D1** - SQLite database at the edge
- **Drizzle ORM ~0.44.3** - Type-safe database operations

### Development Tools

- **Bun** - Fast package manager and runtime
- **Vite** - Build tool with HMR (integrated with React Router)
- **Vitest** - Testing framework
- **Wrangler** - Cloudflare development CLI
- **Husky** - Git hooks for code quality
- **Commitlint** - Conventional commit enforcement

---

## 🌐 Environment Setup

### Local Development

1. **Create environment file for Cloudflare Workers:**

   ```bash
   touch .dev.vars
   ```

2. **Configure variables in `.dev.vars`:**

   ```env
   # Cloudflare D1 Database (for production migrations)
   CLOUDFLARE_ACCOUNT_ID=your_account_id_here
   D1_DATABASE_ID=your_database_id_here
   CLOUDFLARE_API_TOKEN=your_api_token_here
   
   # Optional: Additional environment variables
   NODE_ENV=development
   LOG_LEVEL=debug
   ```

   > **📝 Note**: For local development, Wrangler uses a local D1 database automatically. Production environment variables are only needed for production migrations.

3. **Cloudflare Configuration:**

   ```bash
   # Update wrangler.jsonc with your project settings
   # Generate types after any wrangler.jsonc changes
   bun run wrangler:types
   ```

4. **Environment File Security:**

   ```bash
   # Ensure sensitive files are in .gitignore
   echo ".dev.vars" >> .gitignore
   echo ".env" >> .gitignore
   ```

### Production Setup

1. **Cloudflare Account Setup:**
   - Create a [Cloudflare account](https://dash.cloudflare.com/)
   - Get your Account ID from the dashboard
   - Create an API token with D1 permissions

2. **Database Setup:**
   - Create a D1 database in Cloudflare dashboard
   - Update `wrangler.jsonc` with your database name and ID

3. **Deployment:**
   See [CI Deploy Guide](./CI_DEPLOY_GUIDE.md) for production deployment details.

### Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `CLOUDFLARE_ACCOUNT_ID` | Production | Your Cloudflare account ID |
| `D1_DATABASE_ID` | Production | D1 database identifier |
| `CLOUDFLARE_API_TOKEN` | Production | API token with D1 permissions |
| `NODE_ENV` | Optional | Environment mode (development/production) |

---

## 🎯 Common Development Tasks

> **📋 Quick Reference**
>
> **Task Priority:** Feature → Tests → Types → Commit → Deploy
>
> **Essential Patterns:**
>
> - **New Feature:** `mkdir app/features/[name]` → Create components → Add route → Write tests
> - **API Endpoint:** Create handler in `workers/api/` → Add validation → Test with SELF.fetch
> - **Database Schema:** Update `database/schema.ts` → `bun run db:generate` → `bun run db:migrate`
> - **Component:** Use shadcn/ui → `bunx --bun shadcn@latest add [component]` → Customize
>
> **Quick Troubleshooting:** Port issues → [E004](./TROUBLESHOOTING.md#e004-port-already-in-use) | Type errors → [E003](./TROUBLESHOOTING.md#e003-route-types-not-generated) | Database → [E002](./TROUBLESHOOTING.md#e002-database-migration-failed)

### Adding a New Feature

1. **Create feature directory structure:**

   ```bash
   mkdir -p app/features/my-feature/{components,utils,types,context}
   touch app/features/my-feature/{page.tsx,index.ts}
   ```

2. **Create main page component:**

   ```typescript
   // app/features/my-feature/page.tsx
   import type { MetaFunction } from 'react-router'
   
   export const meta: MetaFunction = () => {
     return [
       { title: 'My Feature - NARA' },
       { name: 'description', content: 'My feature description' },
     ]
   }
   
   export default function MyFeaturePage() {
     return (
       <div className="container mx-auto py-8">
         <h1 className="text-3xl font-bold">My Feature</h1>
         <p className="text-muted-foreground">Feature implementation goes here</p>
       </div>
     )
   }
   ```

3. **Create feature index (for exports):**

   ```typescript
   // app/features/my-feature/index.ts
   export { default as MyFeaturePage } from './page'
   export * from './components'
   export * from './types'
   export * from './utils'
   ```

4. **Add route:**

   ```typescript
   // app/routes/my-feature._index.tsx
   export { default, meta } from '~/features/my-feature/page'
   ```

5. **Add to navigation (if needed):**

   ```typescript
   // Update navigation components to include new route
   <Link to="/my-feature">My Feature</Link>
   ```

### Adding a New API Endpoint

1. **Create API handler with types:**

   ```typescript
   // workers/api/my-endpoint.ts
   import { Hono } from 'hono'
   import { z } from 'zod'
   import { zValidator } from '@hono/zod-validator'
   import { getDatabase } from '~/lib/db'
   
   const app = new Hono<{ Bindings: Env }>()
   
   // Define request/response schemas
   const createItemSchema = z.object({
     name: z.string().min(1).max(100),
     description: z.string().optional(),
   })
   
   // GET endpoint
   app.get('/', async (c) => {
     const db = getDatabase(c.env)
     const items = await db.select().from(myTable).all()
     
     return c.json({
       success: true,
       data: items,
     })
   })
   
   // POST endpoint with validation
   app.post('/', zValidator('json', createItemSchema), async (c) => {
     const db = getDatabase(c.env)
     const data = c.req.valid('json')
     
     const [item] = await db
       .insert(myTable)
       .values(data)
       .returning()
     
     return c.json({
       success: true,
       data: item,
     }, 201)
   })
   
   export default app
   ```

2. **Register in main worker:**

   ```typescript
   // workers/app.ts
   import { Hono } from 'hono'
   import myEndpoint from './api/my-endpoint'
   
   const app = new Hono<{ Bindings: Env }>()
   
   // Register API routes
   app.route('/api/my-endpoint', myEndpoint)
   
   export default app
   ```

3. **Create frontend API client:**

   ```typescript
   // app/lib/api/my-endpoint.ts
   import type { InferResponseType } from 'hono'
   import type myEndpointApp from '~/workers/api/my-endpoint'
   
   type MyEndpointResponse = InferResponseType<typeof myEndpointApp>
   
   export async function getItems(): Promise<MyEndpointResponse> {
     const response = await fetch('/api/my-endpoint')
     return response.json()
   }
   
   export async function createItem(data: CreateItemData): Promise<MyEndpointResponse> {
     const response = await fetch('/api/my-endpoint', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(data),
     })
     return response.json()
   }
   ```

### Database Schema Changes

1. **Update schema with proper types:**

   ```typescript
   // database/schema.ts (or database/schema/my-table.ts)
   import { sql } from 'drizzle-orm'
   import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
   
   export const myTable = sqliteTable('my_table', {
     id: integer('id').primaryKey({ autoIncrement: true }),
     name: text('name').notNull(),
     description: text('description'),
     status: text('status', { enum: ['active', 'inactive'] }).default('active'),
     createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
     updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
   })
   
   // Add relations if needed
   import { relations } from 'drizzle-orm'
   
   export const myTableRelations = relations(myTable, ({ many, one }) => ({
     // Define relationships here
   }))
   ```

2. **Generate and apply migration:**

   ```bash
   # Generate migration from schema changes
   bun run db:generate
   
   # Review the generated migration file in drizzle/
   # Example: drizzle/0001_add_my_table.sql
   
   # Apply migration to local database
   bun run db:migrate
   
   # Verify migration worked
   bun run typecheck
   ```

3. **Update types and exports:**

   ```typescript
   // database/schema.ts (update exports)
   export * from './schema/my-table'
   
   // Create type definitions
   export type MyTable = typeof myTable.$inferSelect
   export type InsertMyTable = typeof myTable.$inferInsert
   ```

4. **Production deployment:**

   ```bash
   # Deploy migration to production
   bun run db:migrate-production
   ```

### Adding Database Queries

1. **Create repository pattern:**

   ```typescript
   // app/lib/repositories/my-table-repository.ts
   import { eq } from 'drizzle-orm'
   import { db } from '~/lib/db'
   import { myTable, type MyTable, type InsertMyTable } from '~/database/schema'
   
   export class MyTableRepository {
     async findAll(): Promise<MyTable[]> {
       return db.select().from(myTable).all()
     }
   
     async findById(id: number): Promise<MyTable | undefined> {
       return db.select().from(myTable).where(eq(myTable.id, id)).get()
     }
   
     async create(data: Omit<InsertMyTable, 'id' | 'createdAt' | 'updatedAt'>): Promise<MyTable> {
       const [item] = await db.insert(myTable).values(data).returning()
       return item
     }
   
     async update(id: number, data: Partial<InsertMyTable>): Promise<MyTable> {
       const [item] = await db
         .update(myTable)
         .set({ ...data, updatedAt: new Date() })
         .where(eq(myTable.id, id))
         .returning()
       return item
     }
   
     async delete(id: number): Promise<void> {
       await db.delete(myTable).where(eq(myTable.id, id))
     }
   }
   
   export const myTableRepository = new MyTableRepository()
   ```

---

## 🔧 VS Code Setup

### Recommended Extensions

The project includes a `.vscode/extensions.json` file with recommended extensions that will be automatically suggested:

#### **Essential Extensions:**

- **ESLint** (`dbaeumer.vscode-eslint`) - JavaScript/TypeScript linting
- **Prettier** (`esbenp.prettier-vscode`) - Code formatting
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) - CSS utility suggestions
- **Error Lens** (`usernamehw.errorlens`) - Inline error display

#### **Productivity Extensions:**

- **Material Icon Theme** (`PKief.material-icon-theme`) - File icons
- **React Snippets** (`xabikos.ReactSnippets`) - React code snippets
- **npm Intellisense** (`christian-kohler.npm-intellisense`) - Import suggestions
- **GitLens** (`eamodio.gitlens`) - Git integration
- **Import Cost** (`wix.vscode-import-cost`) - Bundle size awareness

### VS Code Settings

The project includes optimized settings in `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.includePackageJsonAutoImports": "on"
}
```

### Custom Code Snippets

The project includes React Router v7 code snippets in `.vscode/rr7route.code-snippets`:

- Type `rr7-page` for a basic page component
- Type `rr7-layout` for a layout component
- Type `rr7-action` for server action boilerplate

### Debugging Setup

Create `.vscode/launch.json` for debugging:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug React App",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "restart": true,
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

---

## 🧪 Testing Guide

### Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run tests with UI
bun test --ui

# Generate coverage report
bun run coverage
```

### Test Structure

```text
tests/
  unit/          # Unit tests for utilities and hooks
  integration/   # Integration tests for API and database
  components/    # Component tests
  fixtures/      # Test data and mocks
```

### Writing Tests

#### **Component Testing:**

```typescript
// Example: Button component test
import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { Button } from '~/components/ui/button'

test('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
})
```

#### **API Testing:**

```typescript
// Example: API endpoint test
import { describe, it, expect } from 'vitest'
import { SELF } from 'cloudflare:test'

describe('/api/showcases', () => {
  it('returns showcases list', async () => {
    const response = await SELF.fetch('/api/showcases')
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(Array.isArray(data)).toBe(true)
  })
})
```

### Test Commands

| Command | Description |
|---------|-------------|
| `bun test` | Run all tests once |
| `bun test --watch` | Run tests in watch mode |
| `bun test --ui` | Open Vitest UI |
| `bun run coverage` | Generate coverage report |
| `bun test <pattern>` | Run specific tests |

---

## 🚀 Performance Tips

### Development Performance

1. **Use TypeScript Project References:**

   ```bash
   # Check TypeScript compilation
   bun run typecheck
   ```

2. **Optimize Bundle Size:**

   ```bash
   # Check import costs with VS Code extension
   # Monitor bundle size in development
   ```

3. **Database Query Optimization:**

   ```typescript
   // Use Drizzle's query builder for type safety
   // Avoid N+1 queries with proper joins
   // See DATABASE_GUIDE.md for details
   ```

### Production Optimization

1. **Edge Performance:**
   - Cloudflare Workers run at the edge for fast response times
   - D1 database replication reduces latency

2. **Bundle Optimization:**
   - React Router automatically optimizes bundles
   - Code splitting happens at the route level

3. **Monitoring:**
   - Use Cloudflare Analytics for performance insights
   - Monitor Worker metrics in Cloudflare dashboard

---

## 🆘 Getting Help

### Documentation Resources

#### **Project Documentation:**

- [Database Guide](./DATABASE_GUIDE.md) - Complete database development guide
- [React Router Guide](./REACT_ROUTER_GUIDE.md) - Routing patterns and best practices
- [CI Deploy Guide](./CI_DEPLOY_GUIDE.md) - Deployment setup and configuration
- [Project Overview](./PROJECT_OVERVIEW.md) - Architecture and technology stack

#### **External Documentation:**

- [React Router v7 Docs](https://reactrouter.com/en/main) - Official React Router documentation
- [Hono Documentation](https://hono.dev/) - Hono web framework guide
- [Drizzle ORM Docs](https://orm.drizzle.team/) - Database ORM documentation
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/) - Workers platform guide
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/) - D1 database documentation

### Common Issues & Solutions

#### **Setup Issues:**

| Issue | Solution |
|-------|----------|
| `bun install` fails | Clear `node_modules`, delete `bun.lock`, retry |
| Database migration fails | Check `.dev.vars` file, verify D1 setup |
| TypeScript errors | Run `bun run typecheck` and `bun run wrangler:types` |
| VS Code extensions not working | Reload window, check extension installation |

#### **Development Issues:**

```bash
# Port already in use
lsof -ti:5173 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5173   # Windows

# Clear development cache
rm -rf .react-router .wrangler/state

# Reset database (local only)
rm -rf .wrangler/state/v3/d1
bun run db:migrate
```

#### **Build/Deploy Issues:**

```bash
# Build fails
bun run typecheck  # Check for TypeScript errors
bun run build     # Try building locally

# Wrangler issues
bun run wrangler:types  # Regenerate types
wrangler auth login     # Re-authenticate if needed
```

### Error Messages & Solutions

#### **Common Error Patterns:**

```bash
# "Module not found" errors
# → Check import paths, ensure exports are correct

# "Type errors" in database queries
# → Run bun run db:generate to update schema types

# "Cannot find module '~/...'" 
# → Check tsconfig.json path mapping configuration

# Cloudflare Workers deployment fails
# → Verify wrangler.jsonc configuration and authentication
```

### Getting Support

### Project Support Channels

#### **Before Asking for Help:**

1. **Check existing documentation** - Review project docs and external resources
2. **Search GitHub Issues** - Look for similar problems and solutions  
3. **Try troubleshooting steps** - Follow the [Common Issues section](./TROUBLESHOOTING.md#common-issues-and-solutions)
4. **Run health check** - Use the [health check script](./TROUBLESHOOTING.md#health-check-script)
5. **Reproduce the issue** - Create a minimal example if possible

#### **When Creating Issues:**

1. **Use issue templates** - Follow the provided GitHub issue templates
2. **Include environment info** - Node.js version, Bun version, OS
3. **Provide error logs** - Include full error messages and stack traces
4. **Share reproduction steps** - Step-by-step instructions to reproduce

#### **Support Channels:**

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - Questions and community support
- **Documentation** - Check inline comments and JSDoc

#### **Contributing Guidelines:**

- Review [Contributing Guidelines](../CONTRIBUTING.md) before submitting PRs
- Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
- Ensure tests pass before submitting: `bun test`
- Run type checking: `bun run typecheck`

---

## 🎉 Next Steps

Once you've completed the setup:

### **Immediate Next Steps:**

1. **Explore the codebase** - Start with `/app/features/landing-page/` as an example
2. **Review architecture** - Read through the project documentation
3. **Make a test change** - Try adding a simple component or route
4. **Run the test suite** - Ensure everything works: `bun test`
5. **Check type safety** - Run `bun run typecheck`

### **Learning Path:**

#### **Week 1: Foundation** ⏱️ 8-10 hours

- [ ] Understand React Router v7 file-based routing *(2 hours)*
- [ ] Learn Drizzle ORM basics with the [database guide](./DATABASE_GUIDE.md#getting-started) *(3 hours)*
- [ ] Explore the existing features (landing-page, showcases) *(2 hours)*
- [ ] Set up your development environment completely *(1 hour)*

#### **Week 2: Building** ⏱️ 10-12 hours

- [ ] Create your first feature following the patterns *(4 hours)*
- [ ] Add a new API endpoint with proper validation *(3 hours)*
- [ ] Write tests for your new functionality *(3 hours)*
- [ ] Practice database schema changes *(2 hours)*

#### **Week 3: Advanced** ⏱️ 8-10 hours

- [ ] Implement complex database relationships *(3 hours)*
- [ ] Add authentication/authorization (if needed) *(4 hours)*
- [ ] Optimize performance with caching strategies *(2 hours)*
- [ ] Deploy your changes to production *(1 hour)*

### **Development Checklist:**

Before submitting any code changes:

- [ ] All tests pass: `bun test`
- [ ] TypeScript compiles: `bun run typecheck`
- [ ] Code is formatted: `bun run format` (if available)
- [ ] Commit messages follow conventional commits
- [ ] PR description explains the changes
- [ ] Documentation is updated if needed

### **Key Resources to Bookmark:**

- [Drizzle ORM Documentation](https://orm.drizzle.team/) - Database queries and schema
- [React Router v7 Guide](https://reactrouter.com/en/main) - Routing and data loading
- [Hono Documentation](https://hono.dev/) - API development patterns
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/) - Platform features
- [shadcn/ui Components](https://ui.shadcn.com/) - UI component library

Welcome to the team! 🚀

> **💡 Pro Tip**: Start small, follow the existing patterns, and don't hesitate to ask questions. The codebase is designed to be approachable and the documentation comprehensive.

---

Built with ❤️ by KotonoSora — to help you ship faster and with confidence.
