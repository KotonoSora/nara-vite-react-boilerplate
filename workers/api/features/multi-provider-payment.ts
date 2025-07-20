/**
 * Multi-Provider Payment API
 * 
 * This API provides endpoints for the multi-provider payment system,
 * allowing clients to interact with multiple payment providers through a unified interface.
 */

import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { eq, and } from "drizzle-orm";

import * as schema from "~/database/schema";
import { 
  paymentService, 
  providerFactory, 
  createProviderConfig,
  type PaymentProviderType,
  type ProviderConfig 
} from "~/lib/payments";

/**
 * Safely parse a numeric parameter, returning null if invalid
 */
function safeParseInt(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
}

type Bindings = {
  DB: D1Database;
  
  // Stripe configuration
  STRIPE_SECRET_KEY: string;
  STRIPE_PUBLISHABLE_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  
  // PayPal configuration
  PAYPAL_CLIENT_ID: string;
  PAYPAL_CLIENT_SECRET: string;
  PAYPAL_WEBHOOK_ID: string;
  
  // ZaloPay configuration
  ZALOPAY_APP_ID: string;
  ZALOPAY_KEY1: string;
  ZALOPAY_KEY2: string;
  
  // Square configuration (future)
  SQUARE_ACCESS_TOKEN: string;
  SQUARE_APPLICATION_ID: string;
  SQUARE_WEBHOOK_SECRET: string;
  
  // Environment
  ENVIRONMENT: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Initialize payment providers middleware
app.use("*", async (c, next) => {
  // Initialize providers based on environment variables
  const configs: ProviderConfig[] = [];
  
  // Add Stripe if configured
  if (c.env.STRIPE_SECRET_KEY && c.env.STRIPE_PUBLISHABLE_KEY) {
    configs.push(createProviderConfig('stripe', {
      apiKey: c.env.STRIPE_SECRET_KEY,
      publishableKey: c.env.STRIPE_PUBLISHABLE_KEY,
      webhookSecret: c.env.STRIPE_WEBHOOK_SECRET,
      environment: c.env.ENVIRONMENT === 'production' ? 'production' : 'sandbox'
    }));
  }
  
  // Add PayPal if configured
  if (c.env.PAYPAL_CLIENT_ID && c.env.PAYPAL_CLIENT_SECRET) {
    configs.push(createProviderConfig('paypal', {
      apiKey: c.env.PAYPAL_CLIENT_ID,
      publishableKey: c.env.PAYPAL_CLIENT_ID,
      webhookSecret: c.env.PAYPAL_WEBHOOK_ID,
      environment: c.env.ENVIRONMENT === 'production' ? 'production' : 'sandbox',
      additionalConfig: {
        clientSecret: c.env.PAYPAL_CLIENT_SECRET
      }
    }));
  }
  
  // Add ZaloPay if configured
  if (c.env.ZALOPAY_APP_ID && c.env.ZALOPAY_KEY1 && c.env.ZALOPAY_KEY2) {
    configs.push(createProviderConfig('zalopay', {
      apiKey: c.env.ZALOPAY_APP_ID,
      publishableKey: c.env.ZALOPAY_APP_ID, // ZaloPay uses App ID as public key
      environment: c.env.ENVIRONMENT === 'production' ? 'production' : 'sandbox',
      additionalConfig: {
        key1: c.env.ZALOPAY_KEY1,
        key2: c.env.ZALOPAY_KEY2
      }
    }));
  }
  
  // Add Square if configured (future implementation)
  if (c.env.SQUARE_ACCESS_TOKEN && c.env.SQUARE_APPLICATION_ID) {
    configs.push(createProviderConfig('square', {
      apiKey: c.env.SQUARE_ACCESS_TOKEN,
      publishableKey: c.env.SQUARE_APPLICATION_ID,
      webhookSecret: c.env.SQUARE_WEBHOOK_SECRET,
      environment: c.env.ENVIRONMENT === 'production' ? 'production' : 'sandbox'
    }));
  }
  
  // Initialize providers if not already done
  if (configs.length > 0 && providerFactory.getAllProviders().length === 0) {
    await paymentService.initialize(configs);
  }
  
  await next();
});

// Get available payment providers and their configurations
app.get("/providers", async (c) => {
  try {
    const providers = paymentService.getAvailableProviders();
    const clientConfigs = paymentService.getClientConfigurations();
    
    return c.json({
      providers: providers.map(p => ({
        type: p.type,
        capabilities: p.capabilities,
        isConfigured: p.isConfigured
      })),
      clientConfigs
    });
  } catch (error) {
    console.error("Error getting providers:", error);
    return c.json({ error: "Failed to get providers" }, 500);
  }
});

// Create checkout session with provider selection
app.post("/checkout-session", async (c) => {
  try {
    const { 
      planId, 
      customerId, 
      customerEmail,
      successUrl, 
      cancelUrl, 
      provider,
      trialPeriodDays,
      metadata 
    } = await c.req.json();
    
    if (!planId || !successUrl || !cancelUrl) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    
    const result = await paymentService.createCheckoutSession({
      planId,
      customerId,
      customerEmail,
      successUrl,
      cancelUrl,
      trialPeriodDays,
      metadata
    }, provider as PaymentProviderType);

    if (!result.success) {
      return c.json({ error: result.error?.message || "Failed to create checkout session" }, 500);
    }

    return c.json({
      url: result.data?.url,
      sessionId: result.data?.id,
      provider: result.data?.provider
    });

  } catch (error) {
    console.error("Error creating checkout session:", error);
    return c.json({ error: "Failed to create checkout session" }, 500);
  }
});

// Create subscription with provider selection
app.post("/subscriptions", async (c) => {
  try {
    const { 
      customerId,
      planId,
      provider,
      trialPeriodDays,
      metadata
    } = await c.req.json();
    
    if (!customerId || !planId) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    
    const result = await paymentService.createSubscription(
      customerId,
      planId,
      { trialPeriodDays, metadata },
      provider as PaymentProviderType
    );

    if (!result.success) {
      return c.json({ error: result.error?.message || "Failed to create subscription" }, 500);
    }

    return c.json({
      subscription: result.data,
      provider: result.data?.provider
    });

  } catch (error) {
    console.error("Error creating subscription:", error);
    return c.json({ error: "Failed to create subscription" }, 500);
  }
});

// Get subscription details with provider information
app.get("/subscriptions/:id", async (c) => {
  try {
    const subscriptionId = c.req.param("id");
    const db = drizzle(c.env.DB, { schema });
    
    // Get subscription from database with provider information
    const subscription = await db
      .select({
        subscription: schema.subscription,
        product: schema.product,
        plan: schema.plan,
      })
      .from(schema.subscription)
      .leftJoin(schema.product, eq(schema.subscription.productId, schema.product.id))
      .leftJoin(schema.plan, eq(schema.subscription.planId, schema.plan.id))
      .where(eq(schema.subscription.id, parseInt(subscriptionId)))
      .get();

    if (!subscription) {
      return c.json({ error: "Subscription not found" }, 404);
    }

    // Get provider-specific details if needed
    const provider = providerFactory.getProvider(
      subscription.subscription.provider as PaymentProviderType,
      c.env.ENVIRONMENT === 'production' ? 'production' : 'sandbox'
    );

    let providerDetails = null;
    if (provider && subscription.subscription.providerSubscriptionId) {
      const providerResult = await provider.getSubscription(subscription.subscription.providerSubscriptionId);
      if (providerResult.success) {
        providerDetails = providerResult.data;
      }
    }

    return c.json({
      subscription: subscription.subscription,
      product: subscription.product,
      plan: subscription.plan,
      provider: subscription.subscription.provider,
      providerDetails
    });

  } catch (error) {
    console.error("Error getting subscription:", error);
    return c.json({ error: "Failed to get subscription" }, 500);
  }
});

// Cancel subscription across providers
app.post("/subscriptions/:id/cancel", async (c) => {
  try {
    const subscriptionId = safeParseInt(c.req.param("id"));
    if (!subscriptionId) {
      return c.json({ error: "Invalid subscription ID" }, 400);
    }
    
    const { cancelAtPeriodEnd = true, reason } = await c.req.json();
    
    const db = drizzle(c.env.DB, { schema });
    
    // Get subscription from database
    const subscription = await db
      .select()
      .from(schema.subscription)
      .where(eq(schema.subscription.id, subscriptionId))
      .get();

    if (!subscription) {
      return c.json({ error: "Subscription not found" }, 404);
    }

    // Get provider and cancel subscription
    const provider = providerFactory.getProvider(
      subscription.provider as PaymentProviderType,
      c.env.ENVIRONMENT === 'production' ? 'production' : 'sandbox'
    );

    if (!provider) {
      return c.json({ error: "Provider not configured" }, 500);
    }

    const result = await provider.cancelSubscription(
      subscription.providerSubscriptionId!,
      { cancelAtPeriodEnd, reason }
    );

    if (!result.success) {
      return c.json({ error: result.error?.message || "Failed to cancel subscription" }, 500);
    }

    // Update local record
    await db
      .update(schema.subscription)
      .set({
        cancelAtPeriodEnd: cancelAtPeriodEnd,
        canceledAt: cancelAtPeriodEnd ? undefined : new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.subscription.id, subscriptionId));

    return c.json({ 
      success: true,
      subscription: result.data,
      provider: subscription.provider
    });

  } catch (error) {
    console.error("Error canceling subscription:", error);
    return c.json({ error: "Failed to cancel subscription" }, 500);
  }
});

// Generic webhook handler for all providers
app.post("/webhooks/:provider", async (c) => {
  try {
    const provider = c.req.param("provider") as PaymentProviderType;
    const payload = await c.req.text();
    const signature = c.req.header("stripe-signature") || 
                     c.req.header("paypal-transmission-sig") ||
                     c.req.header("square-signature") || "";
    
    if (!signature) {
      return c.json({ error: "Missing signature" }, 400);
    }

    const result = await paymentService.processWebhook(
      provider,
      payload,
      signature,
      c.env.ENVIRONMENT === 'production' ? 'production' : 'sandbox'
    );

    if (!result.success) {
      console.error(`Webhook processing failed for ${provider}:`, result.error);
      return c.json({ error: "Webhook processing failed" }, 400);
    }

    // Log webhook event to database
    const db = drizzle(c.env.DB, { schema });
    await db.insert(schema.webhookEvent).values({
      provider: provider,
      providerEventId: result.data?.id || 'unknown',
      eventType: result.data?.eventType || 'unknown',
      processed: true,
      eventData: payload,
    });

    return c.json({ success: true, processed: result.data?.processed });

  } catch (error) {
    console.error("Webhook error:", error);
    return c.json({ error: "Webhook processing failed" }, 500);
  }
});

// Get provider-specific client configuration
app.get("/config/:provider", async (c) => {
  try {
    const providerType = c.req.param("provider") as PaymentProviderType;
    const provider = providerFactory.getProvider(
      providerType,
      c.env.ENVIRONMENT === 'production' ? 'production' : 'sandbox'
    );
    
    if (!provider) {
      return c.json({ error: "Provider not configured" }, 404);
    }
    
    return c.json(provider.getClientConfig());
    
  } catch (error) {
    console.error(`Error getting config for ${c.req.param("provider")}:`, error);
    return c.json({ error: "Failed to get provider configuration" }, 500);
  }
});

// Provider validation endpoint
app.get("/validate", async (c) => {
  try {
    const validation = await paymentService.validateProviders();
    return c.json(validation);
  } catch (error) {
    console.error("Error validating providers:", error);
    return c.json({ error: "Failed to validate providers" }, 500);
  }
});

// Provider recommendation endpoint
app.post("/recommend", async (c) => {
  try {
    const requirements = await c.req.json();
    
    const providers = paymentService.getAvailableProviders();
    const recommendations = providers
      .filter(p => p.isConfigured)
      .map(provider => {
        const { capabilities } = provider;
        let score = 0;
        
        if (requirements.needsSubscriptions && capabilities.supportsSubscriptions) score += 10;
        if (requirements.needsTrials && capabilities.supportsTrials) score += 5;
        if (requirements.needsRefunds && capabilities.supportsRefunds) score += 5;
        if (requirements.needsUsageBased && capabilities.supportsUsageBased) score += 5;
        
        if (requirements.primaryCurrency && capabilities.supportedCurrencies.includes(requirements.primaryCurrency.toLowerCase())) {
          score += 3;
        }
        
        if (requirements.primaryCountry && capabilities.supportedCountries.includes(requirements.primaryCountry.toUpperCase())) {
          score += 3;
        }
        
        return { ...provider, score };
      })
      .sort((a, b) => b.score - a.score);
    
    return c.json({
      recommendations: recommendations.map(({ score, ...provider }) => ({
        ...provider,
        recommendationScore: score
      }))
    });
    
  } catch (error) {
    console.error("Error getting provider recommendations:", error);
    return c.json({ error: "Failed to get recommendations" }, 500);
  }
});

export default app;