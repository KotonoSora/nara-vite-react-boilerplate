# Database Development Guide

This guide covers database development with Drizzle ORM and Cloudflare D1, including schema design, migrations, queries, and best practices.

## Table of Contents

- [🗄 Database Overview](#-database-overview)
- [📋 Schema Design](#-schema-design)
- [🔄 Migration Management](#-migration-management)
- [🔍 Querying Data](#-querying-data)
- [✏️ Data Mutations](#️-data-mutations)
- [🔒 Database Access Patterns](#-database-access-patterns)
- [🚀 Performance Optimization](#-performance-optimization)
- [🧪 Testing Database Code](#-testing-database-code)
- [🛠 Development Workflows](#-development-workflows)
- [🔧 Troubleshooting](#-troubleshooting)
- [📚 Additional Resources](#-additional-resources)

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
  verbose: true,
  strict: true,
} satisfies Config
```

### Environment Variables

Create a `.env` file in your project root with the following variables:

```bash
# Cloudflare D1 Configuration
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
D1_DATABASE_ID=your_database_id_here
CLOUDFLARE_API_TOKEN=your_api_token_here

# Optional: Environment-specific settings
NODE_ENV=development
```

> **⚠️ Security Note**: Never commit `.env` files to version control. Add `.env` to your `.gitignore` file.

### Database Connection

```typescript
// lib/db.ts
import { drizzle } from 'drizzle-orm/d1'
import * as schema from '~/database/schema'

export function createDatabase(D1: D1Database) {
  return drizzle(D1, { 
    schema,
    logger: process.env.NODE_ENV === 'development'
  })
}

// In Cloudflare Worker context
export function getDatabase(env: Env): ReturnType<typeof createDatabase> {
  return createDatabase(env.DB)
}

// Type-safe database instance
export type Database = ReturnType<typeof createDatabase>
```

---

## 📋 Schema Design

### Basic Schema Definition

```typescript
// database/schema.ts
import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// Example from actual project structure
export const showcase = sqliteTable('showcases', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  url: text('url').notNull(),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
})

export const showcaseTag = sqliteTable('showcase_tags', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  showcaseId: integer('showcase_id')
    .notNull()
    .references(() => showcase.id, { onDelete: 'cascade' }),
  tag: text('tag').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
})

// Additional example: User management
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
})

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
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
     id: integer('id').primaryKey({ autoIncrement: true }),
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
   # Local development (uses wrangler local D1)
   bun run db:migrate
   
   # Production (uses remote D1 via Drizzle Kit)
   bun run db:migrate-production
   ```

5. **Verify Migration**

   ```bash
   # Check if migration was applied
   bun run typecheck
   bun test  # Run tests to ensure everything works
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

// ✅ Type-safe simple select
const allUsers = await db.select().from(users)
// Type: Array<{ id: number; email: string; name: string; ... }>

// ✅ Type-safe select with conditions
const activeUsers = await db
  .select()
  .from(users)
  .where(eq(users.active, true))

// ✅ Type-safe select specific fields
const userEmails = await db
  .select({
    id: users.id,
    email: users.email,
    name: users.name,
  })
  .from(users)
// Type: Array<{ id: number; email: string; name: string }>

// ✅ Complex type-safe conditions
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

// ❌ NEVER bypass type safety
// const rawQuery = await env.DB.prepare("SELECT * FROM users").all() // No types!

// ✅ Use .get() for single results
const singleUser = await db
  .select()
  .from(users)
  .where(eq(users.id, 1))
  .get() // Returns single record or undefined

// ✅ Type-safe search operations
const searchUsers = await db
  .select()
  .from(users)
  .where(
    or(
      like(users.name, '%john%'),
      like(users.email, '%john%')
    )
  )
  .orderBy(asc(users.name))
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
import { count, sum, avg, min, max, sql } from 'drizzle-orm'
import { length } from 'drizzle-orm'

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

// Statistics with proper SQL functions
const postStats = await db
  .select({
    totalPosts: count(posts.id),
    avgLength: avg(sql`length(${posts.content})`),
    latestPost: max(posts.createdAt),
    oldestPost: min(posts.createdAt),
  })
  .from(posts)
  .where(eq(posts.published, true))

// Advanced aggregation: Monthly post counts
const monthlyPostCounts = await db
  .select({
    month: sql<string>`strftime('%Y-%m', datetime(${posts.createdAt}, 'unixepoch'))`,
    count: count(posts.id),
  })
  .from(posts)
  .where(eq(posts.published, true))
  .groupBy(sql`strftime('%Y-%m', datetime(${posts.createdAt}, 'unixepoch'))`)
  .orderBy(sql`strftime('%Y-%m', datetime(${posts.createdAt}, 'unixepoch')) DESC`)
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
  email: z.email(),
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

### Error Handling and Validation

```typescript
// services/user-service-with-error-handling.ts
import { userRepository } from '~/repositories/user-repository'
import { z } from 'zod'
import { DrizzleError } from 'drizzle-orm'

const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
})

export class UserService {
  async createUser(data: unknown) {
    try {
      // Validate input data
      const validatedData = createUserSchema.parse(data)
      
      // Check if user already exists
      const existingUser = await userRepository.findByEmail(validatedData.email)
      if (existingUser) {
        throw new Error('User with this email already exists')
      }
      
      return await userRepository.create(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`)
      }
      
      if (error instanceof DrizzleError) {
        console.error('Database error:', error)
        throw new Error('Database operation failed')
      }
      
      // Re-throw unknown errors
      throw error
    }
  }
  
  async safeGetUser(id: number) {
    try {
      const user = await userRepository.findById(id)
      return { success: true, data: user, error: null }
    } catch (error) {
      console.error('Failed to get user:', error)
      return { 
        success: false, 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
}
```

### Transaction Support

```typescript
// Advanced transaction patterns
import { db } from '~/lib/db'

export class TransactionService {
  async createUserWithProfile(userData: CreateUserData, profileData: CreateProfileData) {
    return await db.transaction(async (tx) => {
      // Create user first
      const [user] = await tx
        .insert(users)
        .values(userData)
        .returning()
      
      // Create profile with user reference
      const [profile] = await tx
        .insert(profiles)
        .values({
          ...profileData,
          userId: user.id,
        })
        .returning()
      
      // If any operation fails, the entire transaction is rolled back
      return { user, profile }
    })
  }
  
  async transferCredits(fromUserId: number, toUserId: number, amount: number) {
    return await db.transaction(async (tx) => {
      // Check sender balance
      const sender = await tx
        .select({ credits: users.credits })
        .from(users)
        .where(eq(users.id, fromUserId))
        .get()
      
      if (!sender || sender.credits < amount) {
        throw new Error('Insufficient credits')
      }
      
      // Deduct from sender
      await tx
        .update(users)
        .set({ credits: sql`${users.credits} - ${amount}` })
        .where(eq(users.id, fromUserId))
      
      // Add to receiver
      await tx
        .update(users)
        .set({ credits: sql`${users.credits} + ${amount}` })
        .where(eq(users.id, toUserId))
      
      // Log transaction
      await tx
        .insert(creditTransactions)
        .values({
          fromUserId,
          toUserId,
          amount,
          type: 'transfer',
        })
    })
  }
}
```

---

## 🚀 Performance Optimization

### Query Optimization

```typescript
import { inArray } from 'drizzle-orm'

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

// ✅ Using CTE for complex queries
const popularPosts = db
  .$with('popular_posts')
  .as(
    db
      .select({
        postId: posts.id,
        commentCount: count(comments.id),
      })
      .from(posts)
      .leftJoin(comments, eq(posts.id, comments.postId))
      .groupBy(posts.id)
      .having(gt(count(comments.id), 5))
  )

const result = await db
  .with(popularPosts)
  .select({
    post: posts,
    author: users,
    commentCount: popularPosts.commentCount,
  })
  .from(popularPosts)
  .leftJoin(posts, eq(popularPosts.postId, posts.id))
  .leftJoin(users, eq(posts.authorId, users.id))
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

## 🔧 Troubleshooting

### Common Issues and Solutions

#### **Schema Type Errors**

```bash
# Error: Cannot find module '~/database/schema' or type errors
# Solution: Regenerate schema types
bun run db:generate
bun run typecheck
```

#### **Migration Failures**

```bash
# Error: Migration fails to apply
# Solution: Check migration file and rollback if needed
bun run db:generate  # Generate new migration
# Manually review drizzle/*.sql files
bun run db:migrate   # Apply to local
```

#### **Connection Issues**

```typescript
// Error: D1 database connection fails
// Check environment variables in .env file
console.log('DB Config:', {
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID?.slice(0, 8) + '...',
  databaseId: process.env.D1_DATABASE_ID?.slice(0, 8) + '...',
  hasToken: !!process.env.CLOUDFLARE_API_TOKEN
})
```

#### **TypeScript Compilation Errors**

```json
// Ensure tsconfig.json includes database files
{
  "include": [
    "app/**/*",
    "database/**/*",
    "workers/**/*",
    "*.ts"
  ]
}
```

### Performance Issues

#### **Slow Queries**

```sql
-- Use EXPLAIN QUERY PLAN to analyze
EXPLAIN QUERY PLAN SELECT * FROM posts WHERE author_id = 1;

-- Add appropriate indexes
CREATE INDEX posts_author_id_idx ON posts(author_id);
```

#### **Large Result Sets**

```typescript
// Use pagination for large datasets
const pageSize = 100
const posts = await db
  .select()
  .from(posts)
  .limit(pageSize)
  .offset(page * pageSize)
```

### Development vs Production

#### **Local Development**

```bash
# Use local D1 database
bun run db:migrate  # Applies to local wrangler D1
bun run dev         # Uses local database
```

#### **Production Deployment**

```bash
# Deploy migrations to production
bun run db:migrate-production  # Uses remote D1 database
```

---

## 📚 Additional Resources

### Official Documentation

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Drizzle Kit CLI Reference](https://orm.drizzle.team/kit-docs/overview)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

### Best Practices Guides

- [Database Design Patterns](https://orm.drizzle.team/docs/guides)
- [Performance Optimization](https://orm.drizzle.team/docs/performance)
- [TypeScript Integration](https://orm.drizzle.team/docs/typescript)

### Community Resources

- [Drizzle Discord Community](https://discord.gg/yfjTbVXMW4)
- [GitHub Repository](https://github.com/drizzle-team/drizzle-orm)
- [Example Projects](https://github.com/drizzle-team/drizzle-orm/tree/main/examples)

### Related NARA Documentation

- `README.md` - Project setup and overview
- `.github/instructions/drizzle.instructions.md` - Coding standards
- `.github/instructions/cloudflare-d1.instructions.md` - D1 specific guidelines

---

This database guide provides a comprehensive foundation for working with Drizzle ORM and Cloudflare D1 in the NARA boilerplate.

---

Built with ❤️ by KotonoSora — to help you ship faster and with confidence.
