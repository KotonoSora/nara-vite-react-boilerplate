import { drizzle } from "drizzle-orm/d1";
import * as schema from "~/database/schema";

export async function seedDemoProducts(db: any) {
  try {
    // Insert demo products
    const [saasProduct] = await db
      .insert(schema.product)
      .values({
        name: "NARA SaaS Platform",
        description: "Complete SaaS solution with user management, analytics, and more",
        type: "saas",
        category: "Software",
        features: JSON.stringify([
          "User Authentication",
          "Real-time Analytics", 
          "API Access",
          "Custom Integrations",
          "24/7 Support"
        ]),
        isActive: true,
      })
      .returning();

    const [courseProduct] = await db
      .insert(schema.product)
      .values({
        name: "React Mastery Course",
        description: "Comprehensive React.js course from beginner to advanced",
        type: "course",
        category: "Education",
        features: JSON.stringify([
          "50+ Video Lessons",
          "Downloadable Resources",
          "Code Examples",
          "Certificate of Completion",
          "Lifetime Access"
        ]),
        isActive: true,
      })
      .returning();

    const [digitalProduct] = await db
      .insert(schema.product)
      .values({
        name: "Premium UI Kit",
        description: "Professional React component library with 100+ components",
        type: "digital_download",
        category: "Design",
        features: JSON.stringify([
          "100+ React Components",
          "TypeScript Support",
          "Figma Files",
          "Documentation",
          "Source Code"
        ]),
        isActive: true,
      })
      .returning();

    // Insert pricing plans for SaaS product
    await db.insert(schema.plan).values([
      {
        productId: saasProduct.id,
        name: "Starter",
        type: "recurring",
        interval: "month",
        amount: 1900, // $19.00
        currency: "usd",
        trialPeriodDays: 14,
        features: JSON.stringify([
          "Up to 5 users",
          "10GB storage",
          "Basic analytics",
          "Email support"
        ]),
        limits: JSON.stringify({
          users: 5,
          storage: "10GB",
          apiCalls: 1000
        }),
        sortOrder: 1,
      },
      {
        productId: saasProduct.id,
        name: "Professional",
        type: "recurring",
        interval: "month",
        amount: 4900, // $49.00
        currency: "usd",
        trialPeriodDays: 14,
        features: JSON.stringify([
          "Up to 25 users",
          "100GB storage",
          "Advanced analytics",
          "Priority support",
          "API access"
        ]),
        limits: JSON.stringify({
          users: 25,
          storage: "100GB",
          apiCalls: 10000
        }),
        sortOrder: 2,
      },
      {
        productId: saasProduct.id,
        name: "Enterprise",
        type: "recurring",
        interval: "month",
        amount: 9900, // $99.00
        currency: "usd",
        trialPeriodDays: 30,
        features: JSON.stringify([
          "Unlimited users",
          "1TB storage",
          "Real-time analytics",
          "24/7 phone support",
          "Custom integrations",
          "Dedicated account manager"
        ]),
        limits: JSON.stringify({
          users: "unlimited",
          storage: "1TB",
          apiCalls: "unlimited"
        }),
        sortOrder: 3,
      }
    ]);

    // Insert yearly plans with discount
    await db.insert(schema.plan).values([
      {
        productId: saasProduct.id,
        name: "Starter (Yearly)",
        type: "recurring",
        interval: "year",
        amount: 19000, // $190.00 (save $38/year)
        currency: "usd",
        trialPeriodDays: 14,
        features: JSON.stringify([
          "Up to 5 users",
          "10GB storage",
          "Basic analytics",
          "Email support",
          "2 months free!"
        ]),
        limits: JSON.stringify({
          users: 5,
          storage: "10GB",
          apiCalls: 1000
        }),
        sortOrder: 4,
      },
      {
        productId: saasProduct.id,
        name: "Professional (Yearly)",
        type: "recurring",
        interval: "year",
        amount: 49000, // $490.00 (save $98/year)
        currency: "usd",
        trialPeriodDays: 14,
        features: JSON.stringify([
          "Up to 25 users",
          "100GB storage",
          "Advanced analytics",
          "Priority support",
          "API access",
          "2 months free!"
        ]),
        limits: JSON.stringify({
          users: 25,
          storage: "100GB",
          apiCalls: 10000
        }),
        sortOrder: 5,
      }
    ]);

    // Insert one-time purchase plans
    await db.insert(schema.plan).values([
      {
        productId: courseProduct.id,
        name: "Complete Course",
        type: "one_time",
        amount: 9900, // $99.00
        currency: "usd",
        features: JSON.stringify([
          "Lifetime access",
          "All course materials",
          "Future updates included"
        ]),
        sortOrder: 1,
      },
      {
        productId: digitalProduct.id,
        name: "UI Kit License",
        type: "one_time",
        amount: 4900, // $49.00
        currency: "usd",
        features: JSON.stringify([
          "Commercial license",
          "Source files",
          "1 year of updates"
        ]),
        sortOrder: 1,
      }
    ]);

    console.log("Demo products and plans created successfully!");
  } catch (error) {
    console.error("Error seeding demo products:", error);
    throw error;
  }
}