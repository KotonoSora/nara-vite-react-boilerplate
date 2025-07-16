import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";

import * as schema from "~/database/schema";
import { getStripe } from "~/lib/stripe";

type Bindings = {
  DB: D1Database;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", async (c) => {
  const body = await c.req.text();
  const signature = c.req.header("stripe-signature");

  if (!signature) {
    return c.json({ error: "Missing stripe signature" }, 400);
  }

  try {
    const stripe = getStripe(c.env.STRIPE_SECRET_KEY);
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      c.env.STRIPE_WEBHOOK_SECRET
    );

    const db = drizzle(c.env.DB, { schema });

    // Log the webhook event
    await db.insert(schema.webhookEvent).values({
      stripeEventId: event.id,
      eventType: event.type,
      eventData: JSON.stringify(event.data),
      processed: false,
    });

    // Process the event
    try {
      await processWebhookEvent(event, db);
      
      // Mark as processed
      await db
        .update(schema.webhookEvent)
        .set({ processed: true })
        .where(eq(schema.webhookEvent.stripeEventId, event.id));
    } catch (error) {
      // Log processing error
      await db
        .update(schema.webhookEvent)
        .set({ 
          processingError: error instanceof Error ? error.message : String(error)
        })
        .where(eq(schema.webhookEvent.stripeEventId, event.id));
      
      console.error("Webhook processing error:", error);
      return c.json({ error: "Webhook processing failed" }, 500);
    }

    return c.json({ received: true });
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return c.json({ error: "Invalid signature" }, 400);
  }
});

async function processWebhookEvent(
  event: any,
  db: DrizzleD1Database<typeof schema>
) {
  switch (event.type) {
    case "customer.created":
      await handleCustomerCreated(event.data.object, db);
      break;

    case "customer.updated":
      await handleCustomerUpdated(event.data.object, db);
      break;

    case "customer.subscription.created":
    case "customer.subscription.updated":
      await handleSubscriptionUpdated(event.data.object, db);
      break;

    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object, db);
      break;

    case "payment_intent.succeeded":
      await handlePaymentIntentSucceeded(event.data.object, db);
      break;

    case "payment_intent.payment_failed":
      await handlePaymentIntentFailed(event.data.object, db);
      break;

    case "invoice.payment_succeeded":
      await handleInvoicePaymentSucceeded(event.data.object, db);
      break;

    case "invoice.payment_failed":
      await handleInvoicePaymentFailed(event.data.object, db);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

async function handleCustomerCreated(
  customer: any,
  db: DrizzleD1Database<typeof schema>
) {
  await db.insert(schema.customer).values({
    stripeCustomerId: customer.id,
    email: customer.email,
    name: customer.name,
  });
}

async function handleCustomerUpdated(
  customer: any,
  db: DrizzleD1Database<typeof schema>
) {
  await db
    .update(schema.customer)
    .set({
      email: customer.email,
      name: customer.name,
      updatedAt: new Date(),
    })
    .where(eq(schema.customer.stripeCustomerId, customer.id));
}

async function handleSubscriptionUpdated(
  subscription: any,
  db: DrizzleD1Database<typeof schema>
) {
  // First ensure customer exists
  let existingCustomer = await db
    .select()
    .from(schema.customer)
    .where(eq(schema.customer.stripeCustomerId, subscription.customer))
    .get();

  if (!existingCustomer) {
    // Customer doesn't exist, this shouldn't happen but let's handle it
    return;
  }

  // Get the price/plan information
  const priceId = subscription.items.data[0]?.price?.id;
  const existingPlan = await db
    .select()
    .from(schema.plan)
    .where(eq(schema.plan.stripePriceId, priceId))
    .get();

  if (!existingPlan) {
    console.error(`Plan not found for price ID: ${priceId}`);
    return;
  }

  // Insert or update subscription
  const existingSubscription = await db
    .select()
    .from(schema.subscription)
    .where(eq(schema.subscription.stripeSubscriptionId, subscription.id))
    .get();

  const subscriptionData = {
    customerId: existingCustomer.id,
    productId: existingPlan.productId,
    planId: existingPlan.id,
    status: subscription.status,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
    trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    updatedAt: new Date(),
  };

  if (existingSubscription) {
    await db
      .update(schema.subscription)
      .set(subscriptionData)
      .where(eq(schema.subscription.stripeSubscriptionId, subscription.id));
  } else {
    await db.insert(schema.subscription).values({
      stripeSubscriptionId: subscription.id,
      ...subscriptionData,
    });
  }
}

async function handleSubscriptionDeleted(
  subscription: any,
  db: DrizzleD1Database<typeof schema>
) {
  await db
    .update(schema.subscription)
    .set({
      status: "canceled",
      canceledAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(schema.subscription.stripeSubscriptionId, subscription.id));
}

async function handlePaymentIntentSucceeded(
  paymentIntent: any,
  db: DrizzleD1Database<typeof schema>
) {
  // Handle one-time payments
  if (paymentIntent.metadata?.orderId) {
    await db
      .update(schema.order)
      .set({
        status: "succeeded",
        accessGranted: true,
        updatedAt: new Date(),
      })
      .where(eq(schema.order.stripePaymentIntentId, paymentIntent.id));
  }
}

async function handlePaymentIntentFailed(
  paymentIntent: any,
  db: DrizzleD1Database<typeof schema>
) {
  if (paymentIntent.metadata?.orderId) {
    await db
      .update(schema.order)
      .set({
        status: "failed",
        updatedAt: new Date(),
      })
      .where(eq(schema.order.stripePaymentIntentId, paymentIntent.id));
  }
}

async function handleInvoicePaymentSucceeded(
  invoice: any,
  db: DrizzleD1Database<typeof schema>
) {
  // Update subscription status if needed
  if (invoice.subscription) {
    await db
      .update(schema.subscription)
      .set({
        status: "active",
        updatedAt: new Date(),
      })
      .where(eq(schema.subscription.stripeSubscriptionId, invoice.subscription));
  }
}

async function handleInvoicePaymentFailed(
  invoice: any,
  db: DrizzleD1Database<typeof schema>
) {
  // Update subscription status to past_due
  if (invoice.subscription) {
    await db
      .update(schema.subscription)
      .set({
        status: "past_due",
        updatedAt: new Date(),
      })
      .where(eq(schema.subscription.stripeSubscriptionId, invoice.subscription));
  }
}

export default app;