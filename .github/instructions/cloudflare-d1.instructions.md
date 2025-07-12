---
applyTo: '{workers,drizzle}/**/*.ts'
---

# Cloudflare D1 (SQLite) Instructions - Copilot Instructions Rules

This document outlines the rules and best practices for using **Cloudflare D1** (SQLite) in the NARA Boilerplate project, focusing on its integration with Cloudflare Workers in the `workers` and `drizzle` directories. These guidelines ensure **type safety**, **performance**, and alignment with the project's motto: "quality over quantity."

---

## 🚨 CRITICAL: D1 Bindings - NEVER MAKE THIS MISTAKE

**THE MOST IMPORTANT RULE: ALWAYS define `D1Database` bindings in `wrangler.toml` and use them type-safely in Workers. NEVER use raw D1 queries without Drizzle ORM for complex operations.**

```ts
// ✅ CORRECT - Use typed D1 binding with Drizzle ORM:
import { Hono } from "hono";
import { db, products } from "~/database";
import { eq } from "drizzle-orm";

const app = new Hono<{ Bindings: { DB: D1Database } }>();
app.get("/api/test", async (c) => {
  const result = await db(c.env.DB).select().from(products).where(eq(products.id, "1")).get();
  return c.json({ result }, 200);
});

// ❌ NEVER use untyped or hardcoded bindings or raw queries:
app.get("/api/test", async (c) => {
  const db = c.env.MY_DB; // ❌ Untyped or incorrect binding
  return c.json({ result: await db.prepare("SELECT 1").run() }); // ❌ Raw query
});
```

**If you see TypeScript errors about missing `D1Database`:**
1. **IMMEDIATELY check `wrangler.toml`** for correct binding configuration.
2. **Run `bun run wrangler:types`** to generate type definitions.
3. **NEVER use `any` or bypass TypeScript** for D1 operations.
4. **Ensure `tsconfig.json` includes `@cloudflare/workers-types`**.

---

## D1 Setup & Workflow

- **Location**:
  - **Bindings**: Configured in `wrangler.toml` and accessed via `c.env.DB` in `workers/`.
  - **Migrations**: Managed in `drizzle/` using Drizzle Kit.
- **Dependencies**:
  - `@cloudflare/workers-types` (4.20250710.0): Types for D1 bindings.
  - `@cloudflare/vite-plugin` (1.9.3): Integrates D1 with Vite dev server.
  - `@cloudflare/vitest-pool-workers` (0.8.52): For D1 testing in Vitest.
- **Setup Commands**:
  - Create D1 database: `npx wrangler d1 create <name>`
  - Update `wrangler.toml` with database ID and name.
  - Generate Worker types: `bun run wrangler:types`
  - Apply migrations: `bun run db:migrate` (local) or `bun run db:migrate-production` (production).
- **Dev Server**: The development server (`bun run dev`) uses `@cloudflare/vite-plugin` to mock D1 bindings locally.

---

## Critical Package Guidelines

### ✅ CORRECT Packages:
- `@cloudflare/workers-types` (4.20250710.0): For D1 binding types.
- `@cloudflare/vite-plugin` (1.9.3): For D1 integration in Vite.
- `@cloudflare/vitest-pool-workers` (0.8.52): For D1 testing.

### ❌ NEVER Use:
- Direct SQLite libraries (e.g., `better-sqlite3`) - Not compatible with Cloudflare Workers.
- Raw D1 queries without an ORM like Drizzle - Lacks type safety.
- Older `@cloudflare/workers-types` versions (<4.20250710.0) - May lack D1-specific types.

---

## Essential D1 Architecture

### Configuring D1 Bindings (`wrangler.toml`)
```toml
[[d1_databases]]
binding = "DB"
database_name = "<your-database-name>"
database_id = "<your-database-id>"
```

- **Structure**: Define D1 bindings under `[[d1_databases]]` with a unique `binding` name (e.g., `DB`).
- **Best Practice**: Use the same binding name in `workers/` (e.g., `c.env.DB`).
- **Generate Types**: Run `bun run wrangler:types` after updating `wrangler.toml`.

### Using D1 in Workers (`workers/app.ts`)
```ts
import { Hono } from "hono";
import { db, products } from "~/database";
import { eq } from "drizzle-orm";

const app = new Hono<{ Bindings: { DB: D1Database } }>();

app.get("/api/health", async (c) => {
  const result = await db(c.env.DB).select({ version: sql<string>`sqlite_version()` }).from(sql`sqlite_master`).get();
  return c.json({ version: result.version }, 200);
});

export default app;
```

- **Bindings**: Access D1 via `c.env.DB` with type `D1Database`.
- **Queries**: Use Drizzle ORM for type-safe queries; raw queries are only acceptable for simple operations like health checks.
- **Error Handling**: Always handle D1 errors with try-catch.

### D1 Migrations (`drizzle.config.ts`)
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
});
```

- **Run Migrations**:
  - Locally: `bun run db:migrate`
  - Production: `bun run db:migrate-production`
- **Best Practice**: Verify `wrangler.toml` bindings match `drizzle.config.ts`.

---

## Advanced D1 Operations

### D1 Database Configuration
- **Creating Databases**:
```bash
npx wrangler d1 create my-database
```

- **Multiple Databases** (`wrangler.toml`):
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

- **Accessing in Workers**:
```ts
const app = new Hono<{ Bindings: { DB: D1Database; STAGING_DB: D1Database } }>();

app.get("/api/compare", async (c) => {
  const prodVersion = await db(c.env.DB).select({ version: sql<string>`sqlite_version()` }).from(sql`sqlite_master`).get();
  const stagingVersion = await db(c.env.STAGING_DB).select({ version: sql<string>`sqlite_version()` }).from(sql`sqlite_master`).get();
  return c.json({ prod: prodVersion.version, staging: stagingVersion.version }, 200);
});
```

- **Best Practice**:
  - Use separate bindings for production and staging databases.
  - Run `bun run wrangler:types` after updating `wrangler.toml`.
  - Test migrations on staging before applying to production.

### D1 Backup and Restore
- **Backup Script** (`database/backup.ts`):
```ts
// database/backup.ts
import type { D1Database } from "@cloudflare/workers-types";

export async function backupDatabase(d1: D1Database, output: string) {
  try {
    const result = await d1.dump();
    // Note: In a real app, store the dump in Cloudflare R2 or another storage
    console.log(`Backup created: ${output}`);
    return result;
  } catch (err) {
    console.error("Backup failed:", err);
    throw err;
  }
}
```

- **Run Backup**:
```bash
bun run db:backup
```

- **Restore Script** (`database/restore.ts`):
```ts
// database/restore.ts
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

- **Best Practice**:
  - Store backups in Cloudflare R2 or another secure storage.
  - Test restore locally before applying to production.
  - Schedule backups in CI/CD using `wrangler d1 execute`.

### D1 Query Optimization
- **Analyze Query Performance**:
```ts
import { db, products } from "~/database";

app.get("/api/analyze", async (c) => {
  const result = await db(c.env.DB).select().from(products).where(eq(products.name, "Laptop")).explain();
  return c.json({ plan: result }, 200);
});
```

- **Using D1 Analytics Engine**:
```ts
import { db, products } from "~/database";

app.get("/api/stats", async (c) => {
  const stats = await db(c.env.DB)
    .select({ total: sql<number>`count(*)`, avgPrice: sql<number>`avg(price)` })
    .from(products)
    .get();
  return c.json({ stats }, 200);
});
```

- **Best Practice**:
  - Use Drizzle’s `explain()` to analyze query performance.
  - Add indexes for frequently queried columns (see `drizzle/` migrations).
  - Use aggregate functions (e.g., `count`, `avg`) for analytics.

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
  if (apiKey !== c.env.API_KEY) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
});
```

- **Best Practice**:
  - Store `CLOUDFLARE_API_TOKEN` in environment variables, not in code.
  - Restrict D1 access to specific Worker routes with API keys or JWT.
  - Use Cloudflare Access for additional security layers.

### D1 Monitoring and Debugging
- **Monitoring Query Performance**:
```ts
import { db, products } from "~/database";
import { eq } from "drizzle-orm";

app.get("/api/monitor", async (c) => {
  const start = Date.now();
  const result = await db(c.env.DB).select().from(products).limit(10).all();
  const duration = Date.now() - start;
  return c.json({ results: result, duration }, 200);
});
```

- **Debugging Errors**:
```ts
import { db, products } from "~/database";
import { eq } from "drizzle-orm";

app.get("/api/debug", async (c) => {
  try {
    // Attempt to query a nonexistent table to simulate an error
    const result = await db(c.env.DB).select().from(sql`nonexistent_table`).all();
    return c.json({ result }, 200);
  } catch (err) {
    return c.json({ error: err.message, stack: err.stack }, 500);
  }
});
```

- **Why Avoid Raw Queries**:
  - Raw queries (e.g., `c.env.DB.prepare("SELECT * FROM nonexistent_table")`) lack type safety, making it harder to catch schema errors at compile time.
  - Drizzle ORM provides typed queries that align with `database/schema.ts`, ensuring consistency and reducing runtime errors.
  - Use Drizzle even for debugging to maintain type safety and leverage schema validation.

- **Best Practice**:
  - Use Drizzle ORM for all queries, including debugging, to ensure type safety.
  - Log query durations in Workers to identify bottlenecks.
  - Use Cloudflare’s dashboard for D1 usage metrics.
  - Enable debug logging in development, disable in production.

---

## Type Safety & Bindings

### ✅ ALWAYS Define D1 Bindings:
```ts
type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();
```

- **Why**: Ensures type-safe access to D1 via `c.env.DB`.
- **How**: Define `D1Database` in `Bindings` type and use `@cloudflare/workers-types`.

### ❌ NEVER Hardcode Bindings:
```ts
// ❌ DON'T use untyped or hardcoded bindings:
app.get("/api/test", async (c) => {
  const db = c.env.MY_DB; // ❌ Incorrect binding name
  return c.json({ result: await db.prepare("SELECT 1").run() });
});
```

---

## Error Handling

### D1-Specific Errors:
```ts
import { db } from "~/database";

app.get("/api/health", async (c) => {
  try {
    const result = await db(c.env.DB).select({ version: sql<string>`sqlite_version()` }).from(sql`sqlite_master`).get();
    return c.json({ version: result.version }, 200);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Database connection failed" }, 500);
  }
});
```

- **Common Errors**: Handle connection limits, invalid queries, or missing bindings.
- **Standardized Responses**: Return JSON with `error` and status code.
- **Integration**: Map D1 errors to Hono or React Router responses.

---

## Testing with Vitest

### Testing D1 Bindings:
```ts
// workers/__tests__/health.test.ts
import { describe, it, expect } from "vitest";
import { miniflare } from "@cloudflare/vitest-pool-workers";

describe("D1 Health Check", () => {
  it("returns SQLite version", async () => {
    const mf = miniflare({ bindings: { DB: { databaseId: "mock-id" } } });
    const response = await mf.dispatchFetch("http://localhost/api/health");
    const data = await response.json();
    expect(data).toHaveProperty("version");
  });
});
```

- **Setup**: Use `@cloudflare/vitest-pool-workers` (0.8.52) to mock D1 bindings.
- **Run**: `bun run test` or `bun run coverage` to verify D1 integration.
- **Best Practice**: Mock `D1Database` for isolated tests.

---

## Performance Optimization

### Batching Queries:
```ts
import { db, products, orders } from "~/database";
import { eq } from "drizzle-orm";

app.get("/api/batch", async (c) => {
  const [productResult, orderResult] = await db(c.env.DB).transaction(async (tx) => {
    const products = await tx.select().from(products).where(eq(products.id, "1")).all();
    const orders = await tx.select().from(orders).where(eq(orders.productId, "1")).all();
    return [products, orders];
  });
  return c.json({ products: productResult, orders: orderResult }, 200);
});
```

- **Why**: Reduces round-trips to D1, improving performance.
- **How**: Use Drizzle transactions or `batch` for multiple queries.

### Indexing:
```sql
-- drizzle/0000_initial_migration.sql
CREATE INDEX name_idx ON products (name);
```

- **Why**: Improves query performance for common filters.
- **How**: Add indexes in migration files generated by Drizzle Kit.

---

## Anti-Patterns to Avoid

### ❌ Unbound D1 Access:
```ts
// ❌ DON'T access D1 without bindings:
const db = new D1Database("hardcoded-id"); // ❌
```

### ❌ Ignoring Connection Limits:
```ts
// ❌ DON'T run too many queries concurrently:
for (const id of ids) {
  await db(c.env.DB).select().from(products).where(eq(products.id, id)).get(); // ❌ May hit limits
}
```

---

## Essential Type Safety Rules

1. **ALWAYS** define `D1Database` in `Bindings` type.
2. **RUN `bun run wrangler:types`** after updating `wrangler.toml`.
3. **RUN `bun run typecheck`** to catch binding errors.
4. **USE** `@cloudflare/workers-types` for D1 types.
5. **ADD** `workers/**/*` to `tsconfig.json` include array.

---

## AI Assistant Guidelines

When working with Cloudflare D1 in NARA Boilerplate:
- **If you see TypeScript errors, ALWAYS suggest checking `wrangler.toml` and running `bun run wrangler:types`.**
- **NEVER suggest raw D1 queries** without Drizzle for complex operations; use Drizzle ORM for type safety.
- **After updating bindings, remind the user to run `bun run wrangler:types`.**
- **Ensure compatibility** with Hono APIs and Drizzle ORM.
- **Suggest batching or transactions** for multiple D1 queries to optimize performance.
- **Suggest backups** before applying migrations or rollbacks.
- **Monitor performance** using query durations and Cloudflare’s dashboard.