---
applyTo: '{app,workers,database,drizzle}/**/*.{ts,tsx}'
---

# Cloudflare D1 (SQLite) + Drizzle ORM Instructions - Copilot Instructions Rules

This document provides comprehensive guidelines for using **Cloudflare D1** (SQLite) and **Drizzle ORM** (~0.44.2) with **Drizzle Kit** (~0.31.4) in the NARA Boilerplate project, covering the `app`, `workers`, `database`, and `drizzle` directories. These guidelines ensure **type safety**, **performance**, **flexibility**, and alignment with the project's motto: "quality over quantity."

---

## 🚨 CRITICAL: Type-Safe D1 and Drizzle Usage - NEVER MAKE THIS MISTAKE

**THE MOST IMPORTANT RULE: ALWAYS define `D1Database` bindings in `wrangler.toml` and use Drizzle ORM’s type-safe query builder for all database operations.**

```ts
// ✅ CORRECT - Use typed D1 binding with Drizzle ORM:
import { Hono } from "hono";
import { db, products } from "~/database";
import { eq } from "drizzle-orm";

const app = new Hono<{ Bindings: { DB: D1Database } }>();
app.get("/api/products/:id", async (c) => {
  const id = c.req.param("id");
  const result = await db(c.env.DB).select().from(products).where(eq(products.id, id)).get();
  return c.json({ result }, 200);
});

// ❌ NEVER use untyped bindings or raw queries:
app.get("/api/test", async (c) => {
  const db = c.env.MY_DB; // ❌ Untyped binding
  return c.json({ result: await db.prepare("SELECT * FROM products").run() }); // ❌ Raw query
});
```

**If you see TypeScript errors about schemas or bindings:**
1. **Check `wrangler.toml`** for correct D1 bindings.
2. **Run `bun run wrangler:types`** to generate Worker types.
3. **Run `bun run db:generate`** to update Drizzle schema types.
4. **Run `bun run typecheck`** to verify TypeScript types.
5. **NEVER use `any` or bypass TypeScript** for D1 or Drizzle operations.
6. **Ensure `tsconfig.json` includes `database/**/*` and `workers/**/*`**.

---

## Setup and Configuration

### D1 Bindings (`wrangler.toml`)
```toml
[[d1_databases]]
binding = "DB"
database_name = "production-db"
database_id = "<prod-id>"

[[d1_databases]]
binding = "STAGING_DB"
database_name = "staging-db"
database_id = "<staging-id>"
```

- **Commands**:
  - Create D1 database: `npx wrangler d1 create <name>`
  - Generate types: `bun run wrangler:types`
- **Best Practice**: Use consistent binding names (e.g., `DB`) across `wrangler.toml` and Workers.

### Drizzle ORM Setup (`drizzle.config.ts`)
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./database/schema.ts",
  out: "./drizzle",
  driver: "d1-http",
  dbCredentials: {
    databaseId: process.env.D1_DATABASE_ID,
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    token: process.env.CLOUDFLARE_API_TOKEN,
  },
  introspect: {
    casing: "camel",
  },
});
```

- **Dependencies**:
  - `drizzle-orm` (~0.44.2): Type-safe query builder.
  - `drizzle-kit` (~0.31.4): Schema and migration management.
  - `@cloudflare/workers-types` (4.20250710.0): D1 types.
  - `@cloudflare/vite-plugin` (1.9.3): Local D1 mocking.
  - `@cloudflare/vitest-pool-workers` (0.8.52): D1 testing.
- **Commands**:
  - Generate schema: `bun run db:generate`
  - Apply migrations: `bun run db:migrate` (local) or `bun run db:migrate-production`
  - Introspect schema: `bun run db:introspect`

### Schema Definition (`database/schema.ts`)
```ts
import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  description: text("description"),
  stock: integer("stock").notNull().default(0),
}, (table) => ({
  nameIdx: index("name_idx").on(table.name),
  stockIdx: index("stock_idx").on(table.stock),
}));

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  productId: text("product_id").notNull().references(() => products.id),
  total: real("total").notNull(),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
});

export const db = (d1: D1Database) => drizzle(d1, { schema: { products, orders, users } });
```

- **Best Practice**: Define schemas with `sqliteTable` for type safety and export a typed `db` instance.

---

## Database Management

### Generating Migrations
```bash
bun run db:generate
```

- **Output**: Creates migration files in `drizzle/` (e.g., `drizzle/0000_initial_migration.sql`).
- **Best Practice**: Run after every schema change in `database/schema.ts`.

### Applying Migrations
```bash
# Local
bun run db:migrate
# Production
bun run db:migrate-production
```

- **Best Practice**: Test migrations on staging before production.

### Seeding Data
Add to `package.json`:
```json
{
  "scripts": {
    "db:seed": "bun run database/seed.ts"
  }
}
```

- **Seed Script** (`database/seed.ts`):
```ts
import { db, products, orders } from "~/database";
import { v4 as uuidv4 } from "uuid";
import type { D1Database } from "@cloudflare/workers-types";

export async function seedDatabase(d1: D1Database) {
  try {
    await db(d1).delete(products).execute();
    await db(d1).delete(orders).execute();

    await db(d1).insert(products).values([
      { id: uuidv4(), name: "Laptop", price: 999.99, description: "High-performance laptop", stock: 10 },
      { id: uuidv4(), name: "Phone", price: 599.99, description: "Latest smartphone", stock: 20 },
    ]).execute();

    const product = await db(d1).select({ id: products.id }).from(products).limit(1).get();
    if (product) {
      await db(d1).insert(orders).values([
        { id: uuidv4(), userId: "user1", productId: product.id, total: 999.99 },
      ]).execute();
    }

    console.log("Database seeded successfully");
  } catch (err) {
    console.error("Seeding failed:", err);
    throw err;
  }
}

if (import.meta.main) {
  const d1 = process.env.DB as unknown as D1Database;
  seedDatabase(d1);
}
```

- **Run**: `bun run db:seed`
- **Best Practice**: Use for development/testing; avoid destructive operations in production.

### Rolling Back Migrations
Add to `package.json`:
```json
{
  "scripts": {
    "db:rollback": "bun run database/rollback.ts"
  }
}
```

- **Rollback Script** (`database/rollback.ts`):
```ts
import type { D1Database } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";
import { migrations } from "drizzle-orm/d1/migrator";

export async function rollbackDatabase(d1: D1Database, steps: number = 1) {
  try {
    const drizzleDb = drizzle(d1);
    await migrations.rollback(drizzleDb, { steps });
    console.log(`Rolled back ${steps} migration(s) successfully`);
  } catch (err) {
    console.error("Rollback failed:", err);
    throw err;
  }
}

if (import.meta.main) {
  const d1 = process.env.DB as unknown as D1Database;
  rollbackDatabase(d1, 1);
}
```

- **Run**: `bun run db:rollback`
- **Best Practice**: Backup data before rollback; test locally first.

### Customizing Migrations
- **Custom Migration** (`drizzle/0001_custom_migration.sql`):
```sql
ALTER TABLE products ADD COLUMN category TEXT;
CREATE INDEX category_idx ON products (category);
```

- **Steps**:
  1. Run `bun run db:generate`.
  2. Edit migration file in `drizzle/`.
  3. Update `database/schema.ts`:
```ts
export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  description: text("description"),
  stock: integer("stock").notNull().default(0),
  category: text("category"),
}, (table) => ({
  nameIdx: index("name_idx").on(table.name),
  stockIdx: index("stock_idx").on(table.stock),
  categoryIdx: index("category_idx").on(table.category),
}));
```

  4. Run `bun run db:generate` and `bun run db:migrate`.
- **Best Practice**: Document custom migrations with comments; test locally.

### Schema Versioning
- **Versioning Script** (`database/version.ts`):
```ts
import { db } from "~/database";
import type { D1Database } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";
import { migrations } from "drizzle-orm/d1/migrator";

export async function getSchemaVersion(d1: D1Database) {
  const drizzleDb = drizzle(d1);
  const result = await drizzleDb
    .select({ version: migrations.version })
    .from(migrations)
    .orderBy(desc(migrations.version))
    .limit(1)
    .get();
  return result?.version ?? "0.0.0";
}

export async function setSchemaVersion(d1: D1Database, version: string) {
  await db(d1).insert(migrations).values({ version, applied_at: new Date() }).execute();
}
```

- **Best Practice**: Use semantic versioning; maintain a changelog in `drizzle/changelog.md`.

---

## Query Operations

### Relational Queries
```ts
import { db, users, orders, products } from "~/database";
import { eq } from "drizzle-orm";

export async function getUserWithOrders(d1: D1Database, userId: string) {
  return await db(d1)
    .select({
      user: { id: users.id, email: users.email },
      orders: { id: orders.id, total: orders.total },
    })
    .from(users)
    .leftJoin(orders, eq(orders.userId, users.id))
    .where(eq(users.id, userId))
    .all();
}
```

- **Best Practice**: Use `leftJoin` for optional relations; define relations in `database/schema.ts`.

### Dynamic Queries
```ts
import { Hono } from "hono";
import { db, products } from "~/database";
import { like, and } from "drizzle-orm";

const app = new Hono<{ Bindings: { DB: D1Database } }>();

app.get("/api/products/search", async (c) => {
  const { name, minPrice } = c.req.query();
  let query = db(c.env.DB).select().from(products);
  if (name) query = query.where(like(products.name, `%${name}%`));
  if (minPrice) query = query.where(and(like(products.price, parseFloat(minPrice))));
  const results = await query.all();
  return c.json({ products: results }, 200);
});
```

- **Best Practice**: Validate inputs with `@hono/zod-validator` for type safety.

### Prepared Statements
```ts
import { db, products } from "~/database";
import { eq } from "drizzle-orm";

export const getProductStmt = db
  .select()
  .from(products)
  .where(eq(products.id, placeholder("id")))
  .prepare("get_product_by_id");

export async function getProduct(d1: D1Database, id: string) {
  return await getProductStmt.execute({ id });
}
```

- **Best Practice**: Cache prepared statements in `database/queries.ts` for performance.

### Handling Large Datasets
```ts
import { db, products } from "~/database";

export async function* streamProducts(d1: D1Database, batchSize: number = 100) {
  let offset = 0;
  while (true) {
    const batch = await db(d1).select().from(products).limit(batchSize).offset(offset).all();
    if (batch.length === 0) break;
    yield batch;
    offset += batchSize;
  }
}
```

- **Best Practice**: Use async generators for streaming; combine with `limit` and `offset`.

---

## Advanced Operations

### D1 Backup and Restore
- **Backup Script** (`database/backup.ts`):
```ts
import type { D1Database } from "@cloudflare/workers-types";

export async function backupDatabase(d1: D1Database, output: string) {
  try {
    const result = await d1.dump();
    console.log(`Backup created: ${output}`);
    return result;
  } catch (err) {
    console.error("Backup failed:", err);
    throw err;
  }
}
```

- **Restore Script** (`database/restore.ts`):
```ts
import type { D1Database } from "@cloudflare/workers-types";

export async function restoreDatabase(d1: D1Database, backupData: ArrayBuffer) {
  try {
    await d1.exec(String.fromCharCode.apply(null, new Uint8Array(backupData)));
    console.log("Database restored successfully");
  } catch (err) {
    console.error("Restore failed:", err);
    throw err;
  }
}
```

- **Run**: `bun run db:backup` or `bun run db:restore`
- **Best Practice**: Store backups in Cloudflare R2; test restore locally.

### D1 Query Optimization
```ts
import { db, products } from "~/database";
import { eq } from "drizzle-orm";

app.get("/api/analyze", async (c) => {
  const result = await db(c.env.DB).select().from(products).where(eq(products.name, "Laptop")).explain();
  return c.json({ plan: result }, 200);
});
```

- **Best Practice**: Use Drizzle’s `explain()`; add indexes for frequent queries.

### D1 Security Practices
- **API Token Management** (`wrangler.toml`):
```toml
[vars]
CLOUDFLARE_API_TOKEN = "<secure-token>"
```

- **Restricting Access**:
```ts
app.use("*", async (c, next) => {
  const apiKey = c.req.header("X-API-Key");
  if (apiKey !== c.env.API_KEY) return c.json({ error: "Unauthorized" }, 401);
  await next();
});
```

- **Best Practice**: Use environment variables; restrict access with API keys or Cloudflare Access.

### D1 Monitoring and Debugging
```ts
import { db, products } from "~/database";

app.get("/api/monitor", async (c) => {
  const start = Date.now();
  const result = await db(c.env.DB).select().from(products).limit(10).all();
  const duration = Date.now() - start;
  return c.json({ results: result, duration }, 200);
});

app.get("/api/debug", async (c) => {
  try {
    const result = await db(c.env.DB).select().from(sql`nonexistent_table`).all();
    return c.json({ result }, 200);
  } catch (err) {
    return c.json({ error: err.message, stack: err.stack }, 500);
  }
});
```

- **Best Practice**: Use Drizzle for debugging; log durations; use Cloudflare’s dashboard for metrics.

### Error Recovery and Retry Logic
```ts
import { db, products } from "~/database";
import { eq } from "drizzle-orm";

export async function retryQuery<T>(fn: () => Promise<T>, retries: number = 3, delay: number = 1000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Retry limit reached");
}

app.get("/api/retry", async (c) => {
  const result = await retryQuery(() => db(c.env.DB).select().from(products).where(eq(products.id, "1")).get());
  return c.json({ result }, 200);
});
```

- **Best Practice**: Use exponential backoff for retries; log errors for debugging.

### Schema Evolution and Compatibility
```ts
export async function migrateWithCompatibility(d1: D1Database) {
  const version = await getSchemaVersion(d1);
  if (version === "1.0.0") {
    await db(d1).execute(sql`ALTER TABLE products ADD COLUMN category TEXT`);
    await setSchemaVersion(d1, "1.1.0");
  }
}
```

- **Best Practice**: Use conditional migrations; maintain backward compatibility.

### Cross-Environment Consistency
```ts
app.get("/api/sync-check", async (c) => {
  const prodVersion = await getSchemaVersion(c.env.DB);
  const stagingVersion = await getSchemaVersion(c.env.STAGING_DB);
  return c.json({ prod: prodVersion, staging: stagingVersion }, 200);
});
```

- **Best Practice**: Use staging to test migrations; sync schemas across environments.

---

## Testing with Vitest

```ts
import { describe, it, expect } from "vitest";
import { miniflare } from "@cloudflare/vitest-pool-workers";
import { db, products } from "~/database";

describe("D1 and Drizzle Integration", () => {
  it("fetches product", async () => {
    const mf = miniflare({ bindings: { DB: { databaseId: "mock-id" } } });
    const d1 = mf.getD1Database("DB");
    const result = await db(d1).select().from(products).where(eq(products.id, "1")).get();
    expect(result).toBeDefined();
  });
});
```

- **Best Practice**: Mock `D1Database` with `@cloudflare/vitest-pool-workers`; test Drizzle queries.

---

## Best Practices and Anti-Patterns

### ✅ Best Practices:
- Use Drizzle ORM for all queries to ensure type safety.
- Define D1 bindings in `wrangler.toml` and generate types with `bun run wrangler:types`.
- Backup data before migrations or rollbacks.
- Monitor query performance with Cloudflare’s dashboard.

### ❌ Anti-Patterns:
- Using raw D1 queries: `c.env.DB.prepare("SELECT * FROM products").run()` // ❌ Lacks type safety.
- Hardcoding bindings: `const db = c.env.MY_DB` // ❌ Untyped.
- Skipping schema updates: Modifying D1 directly without updating `database/schema.ts`.

---

## AI Assistant Guidelines

When working with Cloudflare D1 and Drizzle ORM in NARA Boilerplate:
- **If TypeScript errors occur, suggest checking `wrangler.toml`, running `bun run wrangler:types`, `bun run db:generate`, and `bun run typecheck`.**
- **NEVER suggest raw D1 queries**; always use Drizzle ORM.
- **After schema changes, remind to run `bun run db:generate` and `bun run db:migrate`.**
- **Suggest transactions, prepared statements, or batching** for performance.
- **Ensure compatibility** with Hono and React Router.
- **Recommend backups** before migrations or rollbacks.
- **Suggest retry logic** for transient errors.