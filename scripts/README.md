# Scripts Documentation

This directory contains utility scripts for the NARA boilerplate project.

## generate-i18n-types.ts

### Purpose
Generates static TypeScript type definitions from English translation JSON files to support the modular monolith architecture. This eliminates runtime imports of JSON files for type generation, reducing bundle size.

### Problem Solved
Previously, `app/lib/i18n/types/translations.ts` imported all JSON translation files directly:

```typescript
import type enAbout from "~/locales/en/about.json";
import type enAdmin from "~/locales/en/admin.json";
// ... all 15+ JSON files
```

This approach:
- Added all translation JSON content to the bundle just for types
- Increased initial bundle size unnecessarily
- Violated the modular monolith principle of deferring non-critical code

### Solution
The script generates static TypeScript interfaces from JSON files at build time:

1. Reads all English translation JSON files from `app/locales/en/`
2. Generates TypeScript interfaces for each namespace
3. Creates a combined `NamespaceTranslations` type
4. Outputs to `app/lib/i18n/types/generated-translations.d.ts`

### Usage

#### Generate types manually:
```bash
npm run generate:i18n-types
```

#### When to regenerate:
- After adding/removing translation namespaces
- After changing translation structure (new keys, nested objects)
- Before committing changes to translation files

#### Integration:
The generated types are imported in `app/lib/i18n/types/translations.ts`:

```typescript
import type { NamespaceTranslations } from "./generated-translations";
```

### Benefits
- **~10-15KB bundle size reduction**: No JSON imports at build time
- **Type safety maintained**: Full TypeScript autocomplete and validation
- **Modular monolith compliance**: Types generated statically, not loaded dynamically
- **Single source of truth**: English translations drive the type system

### Architecture Notes
- Generated file is in `.gitignore` - must be generated during build
- Types are based on English translations (default locale)
- All other language translations must match the English structure
- Script uses Node.js fs APIs, compatible with CI/CD environments

### Maintenance
- Add new namespaces to the `namespaces` array in the script
- Ensure English JSON files remain the canonical structure
- Run type generation as part of pre-commit or CI pipeline if needed
