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
| **ZaloPay** | ✅ Full | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Square** | 📋 Planned | ✅ | ✅ | ✅ | ✅ | ❌ |

## 🏗️ Architecture

### Core Components

1. **Payment Provider Interface** (`app/lib/payments/provider.ts`)
   - Abstract base class defining common operations
   - Consistent API across all providers

2. **Provider Implementations** (`app/lib/payments/providers/`)
   - `StripeProvider` - Full Stripe integration
   - `PayPalProvider` - PayPal implementation
   - `ZaloPayProvider` - Vietnamese e-wallet integration
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

# ZaloPay
ZALOPAY_APP_ID=your_zalopay_app_id
ZALOPAY_KEY1=your_zalopay_key1
ZALOPAY_KEY2=your_zalopay_key2

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
  }),
  createProviderConfig('zalopay', {
    apiKey: process.env.ZALOPAY_APP_ID,
    publishableKey: process.env.ZALOPAY_APP_ID,
    environment: 'sandbox',
    additionalConfig: {
      key1: process.env.ZALOPAY_KEY1,
      key2: process.env.ZALOPAY_KEY2
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

## 🇻🇳 ZaloPay Integration Guide

ZaloPay is a popular Vietnamese e-wallet and payment platform that enables easy digital transactions across Vietnam and Southeast Asia.

### Key Features
- **One-time payments** for digital products and services
- **VND currency support** optimized for Vietnamese market
- **Digital wallet integration** with ZaloPay mobile app
- **Bank transfer support** for Vietnamese banks
- **Refund capabilities** with asynchronous processing
- **Webhook notifications** for real-time payment status updates

### Configuration Requirements

To integrate ZaloPay, you need to obtain the following credentials from the [ZaloPay Developer Portal](https://developers.zalopay.vn):

```bash
# ZaloPay Configuration
ZALOPAY_APP_ID=your_app_id_here          # Application ID from ZaloPay
ZALOPAY_KEY1=your_key1_here              # Key 1 for MAC generation
ZALOPAY_KEY2=your_key2_here              # Key 2 for webhook verification
ENVIRONMENT=sandbox                       # Use 'production' for live
```

### Integration Example

```typescript
import { paymentService } from '~/lib/payments';

// Create a ZaloPay checkout session
const checkoutResult = await paymentService.createCheckoutSession({
  planId: 'your_plan_id',
  customerEmail: 'customer@example.com',
  successUrl: 'https://yoursite.com/success',
  cancelUrl: 'https://yoursite.com/cancel'
}, 'zalopay');

if (checkoutResult.success) {
  // Redirect customer to ZaloPay payment page
  window.location.href = checkoutResult.data.url;
}
```

### Capabilities & Limitations

**✅ Supported Features:**
- One-time payments up to 50,000,000 VND
- Refunds (processed within 1-3 business days)
- Webhook notifications for payment events
- Sandbox testing environment

**❌ Not Supported:**
- Recurring subscriptions (use Stripe for subscription models)
- Trial periods or complex billing cycles
- Multi-currency transactions (VND only)
- Usage-based billing

### Testing in Sandbox

ZaloPay provides a comprehensive sandbox environment for testing:

1. **Test App ID**: Use sandbox credentials from developer portal
2. **Test Payments**: Use ZaloPay sandbox app for payment simulation
3. **Test Webhooks**: Configure ngrok or similar for local webhook testing
4. **Test Refunds**: Refund processing is simulated in sandbox

### Production Deployment

Before going live with ZaloPay:

1. **Merchant Verification**: Complete KYC verification with ZaloPay
2. **Production Keys**: Replace sandbox keys with production credentials
3. **Webhook URLs**: Update webhook endpoints to production URLs
4. **SSL Certificate**: Ensure HTTPS for all payment and webhook URLs
5. **Compliance**: Follow Vietnamese payment regulations and data protection laws

### Webhook Handling

ZaloPay sends webhooks for payment events. The system automatically handles:

- `payment.succeeded` - Payment completed successfully
- `payment.failed` - Payment failed or was cancelled
- `refund.processed` - Refund has been completed

Webhook payloads are verified using HMAC-SHA256 with your Key2.

### Regional Considerations

When using ZaloPay, consider:

- **Target Audience**: Primarily Vietnamese users familiar with ZaloPay
- **Currency**: All amounts in Vietnamese Dong (VND)
- **Banking Hours**: Some bank transfers may have processing delays outside business hours
- **Holiday Schedule**: Vietnamese national holidays may affect processing times

---

The multi-provider payment system makes the NARA boilerplate incredibly flexible for different business models and global markets, while maintaining the simplicity and type safety that developers love.