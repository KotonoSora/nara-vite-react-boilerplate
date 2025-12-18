# Scripts Documentation

This directory contains utility scripts for the NARA boilerplate project.

## create-locale.mjs

### Purpose
Interactive CLI script to create new locale translation files from the command line. Provides a user-friendly interface for adding translations without manually creating or editing JSON files.

### Problem Solved
Creating translations typically requires:
- Manually creating JSON files in the correct directory
- Ensuring proper JSON formatting and structure
- Creating placeholder files for all languages
- Maintaining consistent key naming conventions

This script automates and streamlines the entire process with an interactive CLI.

### Features
- **Interactive prompts** for language, namespace, and translation input
- **Validates** language codes, namespace names, and key formats
- **Supports existing files** - can add to existing translations or create new files
- **Auto-generates placeholders** for all languages (optional)
- **Alphabetically sorts** translation keys for consistency
- **Pretty-printed JSON** output with proper formatting
- **Works with both** Node.js and Bun runtimes

### Usage

#### Create a new translation:
```bash
npm run create:locale
```

Or directly with Node.js:
```bash
node scripts/create-locale.mjs
```

#### Interactive Flow:
1. **Select language** - Choose from existing languages or create a new one
2. **Select namespace** - Choose from existing namespaces (e.g., "auth", "theme") or create new
3. **Add translations** - Enter key-value pairs interactively
4. **Confirm** - Review summary and confirm creation
5. **Generate placeholders** - Optionally create files for all languages

### Example Session

```
🌍 Create New Locale Translation

Select language:
1. en - English
2. es - Spanish
3. fr - French
4. Create new...

Select an option (number): 1

✅ Selected language: en (English)

Select namespace:
1. common.json
2. theme.json
3. auth.json
4. Create new...

Select an option (number): 4

📝 Creating new namespace...
Enter namespace name: user-profile

✅ Selected namespace: user-profile

📝 Add translation keys and values
Translation key (or press Enter to finish): displayName
Translation value for "displayName": Display Name
✅ Added: displayName = "Display Name"

Translation key (or press Enter to finish): bio
Translation value for "bio": Biography
✅ Added: bio = "Biography"

Translation key (or press Enter to finish): 

📋 Summary
Language: en (English)
Namespace: user-profile
Translation count: 2

Translations:
  bio: "Biography"
  displayName: "Display Name"

Create these translations? (y/n): y

✅ Created: app/locales/en/user-profile.json

Generate placeholder files for other languages? (y/n): y
✅ Generated placeholders for: es, fr, de, ja, ko, pt, zh, ar

✨ Done! Translation file(s) created successfully.

💡 Next steps:
   1. Review the generated file(s)
   2. Run 'npm run generate:i18n-types' to update TypeScript types
   3. Translate placeholder files if generated
   4. Test the translations in your app
```

### Validation Rules

#### Language Code:
- Format: 2-3 lowercase letters
- Examples: `en`, `fr`, `de`, `ja`
- Must match pattern: `/^[a-z]{2,3}$/`

#### Namespace Name:
- Format: lowercase letters, numbers, and hyphens
- Must start with a letter
- Examples: `auth`, `user-profile`, `admin-dashboard`
- Must match pattern: `/^[a-z][a-z0-9-]*$/`

#### Translation Key:
- Format: camelCase or dot notation
- Must start with a letter
- Examples: `userName`, `user.profile.name`, `myKey`
- Must match pattern: `/^[a-zA-Z][a-zA-Z0-9.]*$/`

### Output Format

#### Main Translation File:
```json
{
  "bio": "Biography",
  "displayName": "Display Name",
  "email": "Email Address"
}
```

#### Placeholder Files (other languages):
```json
{
  "_comment": "⚠️ This file needs translation to FR. Currently using EN as placeholder.",
  "_filename": "user-profile.json",
  "_language": "fr",
  "bio": "Biography",
  "displayName": "Display Name",
  "email": "Email Address"
}
```

### Benefits
- **Faster workflow**: No manual file creation or JSON editing
- **Consistency**: Ensures proper formatting and structure
- **Error prevention**: Validates input before creating files
- **Complete coverage**: Optionally generates files for all languages
- **User-friendly**: Interactive CLI with helpful prompts and feedback
- **Non-destructive**: Can safely add to existing files

### When to Use
- Adding a new translation namespace
- Adding translations to an existing namespace
- Creating translations for a new language
- Quick translation updates during development

### Integration with Other Scripts
After creating translations, remember to:
1. Run `npm run generate:i18n-types` to update TypeScript types
2. Run `npm run generate:missing-locales` if you didn't generate placeholders
3. Translate placeholder files to their respective languages
4. Commit the changes to version control

### Supported Languages
Currently supports these language codes:
- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German
- `ja` - Japanese
- `ko` - Korean
- `pt` - Portuguese
- `zh` - Chinese
- `ar` - Arabic
- `hi` - Hindi
- `th` - Thai
- `vi` - Vietnamese

Custom language codes can also be used with a confirmation prompt.

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
