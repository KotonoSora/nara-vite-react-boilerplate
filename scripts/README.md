# Scripts Documentation

This directory contains utility scripts for the NARA boilerplate project.

## create-locale.mjs

### Purpose
Simple CLI script to create new locale translation files across all language directories. Provides a streamlined interface for scaffolding translation files without complex prompts or manual file creation.

### Problem Solved
Creating translations typically requires:
- Manually creating JSON files in every language directory
- Ensuring proper JSON formatting
- Maintaining consistent file structure across languages
- Risk of forgetting to create files for some languages

This script automates the process with a single prompt.

### Features
- **Simple single-prompt interface**: Just enter a filename
- **Creates files for all languages**: Automatically generates files in all existing language directories
- **Non-destructive**: Skips files that already exist
- **Pretty-printed JSON**: Clean, formatted empty JSON objects ready for content
- **Validation**: Ensures valid filename format

### Usage

#### Create a new locale file:
```bash
npm run create:locale
```

Or directly with Node.js:
```bash
node scripts/create-locale.mjs
```

#### Simple Flow:
1. **Enter filename** - Input the namespace/filename (e.g., "user-profile", "dashboard")
2. **Done!** - Files created in all language directories

### Example Session

```
🌍 Create New Locale Files

==================================================
This will create a new JSON file in all language directories.
Format: lowercase letters, numbers, and hyphens
Examples: user-profile, dashboard, settings, auth

Enter filename (without .json): user-profile

🔨 Creating user-profile.json in 9 language(s)...

✅ Created: ar/user-profile.json
✅ Created: en/user-profile.json
✅ Created: es/user-profile.json
✅ Created: fr/user-profile.json
✅ Created: hi/user-profile.json
✅ Created: ja/user-profile.json
✅ Created: th/user-profile.json
✅ Created: vi/user-profile.json
✅ Created: zh/user-profile.json

==================================================
✨ Done!
==================================================

✅ Created 9 new file(s): ar, en, es, fr, hi, ja, th, vi, zh

💡 Next steps:
   1. Add translation keys to the JSON files
   2. Run 'npm run generate:i18n-types' to update TypeScript types
   3. Test the translations in your app
```

### Validation Rules

#### Filename Format:
- Format: lowercase letters, numbers, and hyphens only
- Must start with a letter
- Examples: `user-profile`, `dashboard`, `auth`, `settings`
- Must match pattern: `/^[a-z][a-z0-9-]*$/`
- Cannot be empty

### Output Format

All files are created as empty JSON objects:
```json
{}
```

This allows you to add translation keys manually, maintaining full control over the content and structure.

### Benefits
- **Faster workflow**: Single prompt instead of multiple steps
- **Consistency**: All language directories get the same file structure
- **Error prevention**: Validates filename format
- **Complete coverage**: Creates files for all existing languages automatically
- **Simple and focused**: No complex options or menus to navigate

### When to Use
- Creating a new translation namespace for a feature
- Adding a new category of translations
- Quick scaffolding before adding translation content
- Setting up translation files for a new section of your app

### Integration with Other Scripts
After creating files, remember to:
1. Add translation keys and values to each JSON file
2. Run `npm run generate:i18n-types` to update TypeScript types
3. Test the translations in your app

### Use Cases
1. **New feature**: Creating translations for a new app section
   ```bash
   # Create files for user profile feature
   npm run create:locale
   > user-profile
   ```

2. **New category**: Organizing translations by category
   ```bash
   # Create files for payment-related translations
   npm run create:locale
   > payment-methods
   ```

3. **Quick setup**: Rapidly scaffolding multiple translation namespaces
   ```bash
   # Create files one by one
   npm run create:locale
   > dashboard
   npm run create:locale
   > settings
   npm run create:locale
   > notifications
   ```

---

## generate-missing-locales.mjs

### Purpose
Auto-generates missing JSON locale files for all languages based on the English locale files in `app/locales/en/`. This ensures all languages have a complete set of translation files, even if they contain placeholder English text that needs translation.

### Problem Solved
When new translation namespaces are added to the English locale:
- Other language directories might be missing these new files
- This causes runtime errors when the app tries to load missing translations
- Manually creating placeholder files for all languages is tedious and error-prone

### Solution
The script automatically:
1. Scans all JSON files in `app/locales/en/`
2. Checks each language directory for missing files
3. Generates missing files with English content as placeholders
4. Adds translation markers to indicate files need translation

### Usage

#### Generate missing locale files:
```bash
npm run generate:missing-locales
```

Or directly with Node.js:
```bash
node scripts/generate-missing-locales.mjs
```

#### When to run:
- After adding new translation namespaces to English locale
- After adding a new language directory
- When setting up the project for the first time
- As part of CI/CD to ensure locale file consistency

### Output Format
Generated files include metadata comments:

```json
{
  "_comment": "⚠️ This file needs translation to FR. Currently using English (EN) as placeholder.",
  "_filename": "theme.json",
  "_language": "fr",
  "light": "Light",
  "dark": "Dark",
  "system": "System",
  "toggle": "Toggle theme"
}
```

The `_comment`, `_filename`, and `_language` keys serve as visual indicators that the file needs translation. These can be removed once translation is complete.

### Benefits
- **Prevents runtime errors**: Ensures all required locale files exist
- **Saves developer time**: No manual file creation needed
- **Clear translation status**: Marker comments indicate which files need work
- **Consistent structure**: All languages maintain the same file structure
- **CI/CD friendly**: Can be integrated into build pipelines

### Architecture Notes
- Only creates files that don't exist (non-destructive)
- Preserves existing translations
- Uses English as the canonical structure
- Compatible with both Node.js and Bun runtimes
- Pure ESM module (`.mjs` extension)

### Supported Languages
Currently supports all language directories in `app/locales/`:
- `ar` - Arabic
- `en` - English (base language)
- `es` - Spanish
- `fr` - French
- `hi` - Hindi
- `ja` - Japanese
- `th` - Thai
- `vi` - Vietnamese
- `zh` - Chinese

### Maintenance
- Add new language directories as needed
- Run script after updating English translations
- Remove metadata comments (`_comment`, `_filename`, `_language`) after translating
- Consider integrating into pre-commit hooks or CI/CD

---

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
