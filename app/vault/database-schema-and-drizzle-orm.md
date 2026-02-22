---
title: "Database Schema and Drizzle ORM"
description: "Database design, schema definition, migrations, and query patterns using Drizzle ORM"
date: "2026-02-22"
published: true
author: "Development Team"
tags: ["database", "drizzle-orm", "schema", "sqlite", "migrations"]
---

# Database Schema and Drizzle ORM

## Overview

NARA uses **Drizzle ORM** with **SQLite (D1)** on Cloudflare for type-safe database operations, schema management, and automated migrations.

## Architecture

### Drizzle Configuration

`drizzle.config.ts`:

```typescript
import type { Config } from 'drizzle-kit'

export default {
  out: './drizzle',                      // Migration output
  schema: './database/schema.ts',        // Schema definition
  dialect: 'sqlite',                     // Database type
  driver: 'd1-http',                     // Cloudflare D1 driver
  dbCredentials: {
    databaseId: 'your-database-id',
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    token: process.env.CLOUDFLARE_API_TOKEN!,
  }
} satisfies Config
```

### File Structure

```
database/
├── schema.ts                 # Main schema definitions
├── contracts/
│   ├── user.contract.ts     # User data contract
│   ├── post.contract.ts     # Post data contract
│   └── ... more contracts
└── schema/
    ├── tables.md            # Table documentation
    └── relationships.md     # Relationship diagrams

drizzle/
├── 0000_create_users.sql    # Migration files (auto-generated)
├── 0001_create_posts.sql
└── meta/
    └── _journal.json        # Migration journal
```

## Schema Definition

### Basic Table Structure

`database/schema.ts`:

```typescript
import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer, real, blob } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  picture: text('picture'),
  bio: text('bio'),
  role: text('role').default('user'), // admin, moderator, user
  status: text('status').default('active'), // active, inactive, banned
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
})

// Posts table
export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  slug: text('slug').unique().notNull(),
  content: text('content').notNull(), // Markdown/MDX content
  excerpt: text('excerpt'),
  category: text('category'),
  published: integer('published', { mode: 'boolean' }).default(false),
  views: integer('views').default(0),
  likes: integer('likes').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
})

// Type exports for use in app
export type User = typeof users.$inferSelect      // For reading
export type NewUser = typeof users.$inferInsert   // For creating

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
```

## Table Relationships

### One-to-Many Relationship

```typescript
import { relations } from 'drizzle-orm'

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
}))

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comments: many(comments),
}))
```

### Many-to-Many Relationship

```typescript
// Junction table
export const postTags = sqliteTable('post_tags', {
  postId: text('post_id').notNull().references(() => posts.id),
  tagId: text('tag_id').notNull().references(() => tags.id),
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.tagId] }),
}))

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').unique().notNull(),
  slug: text('slug').unique().notNull(),
})

// Relations
export const postsRelations = relations(posts, ({ many }) => ({
  tags: many(postTags),
}))

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id],
  }),
}))
```

## Data Types

### SQLite Type Mappings

```typescript
import {
  sqliteTable,
  text,                    // String/TEXT
  integer,                 // Integer
  real,                    // Float/REAL
  blob,                    // Binary data
  primaryKey,
  unique,
  notNull,
  references,
  check,
} from 'drizzle-orm/sqlite-core'

// Column definitions with constraints
export const exampleTable = sqliteTable('example', {
  id: text('id').primaryKey(),
  
  // String types
  email: text('email').unique().notNull(),
  slug: text('slug'),
  
  // Date as integer (Unix timestamp)
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  
  // Number types
  count: integer('count').default(0),
  rating: real('rating'),
  
  // Boolean as integer (0/1)
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  
  // Binary data
  metadata: blob('metadata', { mode: 'json' }),
  
  // Default values
  status: text('status').default('pending'),
  
  // Check constraints
  age: integer('age').check(sql`age >= 0 and age <= 150`),
})
```

## Query Patterns

### Insert

```typescript
import { db } from '~/lib/database'
import { users } from '~/database/schema'

// Single insert
const newUser = await db.insert(users).values({
  id: crypto.randomUUID(),
  email: 'user@example.com',
  name: 'John Doe',
  passwordHash: hashedPassword,
}).returning()

// Bulk insert
await db.insert(users).values([
  { id: '1', email: 'user1@example.com', name: 'User 1', passwordHash: '...' },
  { id: '2', email: 'user2@example.com', name: 'User 2', passwordHash: '...' },
])
```

### Select

```typescript
import { db } from '~/lib/database'
import { users, posts } from '~/database/schema'
import { eq, like, and, or, gt, lt } from 'drizzle-orm'

// Select all
const allUsers = await db.select().from(users)

// Select with condition
const user = await db.select().from(users)
  .where(eq(users.email, 'user@example.com'))

// Select specific columns
const userEmails = await db.select({ 
  id: users.id,
  email: users.email 
}).from(users)

// Multiple conditions
const activePosts = await db.select().from(posts)
  .where(and(
    eq(posts.published, true),
    gt(posts.views, 100)
  ))

// OR condition
const results = await db.select().from(users)
  .where(or(
    like(users.email, '%@gmail.com'),
    like(users.email, '%@outlook.com')
  ))
```

### Find First

```typescript
// Helper function patterns
export const getUserById = async (db: Database, userId: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId)
  })
  return user
}

// With relations
export const getPostWithAuthor = async (db: Database, postId: string) => {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, postId),
    with: {
      author: true,
    }
  })
  return post
}

// Nested relations
const postWithAll = await db.query.posts.findFirst({
  where: eq(posts.id, postId),
  with: {
    author: true,
    comments: {
      with: {
        author: true,
      }
    },
    tags: {
      with: {
        tag: true,
      }
    }
  }
})
```

### Update

```typescript
import { db } from '~/lib/database'
import { users } from '~/database/schema'
import { eq } from 'drizzle-orm'

// Simple update
await db.update(users)
  .set({ name: 'Jane Doe' })
  .where(eq(users.id, userId))

// Update with returning
const updated = await db.update(users)
  .set({ 
    name: 'Jane Doe',
    updatedAt: new Date()
  })
  .where(eq(users.id, userId))
  .returning()

// Increment column
await db.update(posts)
  .set({ views: sql`views + 1` })
  .where(eq(posts.id, postId))
```

### Delete

```typescript
import { db } from '~/lib/database'
import { users } from '~/database/schema'
import { eq } from 'drizzle-orm'

// Simple delete
await db.delete(users)
  .where(eq(users.id, userId))

// Delete with returning
const deleted = await db.delete(users)
  .where(eq(users.id, userId))
  .returning()

// Delete multiple
await db.delete(posts)
  .where(and(
    eq(posts.userId, userId),
    lt(posts.createdAt, oneMonthAgo)
  ))
```

## Transactions

```typescript
import { db } from '~/lib/database'

// Database transaction
const result = await db.transaction(async (trx) => {
  const user = await trx.insert(users).values({
    id: '123',
    email: 'user@example.com',
    name: 'John'
  }).returning()

  const post = await trx.insert(posts).values({
    id: '456',
    userId: user[0].id,
    title: 'First Post',
    slug: 'first-post',
    content: 'Content'
  }).returning()

  return { user: user[0], post: post[0] }
})
```

## Migrations

### Generate Migration

When schema changes, generate migration:

```bash
npm run db:generate

# Output: drizzle/0001_fearless_wolverine.sql
```

Generated migration example:

```sql
-- drizzle/0001_fearless_wolverine.sql
CREATE TABLE `new_users` (
  `id` text PRIMARY KEY NOT NULL,
  `email` text UNIQUE NOT NULL,
  `name` text NOT NULL,
  `bio` text,
  `created_at` integer DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE `posts` ADD COLUMN `excerpt` text;
```

### Apply Migration

```bash
# Local development
npm run db:migrate

# Production deployment
npm run db:migrate-production
```

### Example Schema Migration Workflow

1. **Add new column to schema**:
   ```typescript
   export const users = sqliteTable('users', {
     // ... existing columns
     phoneNumber: text('phone_number'),  // NEW
   })
   ```

2. **Generate migration**:
   ```bash
   npm run db:generate
   ```

3. **Review migration** in `drizzle/`:
   ```sql
   ALTER TABLE `users` ADD COLUMN `phone_number` text;
   ```

4. **Apply locally**:
   ```bash
   npm run db:migrate
   ```

5. **Test thoroughly**

6. **Commit and deploy**

7. **Run on production**:
   ```bash
   npm run db:migrate-production
   ```

## Indexes

Improve query performance:

```typescript
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  slug: text('slug').unique().notNull(),
  published: integer('published', { mode: 'boolean' }),
  createdAt: integer('created_at', { mode: 'timestamp' }),
}, (table) => ({
  // Create indexes
  userIdIdx: index('posts_user_id_idx').on(table.userId),
  slugIdx: index('posts_slug_idx').on(table.slug),
  publishedIdx: index('posts_published_idx').on(table.published),
  createdAtIdx: index('posts_created_at_idx').on(table.createdAt),
}))
```

## Constraints

### Unique Constraint

```typescript
unique: text('email').unique().notNull();
```

### Foreign Key

```typescript
userId: text('user_id').notNull().references(() => users.id)
```

### Check Constraint

```typescript
age: integer('age').check(sql`age >= 0 and age <= 150`)
```

### Default Values

```typescript
status: text('status').default('active')
createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
```

## Usage in Loaders

```typescript
import type { Route } from './+types/blog'

export const loader = async ({ params, context }: Route.LoaderArgs) => {
  const { db } = context
  
  const post = await db.query.posts.findFirst({
    where: eq(posts.slug, params['*']),
    with: {
      author: true,
      comments: {
        with: {
          author: true
        }
      }
    }
  })

  if (!post) {
    throw new Response('Not Found', { status: 404 })
  }

  return { post }
}

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  return (
    <article>
      <h1>{loaderData.post.title}</h1>
      <p>By {loaderData.post.author.name}</p>
      {/* ... */}
    </article>
  )
}
```

## Usage in Actions

```typescript
import type { Route } from './+types/create-post'

export const action = async ({ request, context }: Route.ActionArgs) => {
  if (request.method !== 'POST') {
    return null
  }

  const { db } = context
  const { user } = context.get(AuthContext)

  if (!user) {
    throw new Response('Unauthorized', { status: 401 })
  }

  const formData = await request.formData()
  
  const post = await db.insert(posts).values({
    id: crypto.randomUUID(),
    userId: user.id,
    title: formData.get('title') as string,
    slug: slugify(formData.get('title') as string),
    content: formData.get('content') as string,
    excerpt: formData.get('excerpt') as string,
    category: formData.get('category') as string,
  }).returning()

  return redirect(`/blog/${post[0].slug}`)
}
```

## Testing with Seed Data

```typescript
// scripts/seed.ts
import { db } from '~/lib/database'
import { users, posts } from '~/database/schema'

async function seed() {
  // Clear existing data
  await db.delete(posts)
  await db.delete(users)

  // Insert seed data
  const users = await db.insert(users).values([
    {
      id: '1',
      email: 'john@example.com',
      name: 'John Doe',
      passwordHash: 'hashed_password_1'
    }
  ]).returning()

  const posts = await db.insert(posts).values([
    {
      id: '1',
      userId: users[0].id,
      title: 'First Post',
      slug: 'first-post',
      content: 'Content...'
    }
  ]).returning()

  console.log('Seed complete')
}

seed()
```

## Best Practices

1. **Type-safe queries**: Use Drizzle for compile-time safety
2. **Efficient relations**: Use `with:` for relation loading, avoid N+1
3. **Proper indexes**: Index frequently queried columns
4. **Transactions**: Use for multi-step operations
5. **Migrations**: Create incrementally, never drop in production
6. **Meaningful names**: Use descriptive table/column names
7. **Constraints**: Add database-level validation
8. **Normalize data**: Follow normalization principles
9. **Test migrations**: Test on dev database first
10. **Monitor performance**: Profile slow queries

---

Drizzle ORM provides type-safe database operations with excellent developer experience and strong integration with Cloudflare D1.
