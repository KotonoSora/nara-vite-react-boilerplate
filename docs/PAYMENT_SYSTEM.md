# NARA Payment System Integration

This document describes the digital product payment system integration in the NARA boilerplate, enabling you to sell SaaS subscriptions, digital downloads, courses, and other digital products.

## Overview

The payment system supports:
- **SaaS Subscriptions**: Monthly/yearly recurring billing with trials
- **One-time Purchases**: Digital downloads, courses, licenses
- **Multiple Pricing Models**: Free trials, tiered pricing, bundle packages
- **Subscription Management**: Upgrades, downgrades, cancellations, refunds
- **Customer Portal**: Self-service subscription and order management

## Technology Stack

- **Payment Provider**: Stripe (chosen for comprehensive feature support)
- **Database**: Cloudflare D1 with Drizzle ORM
- **Backend**: Hono API routes on Cloudflare Workers
- **Frontend**: React with TypeScript and Tailwind CSS
- **Webhooks**: Stripe webhook handling for payment events

## Database Schema

The payment system adds the following tables:

### Products
- Represents digital products you're selling (SaaS, courses, downloads)
- Links to Stripe Product objects
- Includes features, metadata, and categorization

### Plans
- Pricing plans for products (Basic, Pro, Enterprise)
- Supports both one-time and recurring billing
- Trial periods, feature limits, and pricing tiers

### Customers
- Customer information linked to Stripe Customer objects
- Billing details and payment methods

### Subscriptions
- Active subscription tracking
- Status management (active, canceled, trialing, etc.)
- Usage data and limits

### Orders
- One-time purchase tracking
- Download URLs and access grants
- Refund management

### Webhook Events
- Audit log of all Stripe webhook events
- Error tracking and processing status

## API Routes

### Product Management
- `GET /api/products/products` - List all products with plans
- `GET /api/products/products/:id` - Get specific product
- `POST /api/products/seed-demo` - Seed demo data (development)

### Payment Processing
- `POST /api/payment/create-checkout-session` - Create Stripe checkout for subscriptions
- `POST /api/payment/create-order` - Create one-time purchase
- `GET /api/payment/config` - Get Stripe publishable key

### Customer Management
- `GET /api/payment/customers/by-email/:email` - Find customer by email
- `GET /api/payment/subscriptions/:customerId` - Get customer subscriptions
- `GET /api/payment/orders/:customerId` - Get customer orders
- `POST /api/payment/subscriptions/:id/cancel` - Cancel subscription

### Webhooks
- `POST /webhooks/stripe` - Handle Stripe webhook events

## Setup Instructions

### 1. Stripe Configuration

1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Set up webhook endpoint pointing to `/webhooks/stripe`
4. Configure webhook events (see Webhook Events section)

### 2. Environment Variables

Add these to your environment (use `wrangler secret` for production):

```bash
STRIPE_SECRET_KEY=sk_test_...  # Your Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_test_...  # Your Stripe publishable key  
STRIPE_WEBHOOK_SECRET=whsec_...  # Webhook endpoint secret
```

### 3. Database Setup

Run the migrations to create payment tables:

```bash
npm run db:generate
npm run db:migrate
```

### 4. Stripe Products Setup

You have two options:

**Option A: Use Demo Data**
```bash
# Call the seed demo endpoint
curl -X POST http://localhost:5173/api/products/seed-demo
```

**Option B: Create Products in Stripe Dashboard**
1. Create Products in Stripe Dashboard
2. Create Price objects for each plan
3. Update the database with corresponding records

### 5. Test the Integration

1. Start the development server: `npm run dev`
2. Visit `/pricing` to see available products
3. Test checkout flow with [Stripe test cards](https://stripe.com/docs/testing)
4. Use `/dashboard` to view customer subscriptions and orders

## Demo Products

The system includes three demo products:

### NARA SaaS Platform
- **Type**: SaaS subscription
- **Plans**: Starter ($19/month), Professional ($49/month), Enterprise ($99/month)
- **Features**: User management, analytics, API access
- **Trials**: 14-30 day free trials

### React Mastery Course  
- **Type**: One-time purchase
- **Price**: $99
- **Features**: 50+ video lessons, downloadable resources, certificate

### Premium UI Kit
- **Type**: Digital download
- **Price**: $49  
- **Features**: 100+ React components, TypeScript support, Figma files

## Webhook Events

Configure these Stripe webhook events:

### Required Events
- `customer.created` - Create customer record
- `customer.updated` - Update customer information
- `customer.subscription.created` - Track new subscriptions
- `customer.subscription.updated` - Update subscription status
- `customer.subscription.deleted` - Handle cancellations
- `payment_intent.succeeded` - Complete one-time purchases
- `payment_intent.payment_failed` - Handle failed payments
- `invoice.payment_succeeded` - Subscription renewals
- `invoice.payment_failed` - Failed subscription payments

### Optional Events
- `customer.subscription.trial_will_end` - Trial expiration warnings
- `invoice.upcoming` - Upcoming renewal notifications

## Frontend Components

### Pricing Page (`/pricing`)
- Displays all products with their pricing plans
- Monthly/yearly billing toggle
- Trial period indicators
- Feature comparisons
- Direct checkout integration

### Customer Dashboard (`/dashboard`)  
- Customer lookup by email
- Subscription management
- Order history
- Cancellation self-service

### Success Page (`/success`)
- Post-checkout confirmation
- Navigation to dashboard
- Purchase acknowledgment

## Customization Guide

### Adding New Product Types

1. **Database**: Add new product type to schema
2. **API**: Update validation in payment routes
3. **Frontend**: Create new pricing display components
4. **Stripe**: Configure corresponding products and prices

### Custom Pricing Models

1. **Freemium**: Create $0 plans with usage limits
2. **Usage-based**: Implement metered billing with Stripe
3. **Seat-based**: Track user counts in subscription metadata
4. **Bundles**: Create products with multiple plan options

### Subscription Upgrades/Downgrades

1. Use Stripe's subscription modification APIs
2. Handle proration calculations
3. Update local subscription records via webhooks
4. Provide upgrade/downgrade UI in customer dashboard

## Security Considerations

### Webhook Security
- Verify webhook signatures using `STRIPE_WEBHOOK_SECRET`
- Log all webhook events for audit trails
- Handle webhook retries and duplicates

### Payment Security
- Never store sensitive payment data
- Use Stripe's secure checkout sessions
- Validate all payment amounts server-side
- Implement proper error handling

### Customer Data
- Follow GDPR/privacy regulations
- Implement data deletion procedures
- Secure customer information access
- Use HTTPS for all payment flows

## Testing

### Test Cards
Use [Stripe's test cards](https://stripe.com/docs/testing) for different scenarios:

- **Success**: `4242424242424242`
- **Declined**: `4000000000000002`
- **3D Secure**: `4000002500003155`
- **Insufficient funds**: `4000000000009995`

### Test Webhooks
Use Stripe CLI to forward webhooks to local development:

```bash
stripe listen --forward-to localhost:5173/webhooks/stripe
```

## Production Deployment

1. **Environment Variables**: Set production Stripe keys
2. **Webhook Endpoint**: Update to production URL
3. **Database**: Run migrations on production D1
4. **Testing**: Test complete purchase flows
5. **Monitoring**: Set up webhook and payment monitoring

## Troubleshooting

### Common Issues

**Webhook failures**: Check endpoint URL and secret configuration
**Checkout errors**: Verify Stripe keys and product/price IDs  
**Database errors**: Ensure migrations are applied
**Customer not found**: Check email matching logic

### Debug Tools

- Stripe Dashboard logs
- Webhook event inspector  
- Browser developer console
- Server-side error logs

## Support

For technical support with this payment integration:
1. Check Stripe documentation
2. Review webhook event logs
3. Test with Stripe's debug tools
4. Consult the NARA community

---

This payment system provides a solid foundation for selling digital products while maintaining the flexibility to add custom features as your business grows.