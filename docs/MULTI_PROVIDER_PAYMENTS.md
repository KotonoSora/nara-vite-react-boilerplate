# Multi-Provider Payment System

The NARA boilerplate now supports **multiple payment providers** simultaneously, allowing you to offer flexible payment options to your customers while maintaining a unified development experience.

## 🚀 Overview

This system provides:
- **Unified API** across different payment providers
- **Automatic provider selection** based on customer preferences
- **Provider recommendations** based on business requirements
- **Backward compatibility** with existing Stripe implementations
- **Type-safe** implementation with comprehensive TypeScript support

## 📋 Supported Providers

| Provider | Status | Subscriptions | One-time | Refunds | Trials | Usage-based |
|----------|--------|---------------|----------|---------|--------|-------------|
| **Stripe** | ✅ Full | ✅ | ✅ | ✅ | ✅ | ✅ |
| **PayPal** | 🚧 Demo | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Square** | 📋 Planned | ✅ | ✅ | ✅ | ✅ | ❌ |

## 🏗️ Architecture

### Core Components

1. **Payment Provider Interface** (`app/lib/payments/provider.ts`)
   - Abstract base class defining common operations
   - Consistent API across all providers

2. **Provider Implementations** (`app/lib/payments/providers/`)
   - `StripeProvider` - Full Stripe integration
   - `PayPalProvider` - PayPal implementation
   - `SquareProvider` - Planned for future

3. **Provider Factory** (`app/lib/payments/factory.ts`)
   - Manages provider registration and lifecycle
   - Provider selection and recommendation logic

4. **Multi-Provider Service** (`app/lib/payments/index.ts`)
   - High-level service interface
   - Automatic provider routing

### Database Schema

The system extends the existing payment tables to support multiple providers:

```sql
-- Products now support multiple providers
ALTER TABLE products ADD COLUMN provider_product_ids TEXT; -- {"stripe": "prod_123", "paypal": "PROD-456"}
ALTER TABLE products ADD COLUMN supported_providers TEXT; -- ["stripe", "paypal"]
ALTER TABLE products ADD COLUMN default_provider TEXT;

-- Similar updates for plans, customers, subscriptions, orders, and webhook_events
-- New provider_configs table for managing provider settings
```

## ⚙️ Configuration

### Environment Variables

Configure multiple providers using environment variables:

```bash
# Stripe (existing)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_WEBHOOK_ID=your_webhook_id

# Square (future)
SQUARE_ACCESS_TOKEN=your_square_token
SQUARE_APPLICATION_ID=your_app_id
SQUARE_WEBHOOK_SECRET=your_webhook_secret

# Environment
ENVIRONMENT=sandbox # or production
```

### Provider Initialization

Providers are automatically initialized based on available environment variables:

```typescript
import { paymentService, createProviderConfig } from '~/lib/payments';

// Providers are auto-initialized in the API middleware
// Manual initialization example:
await paymentService.initialize([
  createProviderConfig('stripe', {
    apiKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    environment: 'sandbox'
  }),
  createProviderConfig('paypal', {
    apiKey: process.env.PAYPAL_CLIENT_ID,
    webhookSecret: process.env.PAYPAL_WEBHOOK_ID,
    environment: 'sandbox',
    additionalConfig: {
      clientSecret: process.env.PAYPAL_CLIENT_SECRET
    }
  })
]);
```

## 🔌 API Endpoints

The new multi-provider API is available at `/api/payments/`:

### Get Available Providers
```http
GET /api/payments/providers
```

Response:
```json
{
  "providers": [
    {
      "type": "stripe",
      "capabilities": {
        "supportsSubscriptions": true,
        "supportsOneTimePayments": true,
        "supportsRefunds": true,
        "supportsTrials": true,
        "supportedCurrencies": ["usd", "eur", "gbp"],
        "supportedCountries": ["US", "CA", "GB"]
      },
      "isConfigured": true
    }
  ],
  "clientConfigs": {
    "stripe_sandbox": {
      "publishableKey": "pk_test_...",
      "provider": "stripe",
      "environment": "sandbox"
    }
  }
}
```

### Create Checkout Session
```http
POST /api/payments/checkout-session
Content-Type: application/json

{
  "planId": "price_123",
  "successUrl": "https://example.com/success",
  "cancelUrl": "https://example.com/cancel",
  "provider": "stripe", // Optional: specify preferred provider
  "customerEmail": "user@example.com"
}
```

### Provider Recommendations
```http
POST /api/payments/recommend
Content-Type: application/json

{
  "needsSubscriptions": true,
  "needsTrials": true,
  "primaryCurrency": "usd",
  "primaryCountry": "US"
}
```

### Webhooks
Each provider has its own webhook endpoint:
- Stripe: `/api/payments/webhooks/stripe`
- PayPal: `/api/payments/webhooks/paypal`
- Square: `/api/payments/webhooks/square`

## 🎨 Frontend Integration

### Provider Selection Component

Use the `PaymentProviderSelector` component to let users choose their preferred provider:

```tsx
import { PaymentProviderSelector } from '~/components/payment/provider-selector';

function CheckoutPage() {
  const [selectedProvider, setSelectedProvider] = useState<string>('');

  return (
    <PaymentProviderSelector
      selectedProvider={selectedProvider}
      onProviderSelect={setSelectedProvider}
      requirements={{
        needsSubscriptions: true,
        primaryCurrency: 'usd'
      }}
    />
  );
}
```

### Creating Checkout Sessions

```tsx
async function createCheckout(planId: string, provider?: string) {
  const response = await fetch('/api/payments/checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      planId,
      provider, // Optional provider preference
      successUrl: '/success',
      cancelUrl: '/cancel'
    })
  });

  const { url, provider: usedProvider } = await response.json();
  
  // Redirect to provider-specific checkout
  window.location.href = url;
}
```

## 🔧 Advanced Usage

### Provider-Specific Operations

```typescript
import { paymentService } from '~/lib/payments';

// Get specific provider instance
const stripeProvider = paymentService.getProvider('stripe');
if (stripeProvider) {
  // Use Stripe-specific features
  const customer = await stripeProvider.createCustomer({
    email: 'user@example.com',
    name: 'John Doe'
  });
}

// Check provider capabilities
const supportsTrials = paymentService.providerSupportsFeature('paypal', 'supportsTrials');

// Get best provider for specific requirements
const bestProvider = paymentService.getBestProviderForCurrency('eur');
```

### Custom Provider Implementation

Implement new providers by extending the `PaymentProvider` class:

```typescript
import { PaymentProvider } from '~/lib/payments/provider';

class CustomProvider extends PaymentProvider {
  getProviderType() { return 'custom' as const; }
  
  getCapabilities() {
    return {
      supportsSubscriptions: true,
      supportsOneTimePayments: true,
      // ... other capabilities
    };
  }

  async initialize() {
    // Initialize your provider SDK
  }

  // Implement all required methods...
}

// Register the provider
await providerFactory.registerProvider({
  type: 'custom',
  apiKey: 'your-api-key',
  environment: 'sandbox'
});
```

## 🔄 Migration Guide

### From Stripe-Only to Multi-Provider

1. **Database Migration**: Run the migration to add multi-provider fields:
   ```sql
   -- Applied automatically via drizzle/0002_multi_provider_support.sql
   ```

2. **API Updates**: The existing Stripe API at `/api/payment/` continues to work. Gradually migrate to `/api/payments/` for new features.

3. **Frontend Updates**: Replace direct Stripe calls with the multi-provider service:
   ```tsx
   // Before
   import { formatPrice } from '~/lib/stripe';
   
   // After
   import { formatAmount } from '~/lib/payments';
   ```

### Backward Compatibility

- Existing Stripe integrations continue to work unchanged
- Legacy database columns are preserved
- Existing API endpoints remain functional
- Gradual migration path available

## 🧪 Testing

### Provider Validation

```typescript
// Check all providers are configured correctly
const validation = await paymentService.validateProviders();
console.log('Valid providers:', validation.valid);
console.log('Invalid providers:', validation.invalid);
```

### Mock Providers for Testing

```typescript
// Use sandbox/test environments for all providers
const providers = paymentService.getAvailableProviders();
providers.forEach(provider => {
  console.log(`${provider.type}: ${provider.isConfigured ? 'Ready' : 'Not configured'}`);
});
```

## 📊 Monitoring & Analytics

### Provider Performance Tracking

The system tracks provider performance for optimization:

```typescript
// Get provider-specific analytics (future feature)
const analytics = await paymentService.getProviderAnalytics('stripe', {
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31')
});
```

### Webhook Event Logging

All webhook events are logged with provider information:

```sql
SELECT provider, event_type, COUNT(*) 
FROM webhook_events 
WHERE created_at > datetime('now', '-7 days')
GROUP BY provider, event_type;
```

## 🛡️ Security Considerations

1. **API Keys**: Store sensitive keys in environment variables
2. **Webhooks**: Each provider uses signature verification
3. **Database**: Provider-specific IDs are properly indexed
4. **Logging**: Webhook events are logged for audit trails

## 🚀 Future Enhancements

- **Additional Providers**: Square, Razorpay, Adyen
- **Smart Routing**: Automatic provider selection based on success rates
- **A/B Testing**: Compare provider performance
- **Unified Analytics**: Cross-provider reporting
- **Mobile Payments**: Apple Pay, Google Pay integration
- **Cryptocurrency**: Bitcoin, Ethereum support

## 🤝 Contributing

To add a new payment provider:

1. Create provider implementation in `app/lib/payments/providers/`
2. Register in `app/lib/payments/factory.ts`
3. Add configuration to `workers/api/features/multi-provider-payment.ts`
4. Update documentation and tests
5. Submit PR with comprehensive testing

---

The multi-provider payment system makes the NARA boilerplate incredibly flexible for different business models and global markets, while maintaining the simplicity and type safety that developers love.