import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";

import * as schema from "~/database/schema";
import { seedDemoProducts } from "~/lib/seed-demo-data";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// Get all products with their plans
app.get("/products", async (c) => {
  try {
    const db = drizzle(c.env.DB, { schema });

    const products = await db
      .select()
      .from(schema.product)
      .where(eq(schema.product.isActive, true));

    const productsWithPlans = await Promise.all(
      products.map(async (product) => {
        const plans = await db
          .select()
          .from(schema.plan)
          .where(eq(schema.plan.productId, product.id))
          .orderBy(schema.plan.sortOrder);

        return {
          ...product,
          plans: plans.map(plan => ({
            ...plan,
            features: plan.features ? JSON.parse(plan.features) : [],
            limits: plan.limits ? JSON.parse(plan.limits) : {},
          })),
          features: product.features ? JSON.parse(product.features) : [],
        };
      })
    );

    return c.json({ products: productsWithPlans });
  } catch (error) {
    console.error("Error fetching products:", error);
    return c.json({ error: "Failed to fetch products" }, 500);
  }
});

// Get a specific product by ID
app.get("/products/:id", async (c) => {
  try {
    const productId = parseInt(c.req.param("id"));
    const db = drizzle(c.env.DB, { schema });

    const product = await db
      .select()
      .from(schema.product)
      .where(eq(schema.product.id, productId))
      .get();

    if (!product) {
      return c.json({ error: "Product not found" }, 404);
    }

    const plans = await db
      .select()
      .from(schema.plan)
      .where(eq(schema.plan.productId, product.id))
      .orderBy(schema.plan.sortOrder);

    const productWithPlans = {
      ...product,
      plans: plans.map(plan => ({
        ...plan,
        features: plan.features ? JSON.parse(plan.features) : [],
        limits: plan.limits ? JSON.parse(plan.limits) : {},
      })),
      features: product.features ? JSON.parse(product.features) : [],
    };

    return c.json({ product: productWithPlans });
  } catch (error) {
    console.error("Error fetching product:", error);
    return c.json({ error: "Failed to fetch product" }, 500);
  }
});

// Seed demo data (for development/demo purposes)
app.post("/seed-demo", async (c) => {
  try {
    const db = drizzle(c.env.DB, { schema });
    
    // Check if products already exist
    const existingProducts = await db.select().from(schema.product);
    
    if (existingProducts.length > 0) {
      return c.json({ message: "Demo data already exists" });
    }

    await seedDemoProducts(db);
    
    return c.json({ message: "Demo data seeded successfully" });
  } catch (error) {
    console.error("Error seeding demo data:", error);
    return c.json({ error: "Failed to seed demo data" }, 500);
  }
});

export default app;