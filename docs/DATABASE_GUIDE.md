# Database Development Guide

This guide covers database development with Drizzle ORM and Cloudflare D1, including schema design, migrations, queries, and best practices.

---

## 🗄 Database Overview

The NARA boilerplate uses:

- **Cloudflare D1** - SQLite database running on Cloudflare's edge
- **Drizzle ORM** - Type-safe SQL toolkit and query builder
- **Drizzle Kit** - Migration and introspection tools

### Database Configuration

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit'

export default {
  schema: './database/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.D1_DATABASE_ID!,
    token: process.env.CLOUDFLARE_API_TOKEN!,
  },
} satisfies Config
```

---

## 📋 Schema Design

### Basic Schema Definition

```typescript
// database/schema.ts
import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
})

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  published: integer('published', { mode: 'boolean' }).default(false),
  authorId: integer('author_id').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
})
```

### Advanced Schema Features

#### **Relationships**

```typescript
import { relations } from 'drizzle-orm'

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
}))

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  comments: many(comments),
  tags: many(postTags),
}))

export const comments = sqliteTable('comments', {
  id: integer('id').primaryKey(),
  content: text('content').notNull(),
  postId: integer('post_id').references(() => posts.id),
  authorId: integer('author_id').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
})

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
}))
```

#### **Many-to-Many Relationships**

```typescript
export const tags = sqliteTable('tags', {
  id: integer('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
})

export const postTags = sqliteTable('post_tags', {
  postId: integer('post_id').references(() => posts.id),
  tagId: integer('tag_id').references(() => tags.id),
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.tagId] }),
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

#### **Indexes and Constraints**

```typescript
import { index, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  email: text('email').notNull(),
  username: text('username').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  // Unique indexes
  emailIdx: uniqueIndex('email_idx').on(table.email),
  usernameIdx: uniqueIndex('username_idx').on(table.username),
  
  // Regular indexes
  nameIdx: index('name_idx').on(table.firstName, table.lastName),
  createdAtIdx: index('created_at_idx').on(table.createdAt),
}))
```

#### **Enums and JSON**

```typescript
export const userRoles = ['admin', 'moderator', 'user'] as const
export type UserRole = typeof userRoles[number]

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  email: text('email').notNull(),
  role: text('role', { enum: userRoles }).default('user'),
  
  // JSON fields
  preferences: text('preferences', { mode: 'json' }).$type<{
    theme: 'light' | 'dark' | 'system'
    notifications: boolean
    language: string
  }>(),
  
  metadata: text('metadata', { mode: 'json' }).$type<Record<string, any>>(),
})
```

---

## 🔄 Migration Management

### Creating Migrations

1. **Modify Schema**
   ```typescript
   // Add new column to existing table
   export const users = sqliteTable('users', {
     id: integer('id').primaryKey(),
     email: text('email').notNull(),
     name: text('name').notNull(),
     avatar: text('avatar'), // New column
     createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
   })
   ```

2. **Generate Migration**
   ```bash
   bun run db:generate
   # Creates drizzle/0001_add_avatar_column.sql
   ```

3. **Review Generated Migration**
   ```sql
   -- drizzle/0001_add_avatar_column.sql
   ALTER TABLE `users` ADD `avatar` text;
   ```

4. **Apply Migration**
   ```bash
   # Local development
   bun run db:migrate
   
   # Production
   bun run db:migrate-production
   ```

### Advanced Migration Patterns

#### **Data Migrations**

```sql
-- drizzle/0002_migrate_user_data.sql
-- Update existing users with default avatar
UPDATE users SET avatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || name WHERE avatar IS NULL;
```

#### **Index Migrations**

```sql
-- drizzle/0003_add_performance_indexes.sql
CREATE INDEX IF NOT EXISTS posts_author_published_idx ON posts(author_id, published);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);
```

#### **Complex Schema Changes**

```sql
-- drizzle/0004_restructure_comments.sql
-- Create new table
CREATE TABLE comments_new (
  id INTEGER PRIMARY KEY,
  content TEXT NOT NULL,
  post_id INTEGER REFERENCES posts(id),
  author_id INTEGER REFERENCES users(id),
  parent_id INTEGER REFERENCES comments(id), -- New: nested comments
  created_at INTEGER DEFAULT CURRENT_TIMESTAMP,
  updated_at INTEGER DEFAULT CURRENT_TIMESTAMP
);

-- Copy data
INSERT INTO comments_new (id, content, post_id, author_id, created_at)
SELECT id, content, post_id, author_id, created_at FROM comments;

-- Drop old table and rename
DROP TABLE comments;
ALTER TABLE comments_new RENAME TO comments;
```

---

## 🔍 Querying Data

### Basic Queries

```typescript
import { db } from '~/lib/db'
import { users, posts, comments } from '~/database/schema'
import { eq, and, or, gt, lt, like, desc, asc } from 'drizzle-orm'

// Simple select
const allUsers = await db.select().from(users)

// Select with conditions
const activeUsers = await db
  .select()
  .from(users)
  .where(eq(users.active, true))

// Select specific fields
const userEmails = await db
  .select({
    id: users.id,
    email: users.email,
    name: users.name,
  })
  .from(users)

// Complex conditions
const recentPosts = await db
  .select()
  .from(posts)
  .where(
    and(
      eq(posts.published, true),
      gt(posts.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) // Last 7 days
    )
  )
  .orderBy(desc(posts.createdAt))
  .limit(10)
```

### Joins and Relationships

```typescript
// Manual joins
const postsWithAuthors = await db
  .select({
    post: posts,
    author: {
      id: users.id,
      name: users.name,
      email: users.email,
    },
  })
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))

// Using relations (query API)
const usersWithPosts = await db.query.users.findMany({
  with: {
    posts: true,
  },
})

// Nested relations
const postsWithAuthorsAndComments = await db.query.posts.findMany({
  with: {
    author: true,
    comments: {
      with: {
        author: true,
      },
    },
  },
})

// Filtering with relations
const usersWithPublishedPosts = await db.query.users.findMany({
  with: {
    posts: {
      where: eq(posts.published, true),
      orderBy: desc(posts.createdAt),
      limit: 5,
    },
  },
})
```

### Aggregations

```typescript
import { count, sum, avg, min, max } from 'drizzle-orm'

// Count queries
const userCount = await db
  .select({ count: count() })
  .from(users)

const postCountsByUser = await db
  .select({
    userId: posts.authorId,
    userName: users.name,
    postCount: count(posts.id),
  })
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
  .groupBy(posts.authorId, users.name)
  .orderBy(desc(count(posts.id)))

// Statistics
const postStats = await db
  .select({
    totalPosts: count(posts.id),
    avgLength: avg(length(posts.content)),
    latestPost: max(posts.createdAt),
    oldestPost: min(posts.createdAt),
  })
  .from(posts)
  .where(eq(posts.published, true))
```

### Pagination

```typescript
// Offset-based pagination
async function getPaginatedPosts(page: number, limit: number = 10) {
  const offset = (page - 1) * limit
  
  const [posts, [{ count }]] = await Promise.all([
    db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset),
    
    db
      .select({ count: count() })
      .from(posts)
  ])
  
  return {
    posts,
    pagination: {
      page,
      limit,
      total: count,
      pages: Math.ceil(count / limit),
    },
  }
}

// Cursor-based pagination (more efficient)
async function getPostsCursor(cursor?: number, limit: number = 10) {
  const posts = await db
    .select()
    .from(posts)
    .where(cursor ? lt(posts.id, cursor) : undefined)
    .orderBy(desc(posts.id))
    .limit(limit + 1) // Fetch one extra to check if there's a next page
  
  const hasNextPage = posts.length > limit
  if (hasNextPage) posts.pop() // Remove the extra item
  
  return {
    posts,
    nextCursor: hasNextPage ? posts[posts.length - 1]?.id : null,
  }
}
```

---

## ✏️ Data Mutations

### Insert Operations

```typescript
// Single insert
const newUser = await db
  .insert(users)
  .values({
    email: 'john@example.com',
    name: 'John Doe',
  })
  .returning()

// Multiple inserts
const newUsers = await db
  .insert(users)
  .values([
    { email: 'user1@example.com', name: 'User 1' },
    { email: 'user2@example.com', name: 'User 2' },
  ])
  .returning()

// Insert with conflict resolution
const user = await db
  .insert(users)
  .values({ email: 'john@example.com', name: 'John Doe' })
  .onConflictDoUpdate({
    target: users.email,
    set: { name: 'John Doe Updated' }
  })
  .returning()
```

### Update Operations

```typescript
// Update single record
const updatedUser = await db
  .update(users)
  .set({ name: 'John Smith' })
  .where(eq(users.id, 1))
  .returning()

// Conditional updates
await db
  .update(posts)
  .set({ published: true, publishedAt: new Date() })
  .where(
    and(
      eq(posts.authorId, userId),
      eq(posts.published, false)
    )
  )

// Update with SQL expressions
await db
  .update(posts)
  .set({ 
    viewCount: sql`${posts.viewCount} + 1`,
    updatedAt: new Date()
  })
  .where(eq(posts.id, postId))
```

### Delete Operations

```typescript
// Delete single record
await db
  .delete(users)
  .where(eq(users.id, 1))

// Conditional deletes
await db
  .delete(posts)
  .where(
    and(
      eq(posts.authorId, userId),
      lt(posts.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // Older than 30 days
    )
  )

// Soft deletes (recommended)
export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
})

// Soft delete implementation
await db
  .update(users)
  .set({ deletedAt: new Date() })
  .where(eq(users.id, userId))

// Query non-deleted users
const activeUsers = await db
  .select()
  .from(users)
  .where(isNull(users.deletedAt))
```

---

## 🔒 Database Access Patterns

### Repository Pattern

```typescript
// repositories/user-repository.ts
import { db } from '~/lib/db'
import { users } from '~/database/schema'
import { eq, and, isNull } from 'drizzle-orm'

export class UserRepository {
  async findById(id: number) {
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, id), isNull(users.deletedAt)))
      .limit(1)
    
    return user
  }
  
  async findByEmail(email: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deletedAt)))
      .limit(1)
    
    return user
  }
  
  async create(userData: Omit<typeof users.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning()
    
    return user
  }
  
  async update(id: number, userData: Partial<typeof users.$inferInsert>) {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning()
    
    return user
  }
  
  async softDelete(id: number) {
    await db
      .update(users)
      .set({ deletedAt: new Date() })
      .where(eq(users.id, id))
  }
}

export const userRepository = new UserRepository()
```

### Service Layer

```typescript
// services/user-service.ts
import { userRepository } from '~/repositories/user-repository'
import { z } from 'zod'

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
})

const updateUserSchema = createUserSchema.partial()

export class UserService {
  async createUser(data: z.infer<typeof createUserSchema>) {
    const validatedData = createUserSchema.parse(data)
    
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(validatedData.email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }
    
    return userRepository.create(validatedData)
  }
  
  async updateUser(id: number, data: z.infer<typeof updateUserSchema>) {
    const validatedData = updateUserSchema.parse(data)
    
    const user = await userRepository.findById(id)
    if (!user) {
      throw new Error('User not found')
    }
    
    return userRepository.update(id, validatedData)
  }
  
  async getUserWithPosts(id: number) {
    return db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        posts: {
          where: eq(posts.published, true),
          orderBy: desc(posts.createdAt),
        },
      },
    })
  }
}

export const userService = new UserService()
```

---

## 🚀 Performance Optimization

### Query Optimization

```typescript
// ❌ N+1 Query Problem
const posts = await db.select().from(posts)
for (const post of posts) {
  const author = await db.select().from(users).where(eq(users.id, post.authorId))
  console.log(post.title, author.name)
}

// ✅ Join or Relation Query
const postsWithAuthors = await db.query.posts.findMany({
  with: { author: true }
})

// ✅ Batch queries
const postIds = posts.map(p => p.id)
const comments = await db
  .select()
  .from(comments)
  .where(inArray(comments.postId, postIds))
```

### Indexing Strategy

```typescript
// Create indexes for common query patterns
export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  authorId: integer('author_id').references(() => users.id),
  published: integer('published', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  // For filtering by author and published status
  authorPublishedIdx: index('posts_author_published_idx').on(table.authorId, table.published),
  
  // For ordering by creation date
  createdAtIdx: index('posts_created_at_idx').on(table.createdAt),
  
  // For full-text search on title
  titleIdx: index('posts_title_idx').on(table.title),
  
  // Composite index for common filter combinations
  publishedCreatedAtIdx: index('posts_published_created_at_idx').on(table.published, table.createdAt),
}))
```

### Connection Pooling

```typescript
// lib/db.ts
import { drizzle } from 'drizzle-orm/d1'
import * as schema from '~/database/schema'

export function createDatabase(D1: D1Database) {
  return drizzle(D1, { schema })
}

// In Cloudflare Worker context
export function getDatabase(env: Env) {
  return createDatabase(env.DB)
}
```

---

## 🧪 Testing Database Code

### Unit Testing

```typescript
// tests/repositories/user-repository.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { userRepository } from '~/repositories/user-repository'

describe('UserRepository', () => {
  beforeEach(async () => {
    // Clear test database
    await db.delete(users)
  })
  
  it('creates a new user', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User'
    }
    
    const user = await userRepository.create(userData)
    
    expect(user.email).toBe(userData.email)
    expect(user.name).toBe(userData.name)
    expect(user.id).toBeDefined()
  })
  
  it('finds user by email', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User'
    }
    
    await userRepository.create(userData)
    const user = await userRepository.findByEmail(userData.email)
    
    expect(user).toBeDefined()
    expect(user?.email).toBe(userData.email)
  })
})
```

### Integration Testing

```typescript
// tests/api/users.test.ts
import { describe, it, expect } from 'vitest'
import { SELF } from 'cloudflare:test'

describe('/api/users', () => {
  it('creates a new user', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User'
    }
    
    const response = await SELF.fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    
    expect(response.status).toBe(201)
    
    const user = await response.json()
    expect(user.email).toBe(userData.email)
    expect(user.name).toBe(userData.name)
  })
})
```

---

## 🛠 Development Workflows

### Schema Development

1. **Design Schema**
   - Plan tables and relationships
   - Consider indexing strategy
   - Define constraints and validations

2. **Implement Schema**
   ```typescript
   // Add new table to database/schema.ts
   export const newTable = sqliteTable('new_table', {
     // Define columns
   })
   ```

3. **Generate Migration**
   ```bash
   bun run db:generate
   ```

4. **Test Migration**
   ```bash
   bun run db:migrate
   bun run test
   ```

5. **Deploy**
   ```bash
   bun run db:migrate-production
   ```

### Query Development

1. **Write Query**
   ```typescript
   const result = await db.query.users.findMany({
     with: { posts: true }
   })
   ```

2. **Test Query**
   ```typescript
   // Add test case
   it('fetches users with posts', async () => {
     const result = await userService.getUsersWithPosts()
     expect(result).toBeDefined()
   })
   ```

3. **Optimize if Needed**
   - Add indexes
   - Refactor query structure
   - Consider caching

---

This database guide provides a comprehensive foundation for working with Drizzle ORM and Cloudflare D1 in the NARA boilerplate.

---

Built with ❤️ by KotonoSora — to help you ship faster and with confidence.