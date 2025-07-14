---
applyTo: '{app,database,drizzle}/**/*.{ts,tsx}'
---

# Drizzle ORM Instructions - Copilot Instructions Rules

This document outlines the rules and best practices for using **Drizzle ORM** (version ~0.44.2) and **Drizzle Kit** (version ~0.31.4) in the NARA Boilerplate project, focusing on database management in the `app`, `database`, and `drizzle` directories. These guidelines ensure **type safety**, **flexibility**, and alignment with the project's motto: "quality over quantity."

---

## 🚨 CRITICAL: Type-Safe Queries - NEVER MAKE THIS MISTAKE

**THE MOST IMPORTANT RULE: ALWAYS use Drizzle ORM’s type-safe query builder for all database operations.**

```ts
// ✅ CORRECT - Use typed queries:
import { db, products } from "~/database";
import { eq } from "drizzle-orm";

export async function getProduct(id: string) {
  return await db.select().from(products).where(eq(products.id, id)).get();
}

// ❌ NEVER bypass Drizzle with raw queries:
export async function getProduct(id: string) {
  return await env.DB.prepare("SELECT * FROM products WHERE id = ?").bind(id).first(); // ❌ No type safety
}
```

**If you see TypeScript errors about schemas or queries:**
1. **IMMEDIATELY run `bun run db:generate`** to update schema types.
2. **Run `bun run typecheck`** to verify TypeScript types.
3. **NEVER use `any` or ignore errors** in Drizzle queries.
4. **Ensure `tsconfig.json` includes `database/**/*`** for schema types.

---

## Drizzle ORM Setup & Workflow

- **Location**:
  - **Schema Definitions**: Defined in `database/schema.ts`.
  - **Migrations**: Stored in `drizzle/` and managed by Drizzle Kit.
  - **Queries**: Used in `app/routes/*.tsx` (React Router) and `workers/api/*.ts` (Hono).
- **Dependencies**:
  - `drizzle-orm` (~0.44.2): Type-safe query builder.
  - `drizzle-kit` (~0.31.4): Schema generation and migrations.
- **Setup Commands**:
  - Generate schema: `bun run db:generate`
  - Apply migrations locally: `bun run db:migrate`
  - Apply migrations to production: `bun run db:migrate-production`
  - Seed database: `bun run db:seed`
- **Type Generation**:
  - Schema types are auto-generated in `database/schema.ts` by Drizzle Kit.
  - Run `bun run db:generate` after modifying schemas.

---

## Critical Package Guidelines

### ✅ CORRECT Packages:
- `drizzle-orm` (~0.44.2): For type-safe queries.
- `drizzle-kit` (~0.31.4): For schema and migration management.
- `@cloudflare/workers-types` (4.20250710.0): For D1 integration.

### ❌ NEVER Use:
- Raw D1 queries without Drizzle - Lacks type safety.
- Other ORMs (e.g., Prisma, TypeORM) - Not optimized for Cloudflare Workers.
- Older Drizzle versions (<0.44.2) - May lack D1-specific features.

---

## Essential Drizzle ORM Architecture

### Schema Definition (`database/schema.ts`)
```ts
import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  description: text("description"),
}, (table) => ({
  nameIdx: index("name_idx").on(table.name),
}));

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  productId: text("product_id").notNull().references(() => products.id),
  total: real("total").notNull(),
});

// Export typed DB instance
import { drizzle } from "drizzle-orm/d1";
export const db = (d1: D1Database) => drizzle(d1, { schema: { products, orders } });
```

- **Structure**: Use `sqliteTable` for type-safe schema definitions.
- **Indexes and Relations**: Define indexes and foreign keys for performance and integrity.
- **Best Practice**: Export a typed `db` instance for reuse.

### Queries in Routes (`app/routes/products.$id.tsx`)
```ts
import type { Route } from "./+types/products.$id";
import { db, products } from "~/database";
import { eq } from "drizzle-orm";

export async function loader({ params }: Route.LoaderArgs) {
  const product = await db.select().from(products).where(eq(products.id, params.id)).get();
  if (!product) throw data({ error: "Product not found" }, { status: 404 });
  return { product };
}
```

- **Type Safety**: Queries are typed based on schema definitions.
- **Error Handling**: Throw `data()` for React Router error boundaries.

### Queries in Workers (`workers/api/orders.ts`)
```ts
import { Hono } from "hono";
import { db, orders } from "~/database";
import { eq } from "drizzle-orm";

const ordersApi = new Hono<{ Bindings: { DB: D1Database } }>();

ordersApi.get("/:id", async (c) => {
  const id = c.req.param("id");
  const order = await db(c.env.DB).select().from(orders).where(eq(orders.id, id)).get();
  if (!order) return c.json({ error: "Order not found" }, 404);
  return c.json({ order }, 200);
});

export default ordersApi;
```

- **Integration**: Use `db(c.env.DB)` for type-safe queries in Hono.

---

## Database Management with Drizzle Kit

### Generating Migrations:
```bash
bun run db:generate
```

- **Output**: Creates migration files in `drizzle/` (e.g., `drizzle/0000_initial_migration.sql`).
- **Best Practice**: Run after every schema change in `database/schema.ts`.

### Applying Migrations:
```bash
# Local
bun run db:migrate
# Production
bun run db:migrate-production
```

- **Best Practice**: Test migrations locally before applying to production.

### Seeding Data:
Add the following script to `package.json`:
```json
{
  "scripts": {
    "db:seed": "bun run database/seed.ts"
  }
}
```

- **Seed Script** (`database/seed.ts`):
```ts
// database/seed.ts
import { db, products, orders } from "~/database";
import { v4 as uuidv4 } from "uuid";
import type { D1Database } from "@cloudflare/workers-types";

export async function seedDatabase(d1: D1Database) {
  try {
    // Clear existing data (optional, use with caution in production)
    await db(d1).delete(products).execute();
    await db(d1).delete(orders).execute();

    // Seed products
    await db(d1).insert(products).values([
      { id: uuidv4(), name: "Laptop", price: 999.99, description: "High-performance laptop" },
      { id: uuidv4(), name: "Phone", price: 599.99, description: "Latest smartphone" },
    ]).execute();

    // Seed orders
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

// Run seed script
if (import.meta.main) {
  const d1 = process.env.DB as unknown as D1Database; // Adjust based on your env setup
  seedDatabase(d1);
}
```

- **Run**: `bun run db:seed`
- **Best Practice**:
  - Use `seedDatabase` in development and testing environments to populate sample data.
  - Avoid destructive operations (e.g., `delete`) in production; consider conditional checks.
  - Integrate with CI/CD by running `bun run db:seed` in test pipelines.
- **Integration with Workers**:
```ts
// workers/api/seed.ts
import { Hono } from "hono";
import { seedDatabase } from "~/database/seed";

const seedApi = new Hono<{ Bindings: { DB: D1Database } }>();

seedApi.post("/seed", async (c) => {
  await seedDatabase(c.env.DB);
  return c.json({ message: "Database seeded" }, 200);
});

export default seedApi;
```

- **Integration with Routes**:
```ts
// app/routes/seed.tsx
import type { Route } from "./+types/seed";
import { seedDatabase } from "~/database/seed";

export async function action({ context }: Route.ActionArgs) {
  await seedDatabase(context.env.DB);
  return { message: "Database seeded" };
}
```

### Rolling Back Migrations:
Add the following script to `package.json`:
```json
{
  "scripts": {
    "db:rollback": "bun run database/rollback.ts"
  }
}
```

- **Rollback Script** (`database/rollback.ts`):
```ts
// database/rollback.ts
import { db } from "~/database";
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

// Run rollback script
if (import.meta.main) {
  const d1 = process.env.DB as unknown as D1Database; // Adjust based on your env setup
  rollbackDatabase(d1, 1);
}
```

- **Run**: `bun run db:rollback`
- **Best Practice**:
  - Backup production data before running rollback.
  - Test rollback locally to ensure no data loss.
  - Use `steps` parameter to control how many migrations to revert.
- **Integration with Workers**:
```ts
// workers/api/rollback.ts
import { Hono } from "hono";
import { rollbackDatabase } from "~/database/rollback";

const rollbackApi = new Hono<{ Bindings: { DB: D1Database } }>();

rollbackApi.post("/rollback", async (c) => {
  await rollbackDatabase(c.env.DB, 1);
  return c.json({ message: "Migration rolled back" }, 200);
});

export default rollbackApi;
```

### Customizing Migrations:
- **Custom Migration File** (`drizzle/0001_custom_migration.sql`):
```sql
-- Add a new column to products
ALTER TABLE products ADD COLUMN stock INTEGER NOT NULL DEFAULT 0;
-- Create a new index
CREATE INDEX stock_idx ON products (stock);
```

- **Steps**:
  1. Run `bun run db:generate` to create a migration file.
  2. Edit the generated file in `drizzle/` to add custom SQL (e.g., `ALTER TABLE`, `CREATE INDEX`).
  3. Update `database/schema.ts` to reflect changes:
```ts
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
```

  4. Run `bun run db:generate` again to ensure type safety.
  5. Apply with `bun run db:migrate` or `bun run db:migrate-production`.
- **Best Practice**:
  - Document custom migrations in `drizzle/` with comments for clarity.
  - Test custom migrations locally to avoid breaking changes.
  - Run `bun run typecheck` after editing schemas.

### Schema Versioning:
- **Approach**: Track schema versions using a custom table or Drizzle’s `__drizzle_migrations`.
- **Versioning Script** (`database/version.ts`):
```ts
// database/version.ts
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

- **Usage**:
  - Check version: `await getSchemaVersion(d1)` to verify the current schema version.
  - Update version: `await setSchemaVersion(d1, "1.0.0")` after applying migrations.
- **Best Practice**:
  - Use semantic versioning (e.g., `1.0.0`) for schema versions.
  - Maintain a changelog in `docs/` or `drizzle/changelog.md` to track schema changes.
  - Integrate version checks in CI/CD pipelines to ensure compatibility.

---

## Advanced Database Operations

### Relational Queries:
Drizzle ORM supports type-safe relational queries for one-to-many and many-to-many relationships.

- **One-to-Many Example** (One user has many orders):
```ts
// database/schema.ts
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  total: real("total").notNull(),
});

// database/queries.ts
import { db, users, orders } from "~/database";
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

- **Many-to-Many Example** (Products and categories via a junction table):
```ts
// database/schema.ts
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export const productCategories = sqliteTable("product_categories", {
  productId: text("product_id").notNull().references(() => products.id),
  categoryId: text("category_id").notNull().references(() => categories.id),
}, (table) => ({
  pk: primaryKey({ columns: [table.productId, table.categoryId] }),
}));

// database/queries.ts
export async function getProductWithCategories(d1: D1Database, productId: string) {
  return await db(d1)
    .select({
      product: { id: products.id, name: products.name },
      category: { id: categories.id, name: categories.name },
    })
    .from(products)
    .leftJoin(productCategories, eq(productCategories.productId, products.id))
    .leftJoin(categories, eq(productCategories.categoryId, categories.id))
    .where(eq(products.id, productId))
    .all();
}
```

- **Best Practice**:
  - Define relations in `database/schema.ts` using `references()`.
  - Use `leftJoin` for optional relations to avoid missing data.
  - Test relational queries in `bun run test` to ensure correctness.

### Dynamic Queries:
Build flexible queries based on user input.

```ts
// workers/api/products.ts
import { Hono } from "hono";
import { db, products } from "~/database";
import { eq, like, and } from "drizzle-orm";

const productsApi = new Hono<{ Bindings: { DB: D1Database } }>();

productsApi.get("/search", async (c) => {
  const { name, minPrice } = c.req.query();
  let query = db(c.env.DB).select().from(products);

  if (name) query = query.where(like(products.name, `%${name}%`));
  if (minPrice) query = query.where(and(eq(products.price, parseFloat(minPrice))));

  const results = await query.all();
  return c.json({ products: results }, 200);
});
```

- **Why**: Allows dynamic filtering based on user input.
- **How**: Chain conditions with `and`, `or`, or `like` operators.
- **Best Practice**: Validate inputs with `@hono/zod-validator` to ensure type safety.

### Prepared Statements:
Use prepared statements for frequently executed queries to improve performance.

```ts
// database/queries.ts
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

- **Why**: Reduces query parsing overhead in Cloudflare D1.
- **How**: Use `placeholder()` and `prepare()` for reusable queries.
- **Best Practice**: Cache prepared statements in `database/queries.ts`.

### Database Introspection:
Use Drizzle Kit to introspect an existing D1 database and generate schemas.

```bash
bun run db:introspect
```

- **Config** (`drizzle.config.ts`):
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

- **Steps**:
  1. Add `introspect` configuration to `drizzle.config.ts`.
  2. Run `bun run db:introspect` to generate `database/schema.ts` from D1.
  3. Review and adjust generated schema for type safety.
  4. Run `bun run db:generate` to create migrations.
- **Best Practice**:
  - Use introspection for legacy databases or when schema is not defined.
  - Validate generated schemas with `bun run typecheck`.

### Handling Large Datasets:
Use streaming or batching for large datasets to avoid memory issues.

```ts
// database/queries.ts
import { db, products } from "~/database";

export async function* streamProducts(d1: D1Database, batchSize: number = 100) {
  let offset = 0;
  while (true) {
    const batch = await db(d1)
      .select()
      .from(products)
      .limit(batchSize)
      .offset(offset)
      .all();
    if (batch.length === 0) break;
    yield batch;
    offset += batchSize;
  }
}

// workers/api/products.ts
import { Hono } from "hono";
import { streamProducts } from "~/database/queries";

const productsApi = new Hono<{ Bindings: { DB: D1Database } }>();

productsApi.get("/stream", async (c) => {
  const stream = new ReadableStream({
    async start(controller) {
      for await (const batch of streamProducts(c.env.DB)) {
        controller.enqueue(JSON.stringify(batch) + "\n");
      }
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream" },
  });
});
```

- **Why**: Prevents memory overload when fetching large datasets.
- **How**: Use async generators for streaming or batch queries.
- **Best Practice**: Combine with `limit` and `offset` for pagination.

---

## Advanced Query Patterns

### Transactions:
```ts
import { db, products, orders } from "~/database";
import { eq } from "drizzle-orm";

export async function createOrder(d1: D1Database, productId: string, userId: string, total: number) {
  return await db(d1).transaction(async (tx) => {
    const product = await tx.select().from(products).where(eq(products.id, productId)).get();
    if (!product) throw new Error("Product not found");
    const order = await tx.insert(orders).values({ id: uuidv4(), userId, productId, total }).returning().get();
    return order;
  });
}
```

- **Why**: Ensures atomic operations for data consistency.
- **How**: Use `db.transaction()` for multi-step operations.

### Joins:
```ts
import { db, products, orders } from "~/database";
import { eq } from "drizzle-orm";

export async function getOrderWithProduct(d1: D1Database, orderId: string) {
  return await db(d1)
    .select({
      orderId: orders.id,
      productName: products.name,
      total: orders.total,
    })
    .from(orders)
    .innerJoin(products, eq(orders.productId, products.id))
    .where(eq(orders.id, orderId))
    .get();
}
```

- **Why**: Combines data from multiple tables efficiently.
- **How**: Use `innerJoin`, `leftJoin`, etc., with type-safe conditions.

---

## Type Safety & Schema Management

### ✅ Type-Safe Schemas:
```ts
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
});
```

- **Why**: Generates TypeScript types for queries and responses.
- **How**: Use `sqliteTable` with constraints (e.g., `notNull`, `unique`).

### ❌ NEVER Skip Schema Updates:
```ts
// ❌ DON'T modify database directly without updating schema.ts:
await env.DB.prepare("ALTER TABLE products ADD COLUMN new_field TEXT").run(); // ❌
```

---

## Testing with Vitest

### Testing Queries:
```ts
// database/__tests__/orders.test.ts
import { db, orders } from "~/database";
import { eq } from "drizzle-orm";
import { describe, it, expect } from "vitest";

describe("Order queries", () => {
  it("fetches an order by ID", async () => {
    const order = await db.select().from(orders).where(eq(orders.id, "1")).get();
    expect(order).toHaveProperty("total");
  });
});
```

- **Setup**: Mock `D1Database` with `@cloudflare/vitest-pool-workers`.
- **Run**: `bun run test` or `bun run coverage`.

---

## Performance Optimization

### Indexing:
```ts
export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
}, (table) => ({
  nameIdx: index("name_idx").on(table.name),
}));
```

- **Why**: Speeds up common queries.
- **How**: Define indexes in schema and regenerate migrations.

### Pagination:
```ts
export async function getProducts(d1: D1Database, limit: number, offset: number) {
  return await db(d1).select().from(products).limit(limit).offset(offset).all();
}
```

- **Why**: Reduces data transfer for large datasets.
- **How**: Use `limit` and `offset` in queries.

---

## Anti-Patterns to Avoid

### ❌ Non-Type-Safe Queries:
```ts
// ❌ DON'T use raw SQL:
await env.DB.prepare("SELECT * FROM products").all();
```

### ❌ Unmanaged Schemas:
```ts
// ❌ DON'T skip schema updates:
await db.insert(products).values({ id: "1", name: "Test" }); // ❌ Missing schema fields
```

---

## Essential Type Safety Rules

1. **ALWAYS** use Drizzle’s query builder for database operations.
2. **RUN `bun run db:generate`** after modifying `database/schema.ts`.
3. **RUN `bun run typecheck`** to catch schema errors.
4. **DEFINE** schemas with `sqliteTable` for type safety.
5. **ADD** `database/**/*` to `tsconfig.json` include array.

---

## AI Assistant Guidelines

When working with Drizzle ORM in NARA Boilerplate:
- **If you see TypeScript errors, ALWAYS suggest running `bun run db:generate` and `bun run typecheck`.**
- **NEVER suggest raw SQL queries**; use Drizzle’s query builder.
- **After modifying schemas, remind the user to run `bun run db:generate` and `bun run db:migrate`.**
- **Suggest transactions** for multi-step operations.
- **Suggest seeding** for development and testing data, and remind to add `db:seed` script to `package.json`.
- **Suggest rollback scripts** for safe migration reversals.
- **Suggest prepared statements** for frequently executed queries.
- **Ensure compatibility** with Hono and React Router.

