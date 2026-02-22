---
title: "Package @kotonosora/seo Optimization Guide"
description: "Search engine optimization utilities and implementation guide for SEO best practices"
date: "2026-02-22"
published: true
author: "Development Team"
tags: ["seo", "optimization", "meta-tags", "schema", "search-engine"]
---

# @kotonosora/seo Optimization Guide

## Overview

`@kotonosora/seo` provides utilities and components for implementing SEO best practices, managing meta tags, structured data, and optimizing pages for search engine visibility.

## Package Information

- **Name**: `@kotonosora/seo`
- **Version**: 0.0.1
- **Type**: Utility library
- **Location**: `packages/seo/`
- **Dependencies**:
  - `@kotonosora/i18n` (workspace) - Multilingual SEO
  - `@kotonosora/i18n-locales` (workspace) - Locale data

## Architecture

```
packages/seo/
├── src/
│   ├── components/
│   │   ├── Head.tsx              # Meta tags component
│   │   ├── JsonLD.tsx            # Structured data
│   │   ├── OpenGraph.tsx         # OG tags
│   │   └── Robots.tsx            # Robots directives
│   │
│   ├── hooks/
│   │   ├── useSEO.ts             # Main SEO hook
│   │   ├── useMetaTags.ts        # Meta tag management
│   │   ├── useStructuredData.ts  # JSON-LD schema
│   │   └── useSitemap.ts         # Sitemap generation
│   │
│   ├── utils/
│   │   ├── generateSchema.ts     # Schema generation
│   │   ├── metaTagUtils.ts       # Meta tag helpers
│   │   ├── slugify.ts            # URL slug creation
│   │   └── canonicalUrl.ts       # Canonical URL handling
│   │
│   ├── types/
│   │   └── seo.types.ts          # Type definitions
│   │
│   └── index.ts
│
└── package.json
```

## Core Concepts

### Meta Tags

Standard meta tags for SEO and social sharing:

```typescript
interface MetaTags {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  robots?: string
  viewport?: string
  charset?: string
  language?: string
  
  // Open Graph (Social)
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  ogType?: string
  
  // Twitter Card
  twitterCard?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  
  // Apple
  appleIcon?: string
  appleTouchIcon?: string
  appleWebAppCapable?: boolean
}
```

### Structured Data (JSON-LD)

Machine-readable schema markup:

```typescript
interface StructuredData {
  '@context': 'https://schema.org'
  '@type': string
  // Type-specific properties
}
```

## Usage Examples

### Basic Page Setup

```typescript
import { useSEO } from '@kotonosora/seo'

export function HomePage() {
  useSEO({
    title: 'Home - NARA',
    description: 'Build amazing web applications with NARA framework',
    keywords: ['react', 'web-framework', 'typescript'],
    canonical: 'https://example.com/'
  })

  return <div>{/* Page content */}</div>
}
```

### Blog Post

```typescript
import { useSEO } from '@kotonosora/seo'
import { useStructuredData } from '@kotonosora/seo'

export function BlogPost({ post }) {
  useSEO({
    title: `${post.title} - Blog`,
    description: post.excerpt,
    keywords: post.tags,
    canonical: `https://example.com/blog/${post.slug}`,
    ogTitle: post.title,
    ogDescription: post.excerpt,
    ogImage: post.image,
    ogUrl: `https://example.com/blog/${post.slug}`,
    ogType: 'article'
  })

  // Structured data for article
  useStructuredData({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: post.author.profileUrl
    }
  })

  return <article>{/* Content */}</article>
}
```

### Product Page

```typescript
import { useSEO } from '@kotonosora/seo'
import { useStructuredData } from '@kotonosora/seo'

export function ProductPage({ product }) {
  useSEO({
    title: `${product.name} | Shop`,
    description: product.description,
    ogTitle: product.name,
    ogDescription: product.description,
    ogImage: product.mainImage,
    ogType: 'product'
  })

  useStructuredData({
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand
    },
    offers: {
      '@type': 'Offer',
      url: window.location.href,
      priceCurrency: 'USD',
      price: product.price,
      availability: product.inStock ? 'InStock' : 'OutOfStock'
    },
    rating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount
    }
  })

  return <div>{/* Product content */}</div>
}
```

## Structured Data Schemas

### Article Schema

```typescript
import { useStructuredData } from '@kotonosora/seo'

export function ArticleSetup({ article }) {
  useStructuredData({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Person',
      name: article.author,
      url: article.authorUrl
    },
    wordCount: article.wordCount,
    keywords: article.tags.join(', ')
  })
}
```

### Organization Schema

```typescript
import { useStructuredData } from '@kotonosora/seo'

export function OrganizationSetup() {
  useStructuredData({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NARA',
    url: 'https://example.com',
    logo: 'https://example.com/logo.png',
    description: 'Build amazing web applications',
    sameAs: [
      'https://twitter.com/example',
      'https://github.com/example',
      'https://linkedin.com/company/example'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-0123',
      contactType: 'Customer Support'
    }
  })
}
```

### Event Schema

```typescript
import { useStructuredData } from '@kotonosora/seo'

export function EventSetup({ event }) {
  useStructuredData({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate.toISOString(),
    location: {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        addressCountry: event.country
      }
    },
    image: event.image,
    offers: {
      '@type': 'Offer',
      url: window.location.href,
      price: event.price,
      priceCurrency: 'USD',
      availability: 'Available'
    }
  })
}
```

### FAQ Schema

```typescript
import { useStructuredData } from '@kotonosora/seo'

export function FAQSetup({ faqs }) {
  useStructuredData({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  })
}
```

## SEO Hooks

### useSEO

Main hook for SEO setup:

```typescript
import { useSEO } from '@kotonosora/seo'

export function Page() {
  const { 
    setTitle, 
    setDescription,
    addMetaTag,
    setCanonical,
    getTitle,
    getDescription
  } = useSEO({
    title: 'Page Title',
    description: 'Page description'
  })

  return (
    <div>
      <button onClick={() => setTitle('New Title')}>
        Change Title
      </button>
    </div>
  )
}
```

### useMetaTags

Manage meta tags directly:

```typescript
import { useMetaTags } from '@kotonosora/seo'

export function Component() {
  const { addTag, removeTag, getTags } = useMetaTags()

  useEffect(() => {
    addTag('og:title', 'My Page')
    addTag('og:description', 'Description')
    
    return () => {
      removeTag('og:title')
      removeTag('og:description')
    }
  }, [])

  return <div>{/* Content */}</div>
}
```

### useStructuredData

Add JSON-LD structured data:

```typescript
import { useStructuredData } from '@kotonosora/seo'

export function ProductCard({ product }) {
  useStructuredData({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    price: product.price
  })

  return <div>{/* Product */}</div>
}
```

### useSitemap

Generate sitemap:

```typescript
import { useSitemap } from '@kotonosora/seo'

export function SitemapPage() {
  const { generateSitemap } = useSitemap()

  useEffect(() => {
    const pages = [
      { url: '/', changefreq: 'weekly', priority: 1.0 },
      { url: '/blog', changefreq: 'daily', priority: 0.8 },
      { url: '/products', changefreq: 'daily', priority: 0.8 }
    ]

    const sitemapXml = generateSitemap(pages, 'https://example.com')
    // Serve sitemapXml at /sitemap.xml
  }, [])

  return null
}
```

## Open Graph (OG) Tags

### Social Network Sharing

```typescript
import { useSEO } from '@kotonosora/seo'

export function ShareableContent({ content }) {
  useSEO({
    // Standard tags
    title: content.title,
    description: content.description,

    // Open Graph
    ogTitle: content.title,
    ogDescription: content.description,
    ogImage: content.image,
    ogUrl: window.location.href,
    ogType: 'website',

    // Facebook
    fbAppId: 'YOUR_FB_APP_ID',

    // Twitter
    twitterCard: 'summary_large_image',
    twitterTitle: content.title,
    twitterDescription: content.description,
    twitterImage: content.image,
    twitterCreator: '@yourhandle'
  })

  return <article>{/* Content */}</article>
}
```

## Robots and Crawlers

### Robots Meta Tags

```typescript
import { useSEO } from '@kotonosora/seo'

// Standard indexing (default)
useSEO({
  robots: 'index, follow'
})

// No indexing (for admin pages)
useSEO({
  robots: 'noindex, nofollow'
})

// Don't follow external links
useSEO({
  robots: 'index, nofollow'
})
```

### robots.txt

```typescript
// Generate robots.txt content
const robotsTxt = `
User-agent: *
Allow: /
Disallow: /admin
Disallow: /private

Sitemap: https://example.com/sitemap.xml
`

// Serve at /public/robots.txt
```

## Performance & Core Web Vitals

```typescript
import { useSEO } from '@kotonosora/seo'
import { getCLS, getFID, getFCP } from 'web-vitals'

export function PerformanceMonitoring() {
  useSEO({
    // Performance hints
    viewport: 'width=device-width, initial-scale=1',
    charset: 'UTF-8'
  })

  useEffect(() => {
    // Monitor Core Web Vitals
    getCLS(metric => console.log('CLS:', metric.value))
    getFID(metric => console.log('FID:', metric.value))
    getFCP(metric => console.log('FCP:', metric.value))
  }, [])
}
```

## Multilingual SEO

```typescript
import { useSEO } from '@kotonosora/seo'
import { useLocale } from '@kotonosora/i18n-react'

export function LocalizedPage({ content }) {
  const { locale } = useLocale()
  const { setAlternateLanguages } = useSEO()

  useEffect(() => {
    const baseUrl = 'https://example.com'
    const currentUrl = `${baseUrl}/${locale}${window.location.pathname}`

    setAlternateLanguages([
      { lang: 'en', url: `${baseUrl}/en${window.location.pathname}` },
      { lang: 'es', url: `${baseUrl}/es${window.location.pathname}` },
      { lang: 'fr', url: `${baseUrl}/fr${window.location.pathname}` },
      { lang: 'x-default', url: `${baseUrl}${window.location.pathname}` }
    ])
  }, [locale])

  useSEO({
    title: content.translations[locale].title,
    description: content.translations[locale].description,
    language: locale
  })

  return <div>{/* Content */}</div>
}
```

## SEO Checklist

- [ ] Unique, descriptive `<title>` tags (50-60 characters)
- [ ] Compelling meta descriptions (150-160 characters)
- [ ] Proper heading hierarchy (H1, H2, H3)
- [ ] Mobile responsiveness
- [ ] Fast page load times (Core Web Vitals)
- [ ] HTTPS encryption
- [ ] XML sitemap
- [ ] robots.txt file
- [ ] Structured data (JSON-LD)
- [ ] Open Graph tags for social sharing
- [ ] Proper internal linking
- [ ] Optimized images (alt text, compression)
- [ ] Canonical URLs
- [ ] Breadcrumb navigation
- [ ] Regular content updates

## Testing & Validation

```typescript
import { render } from '@testing-library/react'
import { useSEO } from '@kotonosora/seo'

describe('SEO', () => {
  it('sets proper meta tags', () => {
    const TestComponent = () => {
      useSEO({
        title: 'Test Page',
        description: 'Test Description'
      })
      return <div>Content</div>
    }

    render(<TestComponent />)

    expect(document.title).toBe('Test Page')
    expect(
      document.querySelector('meta[name="description"]').content
    ).toBe('Test Description')
  })
})
```

## External Tools

Validate SEO using:

1. **Google Search Console** - Monitor indexing and ranking
2. **Lighthouse** - Core Web Vitals and performance
3. **Schema.org Validator** - Test structured data
4. **Meta Tags Validator** - Verify OG and Twitter tags
5. **Page Speed Insights** - Speed optimization
6. **Screaming Frog** - Crawl and audit entire site

## Best Practices

1. **Unique titles & descriptions** - No duplicates
2. **Focus keywords** - Target 1-2 per page
3. **Quality content** - Write for humans first
4. **Update regularly** - Fresh content signals quality
5. **Mobile-first** - Design for mobile devices
6. **Fast loading** - Optimize images and code
7. **Internal linking** - Connect related pages
8. **Structured data** - Help search engines understand content
9. **HTTPS only** - Secure connections
10. **Monitor metrics** - Track rankings and traffic

---

The SEO package provides comprehensive tools for optimizing pages and content for search engine visibility and higher rankings.
