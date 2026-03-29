---
title: "Package @kotonosora/i18n Multilingual Support"
description: "Internationalization system supporting multiple languages, translations, and localization"
date: "2026-02-22"
published: true
author: "Development Team"
tags:
  ["i18n", "internationalization", "locales", "translations", "multilingual"]
---

# @kotonosora/i18n Multilingual Support

## Overview

The `@kotonosora/i18n` ecosystem provides comprehensive internationalization (i18n) support across the application through three coordinated packages:

1. **@kotonosora/i18n** - Core internationalization logic
2. **@kotonosora/i18n-locales** - Translation data and locale management
3. **@kotonosora/i18n-react** - React hooks for consuming translations

## Package Architecture

### @kotonosora/i18n (Core)

- **Location**: `packages/i18n/`
- **Type**: Core utility library
- **Purpose**: Base internationalization configuration and utilities
- **Dependencies**:
  - `@kotonosora/i18n-locales` (workspace)
  - `date-fns` (4.1.0) - Date locale support

**Key Exports**:

```typescript
export { getLocale, setLocale } from "./locale";
export { t, translate } from "./translate";
export type { Locale, TranslationKey } from "./types";
```

### @kotonosora/i18n-locales (Locale Data)

- **Location**: `packages/i18n-locales/`
- **Type**: Locale data and management
- **Purpose**: Translation files, locale strings, and generation scripts
- **Dependencies**:
  - `@kotonosora/i18n` (workspace)

**Scripts**:

- `npm run create:locale` - Add new language
- `npm run generate:i18n-locales` - Generate missing translations
- `npm run generate:i18n-types` - Generate TypeScript types

### @kotonosora/i18n-react (React Integration)

- **Location**: `packages/i18n-react/`
- **Type**: React hooks and context
- **Purpose**: React-specific i18n hooks and providers
- **Dependencies**:
  - `@kotonosora/i18n` (workspace)
  - `@kotonosora/i18n-locales` (workspace)
  - `date-fns` (4.1.0)

**Exports**:

```typescript
export { useTranslation, useLocale } from "./hooks";
export { I18nProvider } from "./provider";
```

## Directory Structure

```
packages/
├── i18n/                          # Core i18n logic
│   ├── src/
│   │   ├── index.ts              # Main exports
│   │   ├── locale.ts             # Locale management
│   │   ├── translate.ts          # Translation function
│   │   └── types.ts              # Type definitions
│   └── package.json
│
├── i18n-locales/                  # Locale data
│   ├── src/
│   │   ├── index.ts
│   │   ├── locales/              # Translation files
│   │   │   ├── en.json          # English translations
│   │   │   ├── es.json          # Spanish translations
│   │   │   ├── fr.json          # French translations
│   │   │   ├── de.json          # German translations
│   │   │   ├── ja.json          # Japanese translations
│   │   │   └── ... more
│   │   └── types.ts              # Generated locale types
│   ├── scripts/
│   │   ├── create-locale.mjs     # Create new language
│   │   ├── generate-missing-locales.mjs
│   │   └── generate-i18n-types.mjs
│   └── package.json
│
└── i18n-react/                    # React hooks
    ├── src/
    │   ├── index.ts
    │   ├── hooks.ts              # useTranslation, useLocale
    │   ├── provider.tsx          # I18nProvider context
    │   └── context.ts            # I18nContext definition
    └── package.json
```

## Core i18n Usage

### Basic Translation

```typescript
import { t } from "@kotonosora/i18n";

// Simple string
const greeting = t("hello"); // 'Hello' or 'Hola' depending on locale

// With parameters
const welcome = t("welcome.user", { name: "John" });
// 'Welcome, John!' or 'Bienvenido, John!'

// Nested keys
const errorMessage = t("errors.validation.email");
```

### Locale Management

```typescript
import { getLocale, setLocale } from "@kotonosora/i18n";

// Get current locale
const current = getLocale(); // 'en', 'es', etc.

// Set locale
setLocale("es");
setLocale("fr");
setLocale("ja");
```

## React Integration

### useTranslation Hook

```typescript
import { useTranslation } from '@kotonosora/i18n-react'

export function MyComponent() {
  const { t, locale, setLocale } = useTranslation()

  return (
    <div>
      <h1>{t('hello')}</h1>
      <p>{t('current.language')}: {locale}</p>

      <button onClick={() => setLocale('en')}>English</button>
      <button onClick={() => setLocale('es')}>Español</button>
      <button onClick={() => setLocale('fr')}>Français</button>
    </div>
  )
}
```

### useLocale Hook

```typescript
import { useLocale } from '@kotonosora/i18n-react'

export function LanguageSwitcher() {
  const { locale, setLocale, availableLocales } = useLocale()

  return (
    <select value={locale} onChange={(e) => setLocale(e.target.value)}>
      {availableLocales.map((lang) => (
        <option key={lang} value={lang}>
          {t(`language.${lang}`)}
        </option>
      ))}
    </select>
  )
}
```

### I18nProvider

Wrap your app at the root level:

```typescript
import { I18nProvider } from '@kotonosora/i18n-react'

export default function App() {
  return (
    <I18nProvider initialLocale="en" fallbackLocale="en">
      <MainApp />
    </I18nProvider>
  )
}
```

## Translation File Structure

### Translation File Format

`packages/i18n-locales/src/locales/en.json`:

```json
{
  "hello": "Hello",
  "welcome": {
    "user": "Welcome, {{name}}!",
    "guest": "Welcome, Guest!"
  },
  "navigation": {
    "home": "Home",
    "about": "About",
    "contact": "Contact"
  },
  "errors": {
    "validation": {
      "email": "Invalid email address",
      "required": "This field is required"
    },
    "network": "Network error occurred"
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "loading": "Loading..."
  }
}
```

Multiple language translations use same structure:

```json
// en.json
{
  "hello": "Hello"
}

// es.json
{
  "hello": "Hola"
}

// fr.json
{
  "hello": "Bonjour"
}
```

## Managing Locales

### Adding a New Language

```bash
npm run create:locale

# Prompts:
# ? Enter language code (e.g., 'pt' for Portuguese): pt
# ? Enter language name: Portuguese
# ✓ Created packages/i18n-locales/src/locales/pt.json
# ✓ Updated types
```

Creates new locale file with structure matching existing locales.

### Generating Missing Translations

When you add keys to a translation file, generate missing keys for other languages:

```bash
npm run generate:i18n-locales

# Finds keys in en.json that are missing in es.json, fr.json, etc.
# Adds placeholder entries for translators to fill in
```

### Generating TypeScript Types

```bash
npm run generate:i18n-types

# Generates:
# packages/i18n-locales/src/types.ts
# Exports: type TranslationKeys = 'hello' | 'welcome.user' | ...
```

This enables type-safe translation lookups:

```typescript
import type { TranslationKey } from "@kotonosora/i18n-locales";

// Type-safe - won't compile with typos
const key: TranslationKey = "hello"; // ✅
const key: TranslationKey = "helo"; // ❌ TypeScript error
```

## Advanced Usage

### Parameterized Translations

Translation file:

```json
{
  "greet": "Hello, {{name}}! You are {{age}} years old."
}
```

Use with parameters:

```typescript
const message = t("greet", { name: "Alice", age: 30 });
// "Hello, Alice! You are 30 years old."
```

### Plural Forms

```json
{
  "items": {
    "one": "You have 1 item",
    "other": "You have {{count}} items"
  }
}
```

```typescript
const text = t("items", { count: 5 }); // "You have 5 items"
const text = t("items", { count: 1 }); // "You have 1 item"
```

### Date and Time Localization

```typescript
import { formatDate, formatTime, useLocale } from "@kotonosora/i18n-react";

export function DateTime() {
  const { locale } = useLocale();

  const date = new Date("2026-02-22");

  // Automatically uses current locale from date-fns
  const formatted = formatDate(date); // "2/22/2026" (en), "22/2/2026" (es)
}
```

### Nested Translation Keys

```json
{
  "user": {
    "profile": {
      "title": "User Profile",
      "edit": "Edit Profile",
      "settings": "Profile Settings"
    }
  }
}
```

```typescript
const title = t("user.profile.title");
const edit = t("user.profile.edit");
```

## Language Detection

The i18n-react provider can auto-detect language:

```typescript
import { I18nProvider } from '@kotonosora/i18n-react'

export default function App() {
  return (
    <I18nProvider
      initialLocale={detectLanguage()}  // Auto-detect from browser
      fallbackLocale="en"
    >
      <MainApp />
    </I18nProvider>
  )
}

function detectLanguage() {
  // Browser language preference
  const browserLang = navigator.language.split('-')[0]
  return supportedLanguages.includes(browserLang) ? browserLang : 'en'
}
```

## URL-Based Locale Selection

In React Router, extract locale from URL:

```typescript
// Route: ($lang)._index.tsx
import type { Route } from './+types/index'

export const loader = ({ params }: Route.LoaderArgs) => {
  const { lang } = params
  setLocale(lang || 'en')

  return { locale: lang }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>{t('home.title')}</h1>
      {/* Content in current locale */}
    </div>
  )
}
```

## Integration with Other Packages

### With Blog Package

```typescript
import { useTranslation } from '@kotonosora/i18n-react'
import { BlogPost } from '@kotonosora/blog'

export function BlogComponent({ post }) {
  const { t } = useTranslation()

  return (
    <div>
      <h2>{t('blog.title')}</h2>
      <BlogPost post={post} />
      <p>{t('blog.published')}: {post.date}</p>
    </div>
  )
}
```

### With Calendar Package

```typescript
import { useLocale } from '@kotonosora/i18n-react'
import { Calendar } from '@kotonosora/calendar'

export function LocalizedCalendar() {
  const { locale } = useLocale()

  return <Calendar locale={locale} />
}
```

## Performance Optimization

### Lazy Load Translations

```typescript
// Only load needed language
import en from "@kotonosora/i18n-locales/locales/en.json";

// import es from '@kotonosora/i18n-locales/locales/es.json'  // Don't import unused

setLocale("en", en);
```

### Memoize Translation Results

```typescript
import { useMemo } from 'react'
import { useTranslation } from '@kotonosora/i18n-react'

export function Component() {
  const { t } = useTranslation()

  const messages = useMemo(() => ({
    title: t('page.title'),
    description: t('page.description'),
  }), [t])

  return <div>{messages.title}</div>
}
```

## Testing with i18n

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { I18nProvider } from '@kotonosora/i18n-react'
import { useTranslation } from '@kotonosora/i18n-react'

describe('i18n Integration', () => {
  it('translates text in provided locale', () => {
    function TestComponent() {
      const { t } = useTranslation()
      return <div>{t('hello')}</div>
    }

    render(
      <I18nProvider initialLocale="es">
        <TestComponent />
      </I18nProvider>
    )

    expect(screen.getByText('Hola')).toBeInTheDocument()
  })
})
```

## Best Practices

1. **Namespace keys**: Use dot notation for organization (`user.profile.title`)
2. **Complete translations**: Always provide all keys in all locales
3. **Parameter naming**: Use descriptive parameter names ({{userName}}, not {{u}})
4. **Type generation**: Run `generate:i18n-types` after adding keys
5. **Lazy load large translation files**: Import only needed locales initially
6. **Cache translations**: Use context/memoization to avoid re-translating
7. **Test multiple locales**: Test components with different language packs
8. **Document translation keys**: Keep a translation guide for translators

---

The i18n system provides a scalable, type-safe way to support multiple languages across the NARA application ecosystem.
