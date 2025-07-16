import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { eq, and } from "drizzle-orm";

import * as schema from "~/database/schema";
import { getStripe } from "~/lib/stripe";

type Bindings = {
  DB: D1Database;
  STRIPE_SECRET_KEY: string;
  STRIPE_PUBLISHABLE_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Get Stripe publishable key
app.get("/config", async (c) => {
  return c.json({
    publishableKey: c.env.STRIPE_PUBLISHABLE_KEY,
  });
});

// Create checkout session for subscription
app.post("/create-checkout-session", async (c) => {
  try {
    const { planId, customerId, successUrl, cancelUrl } = await c.req.json();
    
    const db = drizzle(c.env.DB, { schema });
    const stripe = getStripe(c.env.STRIPE_SECRET_KEY);

    // Get plan details
    const plan = await db
      .select()
      .from(schema.plan)
      .where(eq(schema.plan.id, planId))
      .get();

    if (!plan) {
      return c.json({ error: "Plan not found" }, 404);
    }

    // Get product details
    const product = await db
      .select()
      .from(schema.product)
      .where(eq(schema.product.id, plan.productId))
      .get();

    if (!product) {
      return c.json({ error: "Product not found" }, 404);
    }

    let sessionConfig: any = {
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [
        {
          price: plan.stripePriceId!,
          quantity: 1,
        },
      ],
    };

    // Handle different plan types
    if (plan.type === "recurring") {
      sessionConfig.mode = "subscription";
      if (plan.trialPeriodDays) {
        sessionConfig.subscription_data = {
          trial_period_days: plan.trialPeriodDays,
        };
      }
    } else {
      sessionConfig.mode = "payment";
      sessionConfig.payment_intent_data = {
        metadata: {
          planId: plan.id.toString(),
          productId: product.id.toString(),
        },
      };
    }

    // Add customer if provided
    if (customerId) {
      const customer = await db
        .select()
        .from(schema.customer)
        .where(eq(schema.customer.id, customerId))
        .get();
      
      if (customer?.stripeCustomerId) {
        sessionConfig.customer = customer.stripeCustomerId;
      }
    } else {
      sessionConfig.customer_creation = "always";
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return c.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return c.json({ error: "Failed to create checkout session" }, 500);
  }
});

// Create one-time purchase order
app.post("/create-order", async (c) => {
  try {
    const { planId, customerEmail, successUrl, cancelUrl } = await c.req.json();
    
    const db = drizzle(c.env.DB, { schema });
    const stripe = getStripe(c.env.STRIPE_SECRET_KEY);

    // Get plan details
    const plan = await db
      .select()
      .from(schema.plan)
      .where(eq(schema.plan.id, planId))
      .get();

    if (!plan || plan.type !== "one_time") {
      return c.json({ error: "Invalid plan for one-time purchase" }, 400);
    }

    // Get or create customer
    let customer = await db
      .select()
      .from(schema.customer)
      .where(eq(schema.customer.email, customerEmail))
      .get();

    if (!customer) {
      const stripeCustomer = await stripe.customers.create({
        email: customerEmail,
      });

      const [newCustomer] = await db
        .insert(schema.customer)
        .values({
          stripeCustomerId: stripeCustomer.id,
          email: customerEmail,
        })
        .returning();
      
      customer = newCustomer;
    }

    if (!customer.stripeCustomerId) {
      return c.json({ error: "Customer missing Stripe ID" }, 500);
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: plan.amount,
      currency: plan.currency,
      customer: customer.stripeCustomerId,
      metadata: {
        planId: plan.id.toString(),
        productId: plan.productId.toString(),
        customerId: customer.id.toString(),
      },
    });

    // Create order record
    await db.insert(schema.order).values({
      stripePaymentIntentId: paymentIntent.id,
      customerId: customer.id,
      productId: plan.productId,
      planId: plan.id,
      status: "pending",
      amount: plan.amount,
      currency: plan.currency,
    });

    // Create checkout session for the payment intent
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: plan.stripePriceId!,
          quantity: 1,
        },
      ],
      customer: customer.stripeCustomerId,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return c.json({ url: session.url });
  } catch (error) {
    console.error("Error creating order:", error);
    return c.json({ error: "Failed to create order" }, 500);
  }
});

// Get customer subscriptions
app.get("/subscriptions/:customerId", async (c) => {
  try {
    const customerId = parseInt(c.req.param("customerId"));
    const db = drizzle(c.env.DB, { schema });

    const subscriptions = await db
      .select({
        subscription: schema.subscription,
        product: schema.product,
        plan: schema.plan,
      })
      .from(schema.subscription)
      .leftJoin(schema.product, eq(schema.subscription.productId, schema.product.id))
      .leftJoin(schema.plan, eq(schema.subscription.planId, schema.plan.id))
      .where(eq(schema.subscription.customerId, customerId));

    return c.json({ subscriptions });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return c.json({ error: "Failed to fetch subscriptions" }, 500);
  }
});

// Cancel subscription
app.post("/subscriptions/:subscriptionId/cancel", async (c) => {
  try {
    const subscriptionId = parseInt(c.req.param("subscriptionId"));
    const { cancelAtPeriodEnd = true } = await c.req.json();
    
    const db = drizzle(c.env.DB, { schema });
    const stripe = getStripe(c.env.STRIPE_SECRET_KEY);

    const subscription = await db
      .select()
      .from(schema.subscription)
      .where(eq(schema.subscription.id, subscriptionId))
      .get();

    if (!subscription) {
      return c.json({ error: "Subscription not found" }, 404);
    }

    // Cancel in Stripe
    const updatedSubscription = await stripe.subscriptions.update(
      subscription.stripeSubscriptionId!,
      {
        cancel_at_period_end: cancelAtPeriodEnd,
      }
    );

    // Update local record
    await db
      .update(schema.subscription)
      .set({
        cancelAtPeriodEnd: cancelAtPeriodEnd,
        updatedAt: new Date(),
      })
      .where(eq(schema.subscription.id, subscriptionId));

    return c.json({ success: true });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return c.json({ error: "Failed to cancel subscription" }, 500);
  }
});

// Get customer orders
app.get("/orders/:customerId", async (c) => {
  try {
    const customerId = parseInt(c.req.param("customerId"));
    const db = drizzle(c.env.DB, { schema });

    const orders = await db
      .select({
        order: schema.order,
        product: schema.product,
        plan: schema.plan,
      })
      .from(schema.order)
      .leftJoin(schema.product, eq(schema.order.productId, schema.product.id))
      .leftJoin(schema.plan, eq(schema.order.planId, schema.plan.id))
      .where(eq(schema.order.customerId, customerId));

    return c.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return c.json({ error: "Failed to fetch orders" }, 500);
  }
});

// Get customer by email
app.get("/customers/by-email/:email", async (c) => {
  try {
    const email = c.req.param("email");
    const db = drizzle(c.env.DB, { schema });

    const customer = await db
      .select()
      .from(schema.customer)
      .where(eq(schema.customer.email, email))
      .get();

    if (!customer) {
      return c.json({ error: "Customer not found" }, 404);
    }

    return c.json({ customer });
  } catch (error) {
    console.error("Error fetching customer:", error);
    return c.json({ error: "Failed to fetch customer" }, 500);
  }
});

export default app;