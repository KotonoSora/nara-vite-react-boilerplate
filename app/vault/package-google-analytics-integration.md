---
title: "Package @kotonosora/google-analytics Integration"
description: "Google Analytics integration for tracking user behavior and engagement metrics"
date: "2026-02-22"
published: true
author: "Development Team"
tags: ["analytics", "google-analytics", "tracking", "metrics", "events"]
---

# @kotonosora/google-analytics Integration

## Overview

`@kotonosora/google-analytics` provides seamless Google Analytics integration for tracking user behavior, engagement events, and performance metrics across the NARA application.

## Package Information

- **Name**: `@kotonosora/google-analytics`
- **Version**: 0.0.1
- **Type**: React utility library
- **Location**: `packages/google-analytics/`
- **Dependencies**:
  - `react`, `react-dom` (19.2.4)
- **Peer Dependencies**: `gtag` (Google Analytics library)

## Architecture

```
packages/google-analytics/
├── src/
│   ├── hooks/
│   │   ├── useGoogleAnalytics.ts    # Main analytics hook
│   │   ├── usePageView.ts           # Page tracking
│   │   ├── useEventTracking.ts      # Event tracking
│   │   └── useConversionTracking.ts # Conversion tracking
│   │
│   ├── context/
│   │   ├── AnalyticsContext.ts     # React context
│   │   └── AnalyticsProvider.tsx   # Provider component
│   │
│   ├── utils/
│   │   ├── initAnalytics.ts        # GA initialization
│   │   ├── createEvent.ts          # Event creation
│   │   └── sanitizeData.ts         # Data sanitization
│   │
│   ├── types/
│   │   └── analytics.types.ts      # Type definitions
│   │
│   └── index.ts
│
└── package.json
```

## Setup & Initialization

### Basic Setup

```typescript
import { AnalyticsProvider } from '@kotonosora/google-analytics'

export default function App() {
  return (
    <AnalyticsProvider
      measurementId="G-XXXXXXXXXX"   // Your GA4 measurement ID
      options={{
        anonymizeIp: true,
        allowAdFeatures: false,
        cookieFlags: 'SameSite=None;Secure'
      }}
    >
      <YourApp />
    </AnalyticsProvider>
  )
}
```

### Environment Configuration

```typescript
// .env.local
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GA_DEBUG_MODE=true
```

```typescript
const initAnalytics = async () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
  
  // Initialize Google Analytics
  window.dataLayer = window.dataLayer || []
}
```

## Core Hooks

### useGoogleAnalytics

Main analytics hook for tracking events:

```typescript
import { useGoogleAnalytics } from '@kotonosora/google-analytics'

export function MyComponent() {
  const {
    trackEvent,
    trackPageView,
    trackConversion,
    setUserId,
    setUserProperties,
    getClientId
  } = useGoogleAnalytics()

  // Track button click
  const handleClick = () => {
    trackEvent('button_click', {
      button_name: 'submit',
      page_location: window.location.href
    })
  }

  return <button onClick={handleClick}>Submit</button>
}
```

**Available Methods:**
- `trackEvent(name, parameters)` - Track custom events
- `trackPageView(path, title)` - Page navigation
- `trackConversion(conversionName, value)` - Goal completions
- `setUserId(userId)` - User identification
- `setUserProperties(properties)` - User attributes
- `getClientId()` - Get GA client ID

### usePageView

Automatic page view tracking:

```typescript
import { usePageView } from '@kotonosora/google-analytics'
import { useLocation } from 'react-router'

export function PageWrapper({ children }) {
  const location = useLocation()
  
  // Automatically tracks page views
  usePageView(location.pathname, document.title)

  return children
}
```

### useEventTracking

Higher-level event tracking hook:

```typescript
import { useEventTracking } from '@kotonosora/google-analytics'

export function FormComponent() {
  const {
    trackFormView,
    trackFormStart,
    trackFormComplete,
    trackFormError
  } = useEventTracking()

  useEffect(() => {
    trackFormView('contact_form')
  }, [])

  const handleSubmit = async (data) => {
    trackFormStart('contact_form')
    
    try {
      await submitForm(data)
      trackFormComplete('contact_form', { 
        source: 'web',
        duration: timeSpent 
      })
    } catch (error) {
      trackFormError('contact_form', { 
        error_type: error.code 
      })
    }
  }

  return <form onSubmit={handleSubmit}>{/* ... */}</form>
}
```

### useConversionTracking

Monitor conversions and goals:

```typescript
import { useConversionTracking } from '@kotonosora/google-analytics'

export function PurchaseFlow() {
  const {
    trackAddToCart,
    trackRemoveFromCart,
    trackCheckout,
    trackPurchase
  } = useConversionTracking()

  const handleAddToCart = (product) => {
    trackAddToCart({
      currency: 'USD',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: 1
      }]
    })
  }

  const handlePurchase = (order) => {
    trackPurchase({
      transaction_id: order.id,
      value: order.total,
      currency: 'USD',
      tax: order.tax,
      shipping: order.shipping,
      items: order.items
    })
  }

  return (
    <div>
      {/* E-commerce UI */}
    </div>
  )
}
```

## Event Tracking Examples

### User Interactions

```typescript
import { useGoogleAnalytics } from '@kotonosora/google-analytics'

export function InteractiveComponent() {
  const { trackEvent } = useGoogleAnalytics()

  return (
    <div>
      <button onClick={() => trackEvent('button_click', { 
        button_id: 'cta_button',
        button_text: 'Learn More'
      })}>
        Learn More
      </button>

      <input onChange={() => trackEvent('search', { 
        search_term: event.target.value 
      })} />

      <video onPlay={() => trackEvent('video_play', {
        video_title: 'Product Demo',
        video_duration: 60
      })} />
    </div>
  )
}
```

### Page Events

```typescript
import { useGoogleAnalytics } from '@kotonosora/google-analytics'
import { useEffect } from 'react'

export function AnalyticsPage() {
  const { trackPageView, trackEvent } = useGoogleAnalytics()

  useEffect(() => {
    // Track page view
    trackPageView(
      window.location.pathname,
      document.title
    )

    // Track time on page
    const timer = setTimeout(() => {
      trackEvent('page_time', {
        time_on_page: 30,
        page_section: 'product_details'
      })
    }, 30000)

    return () => clearTimeout(timer)
  }, [])

  return <div>Content</div>
}
```

### E-commerce Events

```typescript
import { useConversionTracking } from '@kotonosora/google-analytics'

export function ProductShowcase({ product }) {
  const { trackAddToCart, trackViewItem } = useConversionTracking()

  useEffect(() => {
    trackViewItem({
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price
      }]
    })
  }, [product])

  return (
    <button onClick={() => trackAddToCart({
      currency: 'USD',
      value: product.price,
      items: [{ item_id: product.id }]
    })}>
      Add to Cart
    </button>
  )
}
```

### Form Tracking

```typescript
import { useEventTracking } from '@kotonosora/google-analytics'
import { useState } from 'react'

export function RegistrationForm() {
  const { trackFormStart, trackFormComplete, trackFormError } = useEventTracking()
  const [started, setStarted] = useState(false)

  const handleFormFocus = () => {
    if (!started) {
      trackFormStart('signup_form')
      setStarted(true)
    }
  }

  const handleSubmit = async (formData) => {
    try {
      const response = await submitRegistration(formData)
      trackFormComplete('signup_form', {
        method: 'email',
        form_fields: Object.keys(formData)
      })
      // Redirect after success
    } catch (error) {
      trackFormError('signup_form', {
        error_code: error.code,
        error_message: error.message
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} onFocus={handleFormFocus}>
      {/* Form fields */}
    </form>
  )
}
```

## Event Categories

### Performance Events

```typescript
// Page load performance
trackEvent('page_performance', {
  page_load_time: 2500,  // milliseconds
  first_paint: 1200,
  first_contentful_paint: 1500
})
```

### Engagement Events

```typescript
// Content engagement
trackEvent('engagement', {
  content_type: 'article',
  content_id: 'post-123',
  engagement_type: 'scroll',
  scroll_depth: 75  // percentage
})
```

### Error Events

```typescript
// Application errors
trackEvent('app_error', {
  error_type: 'network_error',
  error_message: 'Failed to fetch data',
  error_code: 'ERR_NETWORK_TIMEOUT',
  page: window.location.pathname
})
```

### Social Events

```typescript
// Social interactions
trackEvent('social_engagement', {
  social_platform: 'twitter',
  social_action: 'share',
  content_title: 'Article Title'
})
```

## User Properties

### Setting User Properties

```typescript
import { useGoogleAnalytics } from '@kotonosora/google-analytics'

export function ProfileSetup() {
  const { setUserProperties, setUserId } = useGoogleAnalytics()

  const handleLogin = (user) => {
    // Set user ID for cross-session tracking
    setUserId(user.id)

    // Set user properties
    setUserProperties({
      user_segment: 'premium',
      account_type: 'business',
      registration_date: user.createdAt,
      company_size: 'mid-market'
    })
  }

  return <button onClick={() => handleLogin(currentUser)}>Login</button>
}
```

### Custom Dimensions

```typescript
const { trackEvent, setUserProperties } = useGoogleAnalytics()

trackEvent('purchase', {
  currency: 'USD',
  value: 99.99,
  
  // Custom dimensions
  user_tier: 'premium',
  referral_source: 'email_campaign',
  ab_test_variant: 'variant_b'
})
```

## Content Grouping

Track content by category:

```typescript
import { useGoogleAnalytics } from '@kotonosora/google-analytics'

export function BlogPost({ post }) {
  const { trackPageView } = useGoogleAnalytics()

  useEffect(() => {
    trackPageView(window.location.pathname, post.title, {
      content_group: 'blog',
      content_category: post.category,
      author: post.author
    })
  }, [post])

  return <article>{/* Post content */}</article>
}
```

## Debug Mode

Enable debug logging for development:

```typescript
<AnalyticsProvider
  measurementId="G-XXXXXXXXXX"
  debug={true}  // Enable debug mode
>
  <App />
</AnalyticsProvider>
```

Google Analytics debugger browser extension shows all events in real-time.

## Real User Monitoring (Web Vitals)

Track page performance metrics:

```typescript
import { useGoogleAnalytics } from '@kotonosora/google-analytics'
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

export function WebVitalsTracker() {
  const { trackEvent } = useGoogleAnalytics()

  useEffect(() => {
    getCLS(metric => trackEvent('CLS', { value: metric.value }))
    getFID(metric => trackEvent('FID', { value: metric.value }))
    getFCP(metric => trackEvent('FCP', { value: metric.value }))
    getLCP(metric => trackEvent('LCP', { value: metric.value }))
    getTTFB(metric => trackEvent('TTFB', { value: metric.value }))
  }, [])

  return null
}
```

## Privacy Considerations

### Data Anonymization

```typescript
<AnalyticsProvider
  measurementId="G-XXXXXXXXXX"
  options={{
    anonymizeIp: true,              // Remove last octet of IP
    allowAdFeatures: false,         // Disable advertising features
    cookieFlags: 'SameSite=None;Secure'
  }}
>
  <App />
</AnalyticsProvider>
```

### GDPR Compliance

```typescript
// Only track with user consent
import { useGoogleAnalytics } from '@kotonosora/google-analytics'

export function ConsentWrapper({ consent }) {
  const { trackEvent } = useGoogleAnalytics()

  if (!consent.analytics) {
    return <App withoutAnalytics />
  }

  return <App />
}
```

## Testing

```typescript
import { render } from '@testing-library/react'
import { AnalyticsProvider } from '@kotonosora/google-analytics'
import { useGoogleAnalytics } from '@kotonosora/google-analytics'

describe('Analytics', () => {
  it('tracks events correctly', () => {
    const trackSpy = vi.fn()
    
    function TestComponent() {
      const { trackEvent } = useGoogleAnalytics()
      
      return (
        <button onClick={() => trackEvent('test_event', { value: 123 })}>
          Test
        </button>
      )
    }

    render(
      <AnalyticsProvider measurementId="G-TEST">
        <TestComponent />
      </AnalyticsProvider>
    )

    // Verify tracking called
  })
})
```

## Best Practices

1. **Set User IDs** for authenticated users for cross-session tracking
2. **Use event categories** consistently across app
3. **Track conversions** for business goals
4. **Monitor performance** with Web Vitals
5. **Test tracking** in development mode
6. **Respect privacy** with anonymization
7. **Implement consent** for GDPR/CCPA compliance
8. **Review regularly** data quality in GA dashboard

---

The Google Analytics package provides comprehensive tracking and analytics capabilities for measuring user engagement and application performance.
