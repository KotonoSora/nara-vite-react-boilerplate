---
title: "Core Development Workflow"
description: "Getting started, development scripts, database setup, type checking, and testing procedures"
date: "2026-02-22"
published: true
author: "Development Team"
tags: ["development", "workflow", "setup", "scripts", "database"]
---

# Core Development Workflow

## Getting Started

### Prerequisites

- Node.js 18+ (use `nvm` or similar)
- Bun 1.0+ (package manager - faster than npm)
- Git
- Cloudflare CLI (`wrangler`) - auto-installed via npm

### Initial Setup

```bash
# Clone repository
git clone git@github.com:KotonoSora/nara-vite-react-boilerplate.git
cd nara-vite-react-boilerplate

# Install dependencies (uses Bun workspace)
bun install

# Or with npm
npm install
```

### Environment Configuration

```bash
# Create local environment file
cp .env.example .env.local

# Add Cloudflare credentials
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token
CLOUDFLARE_D1_DATABASE_ID=your-db-id
```

## Development Scripts

All scripts defined in root `package.json`:

### Running the Application

```bash
# Start development server with hot reload
npm run dev
# or
bun dev

# Access at http://localhost:5173 (default Vite port)
```

Features during development:

- Hot Module Replacement (HMR) for instant component updates
- Auto-discovery of routes from `app/routes/`
- TypeScript real-time compilation
- MDX/Markdown rendering with frontmatter support

### Building for Production

```bash
# Build client and server bundles
npm run build
# or
bun build

# Output location: build/ directory
# - build/client/    → Browser-ready assets
# - build/server/    → SSR server bundles

# Verify build locally
npm run start
```

### Type Checking

```bash
# Run full TypeScript check (pre-typecheck)
npm run pretypecheck

# Generate React Router types
npm run typecheck

# Full post-typecheck validation
npm run posttypecheck

# Or all at once
npm run typecheck  # Recommended for pre-commit
```

### Database Management

```bash
# Generate migration from schema changes
npm run db:generate

# Apply migrations locally
npm run db:migrate

# Apply migrations to production
npm run db:migrate-production
```

**Workflow:**

1. Edit `database/schema.ts`
2. Run `npm run db:generate`
3. Review generated migration in `drizzle/`
4. Run `npm run db:migrate` to apply locally
5. Test changes
6. Commit and run `npm run db:migrate-production` on deploy

### Testing & Code Quality

```bash
# Run all tests (Vitest)
npm run test

# Run tests in watch mode
npm run test --watch

# Generate coverage report
npm run coverage

# Lint TypeScript (type checking)
npm run lint

# Prepare for commit (runs husky hooks)
npm run prepare

# Validate commit message format
npm run lint:commitlint
```

### Deployment

```bash
# Deploy to Cloudflare Workers
npm run deploy

# Or manually
wrangler deploy

# Start local worker simulation
npm run start
# or
bun start
```

## Development Server Details

### Hot Module Replacement (HMR)

```typescript
// Changes in this file reload instantly
export function Dashboard() {
  return <div>Dashboard Content</div>  // Save instantly reloads
}
```

### Route Auto-Discovery

Create new route file in `app/routes/`:

```typescript
// app/routes/($lang).new-feature.tsx
export default function NewFeature() {
  return <div>New route automatically available at /{new-feature}</div>
}
```

Automatically accessible without restarting server.

### MDX Content Rendering

Create content in `app/vault/`:

```mdx
---
title: "My Article"
published: true
---

# My Article

This renders as a route automatically with React Router.
```

Accessible via `react-router.config.ts` vault slug collection.

## Database Workflow

### Schema Definition

Edit `database/schema.ts`:

```typescript
import { integer, relations, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name"),
  createdAt: integer("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

### Migration Generation

```bash
npm run db:generate
```

Generates migration file:

```sql
-- drizzle/0001_add_users_table.sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at INTEGER DEFAULT CURRENT_TIMESTAMP
);
```

### Local Testing

```bash
npm run db:migrate
```

Applies migrations to local D1 database (simulated by Wrangler).

### Production Deployment

```bash
npm run db:migrate-production
```

Applies migrations to Cloudflare D1 in production.

## Using Drizzle ORM

### Query Examples

```typescript
import { eq } from "drizzle-orm";

import { users } from "~/database/schema";
import { db } from "~/lib/database";

// Insert
const newUser = await db
  .insert(users)
  .values({
    id: crypto.randomUUID(),
    email: "user@example.com",
    name: "John",
  })
  .returning();

// Select
const user = await db.query.users.findFirst({
  where: eq(users.id, userId),
});

// Update
await db.update(users).set({ name: "Jane" }).where(eq(users.id, userId));

// Delete
await db.delete(users).where(eq(users.id, userId));
```

### In React Router Actions

```typescript
import { redirect } from "react-router";

import type { Route } from "./+types/profile";

import { users } from "~/database/schema";

export const action = async ({ request, context }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    return null;
  }

  const formData = await request.formData();
  const { db } = context;

  const user = await db
    .insert(users)
    .values({
      id: crypto.randomUUID(),
      email: formData.get("email"),
      name: formData.get("name"),
    })
    .returning();

  return redirect(`/profile/${user.id}`);
};
```

## Form Handling

### Using react-hook-form

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type="email" />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit">Login</button>
    </form>
  )
}
```

### Server-Side Validation

```typescript
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password too short"),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten() };
  }

  // Process valid form data
};
```

## TypeScript Type Generation

### React Router Types

```bash
npm run typecheck
```

Generates `routes.ts` with typed route parameters:

```typescript
// Auto-generated from route files
import type { Route } from "./+types/dashboard";

export const loader = ({ params }: Route.LoaderArgs) => {
  // params is typed based on dynamic segments
  console.log(params.lang); // TypeScript knows this exists
};
```

### Drizzle Schema Types

```typescript
// Automatic type inference
import { users } from "~/database/schema";

type User = typeof users.$inferSelect; // For reading
type NewUser = typeof users.$inferInsert; // For inserting

// Use in functions
async function getUser(id: string): Promise<User | undefined> {
  // ...
}
```

## Middleware Development

### Creating Middleware

`app/middleware/custom.ts`:

```typescript
import { createContext } from "react-router";

import type { MiddlewareFunction } from "react-router";

export const CustomContext = createContext();

export const customMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  // Process request
  const data = await someProcessing(request);

  // Store in context
  context.set(CustomContext, data);

  // Call next middleware
  return await next();
};
```

### Registering Middleware

In `app/root.tsx`:

```typescript
import { authMiddleware } from "~/middleware/auth";
import { customMiddleware } from "~/middleware/custom";

export const middleware = [customMiddleware, authMiddleware];
```

Middleware executes in sequence on every request.

## Testing

### Unit Tests

`app/utils/__tests__/formatDate.test.ts`:

```typescript
import { describe, expect, it } from "vitest";

import { formatDate } from "../formatDate";

describe("formatDate", () => {
  it("formats date correctly", () => {
    const date = new Date("2026-02-22");
    expect(formatDate(date)).toBe("Feb 22, 2026");
  });
});
```

### Component Tests

`app/features/dashboard/__tests__/StatsCard.test.ts`:

```typescript
import { render, screen } from '@testing-library/react'
import { StatsCard } from '../StatsCard'

describe('StatsCard', () => {
  it('renders stats correctly', () => {
    render(<StatsCard label="Revenue" value="$1,000" />)
    expect(screen.getByText('Revenue')).toBeInTheDocument()
  })
})
```

Run tests:

```bash
npm run test              # Run once
npm run test -- --watch  # Watch mode
npm run coverage         # Coverage report
```

## Debugging

### Browser DevTools

Development server runs on `localhost:5173` with React DevTools extension support.

### Server Logging

```typescript
// Log on server side
export const loader = async ({ request, context }: Route.LoaderArgs) => {
  console.log("Request:", request.url);
  console.log("User:", context.get(AuthContext));

  return {
    /* data */
  };
};
```

Logs appear in terminal running `npm run dev`.

### Wrangler Local Testing

```bash
npm run start
```

Simulates Cloudflare Workers environment locally for testing backend code.

## Git & Commit Workflow

### Husky Hooks

Pre-commit hooks defined in `.husky/`:

```bash
# Automatically runs on git commit
npm run lint              # TypeScript check
npm run test              # Run tests
npm run lint:commitlint   # Validate message format
```

### Commit Message Format

Uses commitlint (based on Conventional Commits):

```
type(scope): subject

<body>

<footer>
```

Types: feat, fix, docs, style, refactor, test, chore

```bash
git commit -m "feat(auth): add two-factor authentication"
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
lsof -i :5173
kill -9 <PID>

# Or use different port
npm run dev -- --port 5174
```

### Database Connection Issues

```bash
# Verify wrangler configuration
wrangler d1 database list

# Check credentials in .env.local
echo $CLOUDFLARE_ACCOUNT_ID
```

### TypeScript Errors After Route Changes

```bash
# Regenerate types
npm run typecheck

# Clear cache
rm -rf node_modules/.vite
npm run dev
```

### Build Size Too Large

```bash
# Analyze bundle
npm run build -- --analyze

# Check for duplicate dependencies
npm list --depth=0
```

---

By following this workflow, you can develop efficiently with hot reload, ensure type safety, manage database changes systematically, and deploy confidently to Cloudflare's global infrastructure.
