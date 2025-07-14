---
applyTo: 'workers/**/*.ts'
---

# Hono.js Framework Instructions - Copilot Instructions Rules

This document outlines the rules and best practices for using **Hono.js** (version 4.8.4) in the `workers` directory of the NARA Boilerplate project. Hono is a lightweight, fast, and type-safe web framework for Cloudflare Workers, used to handle API routes and server-side logic. These guidelines ensure **type safety**, **performance**, and **developer ergonomics**, aligning with the project's motto: "quality over quantity."

---

## 🚨 CRITICAL: Type Safety Rules - NEVER MAKE THIS MISTAKE

**THE MOST IMPORTANT RULE: ALWAYS use TypeScript types with Hono to ensure type-safe request and response handling.**

```ts
// ✅ CORRECT - Use typed context and response:
import { Hono } from "hono";
const app = new Hono();
app.get("/api/products/:id", async (c) => {
  const id = c.req.param("id"); // Type-safe params
  const product = await db.getProduct(id);
  return c.json({ product }, 200); // Type-safe response
});

// ❌ NEVER use untyped or generic objects:
app.get("/api/products/:id", (c) => {
  // ❌ No type safety for params or response
  return c.json({ data: "something" });
});
```

**If you see TypeScript errors about missing types:**
1. **IMMEDIATELY run `bun run typecheck`** to verify types.
2. **NEVER bypass TypeScript** by using `any` or ignoring errors.
3. **Ensure `tsconfig.json` includes `workers/**/*`** to cover Hono files.

---

## Hono Setup & Workflow

- **Location**: All Hono API routes are defined in `workers/api/*.ts` and orchestrated in `workers/app.ts`.
- **Type Generation**: Use TypeScript with `@cloudflare/workers-types` for Cloudflare Workers compatibility.
- **Run `bun run typecheck`** after adding or modifying API routes to ensure type safety.
- **Dev Server**: The development server (`bun run dev`) automatically reloads changes in `workers/` via Vite and Cloudflare Workers integration.

---

## Critical Package Guidelines

### ✅ CORRECT Packages:
- `hono` (4.8.4) - Core framework for API routes.
- `@cloudflare/workers-types` - Type definitions for Cloudflare Workers bindings (e.g., D1, KV).
- `@hono/zod-validator` - For type-safe request validation with Zod.

### ❌ NEVER Use:
- `express`, `fastify`, or other Node.js frameworks - Not compatible with Cloudflare Workers.
- Older Hono versions (<4.8.4) - May lack type safety or Workers-specific features.
- Non-type-safe middleware or libraries - Always verify TypeScript compatibility.

---

## Essential Hono Architecture

### API Route Configuration (`workers/app.ts`)
```ts
import { Hono } from "hono";
import { products } from "./api/products";
import { cart } from "./api/cart";

const app = new Hono();
app.route("/api/products", products);
app.route("/api/cart", cart);

export default app;
```

- **Structure**: Group related endpoints in `workers/api/*.ts` and mount them in `workers/app.ts` using `app.route()`.
- **Type Safety**: Use Hono’s typed context (`c`) for all handlers.
- **Best Practice**: Keep `app.ts` minimal, delegating logic to individual API modules.

### API Route Module Pattern (`workers/api/products.ts`)
```ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "~/database";

const products = new Hono();

// Type-safe GET endpoint
products.get("/:id", async (c) => {
  const id = c.req.param("id");
  const product = await db.getProduct(id);
  if (!product) return c.json({ error: "Product not found" }, 404);
  return c.json({ product }, 200);
});

// Type-safe POST endpoint with Zod validation
const createSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
});
products.post("/", zValidator("json", createSchema), async (c) => {
  const data = c.req.valid("json");
  const product = await db.createProduct(data);
  return c.json({ product }, 201);
});

export default products;
```

- **Loader**: Use `c.req.param()`, `c.req.query()`, or `c.req.json()` for type-safe data access.
- **Validation**: Use `@hono/zod-validator` for request body and query validation.
- **Response**: Always return `c.json()` or `c.text()` with explicit status codes.
- **Database**: Integrate with Drizzle ORM (`~/database`) for type-safe queries.

### Environment Bindings (D1, KV, etc.)
```ts
import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
  KV: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/api/cache/:key", async (c) => {
  const key = c.req.param("key");
  const value = await c.env.KV.get(key);
  if (!value) return c.json({ error: "Key not found" }, 404);
  return c.json({ value }, 200);
});
```

- **Bindings**: Define Cloudflare bindings (e.g., `D1Database`, `KVNamespace`) in `Bindings` type and pass to `Hono<{ Bindings: Bindings }>`.
- **Access**: Use `c.env.DB` or `c.env.KV` for type-safe access to Cloudflare services.
- **Wrangler Config**: Ensure `wrangler.toml` includes bindings for D1, KV, etc.

---

## Type Safety & Validation

### ✅ ALWAYS Use Zod for Validation:
```ts
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const schema = z.object({
  id: z.string().uuid(),
  quantity: z.number().int().positive(),
});

app.post("/api/cart", zValidator("json", schema), async (c) => {
  const data = c.req.valid("json"); // Type-safe validated data
  return c.json({ success: true }, 200);
});
```

- **Why**: Ensures request data is type-safe and validated before processing.
- **How**: Use `zValidator` for `json`, `query`, or `form` validation.
- **Run `bun run typecheck`** to catch validation errors early.

### ✅ Type-Safe Database Integration:
```ts
import { db } from "~/database";

app.get("/api/products/:id", async (c) => {
  const id = c.req.param("id");
  const product = await db.select().from(products).where(eq(products.id, id)).get();
  return c.json({ product }, 200);
});
```

- **Why**: Drizzle ORM provides type-safe queries that align with Hono’s typed context.
- **How**: Import schema from `~/database/schema.ts` and use Drizzle’s query builder.

### ❌ NEVER Bypass Type Safety:
```ts
// ❌ DON'T use untyped responses:
app.get("/api/products", (c) => c.json({ data: "something" }));

// ❌ DON'T skip validation:
app.post("/api/cart", async (c) => {
  const data = await c.req.json(); // No type safety
  // ...
});
```

---

## Critical Imports & Patterns

### ✅ Correct Imports:
```ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "~/database";
import type { D1Database, KVNamespace } from "@cloudflare/workers-types";
```

### Middleware Usage:
```ts
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();
app.use("*", cors());
app.use("*", logger());
```

- **CORS**: Use `hono/cors` for cross-origin requests.
- **Logger**: Use `hono/logger` for debugging in development.
- **Custom Middleware**: Write type-safe middleware for authentication or rate-limiting.

---

## Error Handling

### API Error Responses:
```ts
app.get("/api/products/:id", async (c) => {
  const id = c.req.param("id");
  const product = await db.getProduct(id);
  if (!product) return c.json({ error: "Product not found" }, 404);
  return c.json({ product }, 200);
});

// Centralized error handling
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal Server Error" }, 500);
});
```

- **Standardized Errors**: Always return JSON with an `error` field and appropriate status code.
- **Global Error Handler**: Use `app.onError` for uncaught errors.
- **Type Safety**: Define error schemas with Zod if needed.

---

## Integration with React Router

Hono APIs are designed to work seamlessly with React Router v7’s `loader` and `action` functions in `app/routes/*.tsx`.

### Example: Fetching from Hono API in a Loader
```ts
// app/routes/products.$id.tsx
import type { Route } from "./+types/products.$id";

export async function loader({ params }: Route.LoaderArgs) {
  const response = await fetch(`/api/products/${params.id}`);
  const data = await response.json();
  if (!response.ok) throw data({ error: data.error }, response.status);
  return { product: data.product };
}
```

- **Consistency**: Ensure API responses match the expected structure in `loader` and `action`.
- **Type Safety**: Use shared types (e.g., in `~/types`) for API response schemas.

---

## File Organization & Naming

### ✅ File Structure:
- `workers/app.ts`: Main entry point for Hono app.
- `workers/api/*.ts`: Individual API route modules (e.g., `products.ts`, `cart.ts`).
- **Naming**: Use kebab-case for file names (e.g., `products.ts`, `order-history.ts`).
- **Organization**: Group related endpoints in a single file (e.g., all product-related endpoints in `products.ts`).

### Best Practices:
- Keep API logic modular and reusable.
- Use descriptive names that reflect the endpoint’s purpose.
- Avoid nesting API files deeply; prefer flat structure in `workers/api/`.

---

## Performance Optimization

### Caching with Cloudflare KV:
```ts
app.get("/api/products/:id", async (c) => {
  const id = c.req.param("id");
  const cacheKey = `product:${id}`;
  const cached = await c.env.KV.get(cacheKey);
  if (cached) return c.json(JSON.parse(cached), 200);

  const product = await db.getProduct(id);
  await c.env.KV.put(cacheKey, JSON.stringify({ product }), { expirationTtl: 3600 });
  return c.json({ product }, 200);
});
```

- **Why**: Reduces database queries and improves response time.
- **How**: Use `c.env.KV` for caching, with reasonable TTLs.

### Minimize Payload Size:
- Return minimal data in `c.json()` responses.
- Use pagination for list endpoints (e.g., `/api/products?limit=10&offset=0`).

---

## Anti-Patterns to Avoid

### ❌ Non-Type-Safe Handlers:
```ts
// DON'T use untyped context or responses:
app.get("/api/products", (c) => {
  return c.json({ data: "something" });
});
```

### ❌ Direct Database Access Without Validation:
```ts
// DON'T skip validation for POST requests:
app.post("/api/products", async (c) => {
  const data = await c.req.json(); // No validation
  await db.createProduct(data); // Unsafe
});
```

### ❌ Hardcoding URLs:
```ts
// DON'T hardcode API URLs:
const response = await fetch("/api/products/123"); // ❌
// Use shared constants or environment variables instead.
```

---

## Essential Type Safety Rules

1. **ALWAYS** use Hono’s typed context (`c`) and explicit response types.
2. **RUN `bun run typecheck`** when adding or modifying API routes.
3. **USE `@hono/zod-validator`** for all request inputs (body, query, params).
4. **INTEGRATE** with Drizzle ORM for type-safe database queries.
5. **DEFINE** Cloudflare bindings in `Bindings` type for type-safe access.
6. **ADD** `workers/**/*` to `tsconfig.json` include array.

---

## AI Assistant Guidelines

When working with Hono.js in NARA Boilerplate:
- **If you see TypeScript errors, ALWAYS suggest running `bun run typecheck` first.**
- **NEVER suggest bypassing TypeScript** with `any` or untyped handlers.
- **After creating new API routes, remind the user to run `bun run typecheck`.**
- **Assume types need to be verified if errors occur; don’t assume the dev server is running.**
- **Suggest Zod validation** for all non-trivial request inputs.
- **Ensure compatibility** with React Router v7’s `loader` and `action` for seamless integration.