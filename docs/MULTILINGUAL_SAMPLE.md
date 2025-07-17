# Sample Code: Adding Support for Top 5 Spoken Languages + Additional Languages

This document provides sample code for adding localization support for the Top 5 Spoken Languages by Native Speakers plus Vietnam, Japan, and Thailand to the NARA React Boilerplate.

## Supported Languages Added

### Top 5 Spoken Languages by Native Speakers:
1. **Mandarin Chinese (zh)** - 中文
2. **Hindi (hi)** - हिन्दी  
3. **Spanish (es)** - Español *(already implemented)*
4. **English (en)** - English *(already implemented)*
5. **Arabic (ar)** - العربية

### Additional Languages:
6. **Vietnamese (vi)** - Tiếng Việt
7. **Japanese (ja)** - 日本語
8. **Thai (th)** - ไทย

## Implementation Guide

### 1. Update Language Configuration

The `app/lib/i18n/config.ts` file has been updated to include all new languages:

```typescript
export const SUPPORTED_LANGUAGES = [
  'en', 'es', 'fr', 'zh', 'hi', 'ar', 'vi', 'ja', 'th'
] as const;

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  es: 'Español', 
  fr: 'Français',
  zh: '中文',
  hi: 'हिन्दी',
  ar: 'العربية',
  vi: 'Tiếng Việt',
  ja: '日本語',
  th: 'ไทย',
} as const;
```

### 2. Translation Files Structure

Each language has its own directory under `app/locales/`:

```
app/locales/
├── en/common.json     # English (already existed)
├── es/common.json     # Spanish (already existed)
├── fr/common.json     # French (already existed)
├── zh/common.json     # Mandarin Chinese (NEW)
├── hi/common.json     # Hindi (NEW)
├── ar/common.json     # Arabic (NEW)
├── vi/common.json     # Vietnamese (NEW)
├── ja/common.json     # Japanese (NEW)
└── th/common.json     # Thai (NEW)
```

### 3. Sample Translation Usage

Here's how to use the new languages in your components:

```tsx
import { useTranslation } from '~/lib/i18n';

export function MultiLanguageDemo() {
  const t = useTranslation();
  
  return (
    <div className="space-y-4">
      <h1>{t('landing.title')}</h1>
      <p>{t('landing.subtitle')}</p>
      <p>{t('landing.description')}</p>
      
      <div className="flex gap-2">
        <button>{t('landing.getStarted')}</button>
        <button>{t('landing.viewDocs')}</button>
      </div>
    </div>
  );
}
```

### 4. URL Examples for New Languages

The new languages support the following URL patterns:

```
English (default):  /                    or /en/
Spanish:           /es/
French:            /fr/
Chinese:           /zh/
Hindi:             /hi/
Arabic:            /ar/
Vietnamese:        /vi/
Japanese:          /ja/
Thai:              /th/
```

### 5. Language Switcher Integration

The language switcher component automatically includes all new languages:

```tsx
import { LanguageSwitcher } from '~/components/language-switcher';

export function Header() {
  return (
    <header>
      {/* Other header content */}
      <LanguageSwitcher />
    </header>
  );
}
```

### 6. Sample Translations Preview

Here are some sample translations for key phrases:

#### Landing Page Title
- **English**: "NARA React Boilerplate"
- **Chinese**: "NARA React 模板"
- **Hindi**: "NARA React बॉयलरप्लेट"
- **Arabic**: "NARA React النموذج الأساسي"
- **Vietnamese**: "NARA React Boilerplate"
- **Japanese**: "NARA React ボイラープレート"
- **Thai**: "NARA React Boilerplate"

#### Landing Page Subtitle
- **English**: "A fast, opinionated starter for building full-stack React apps"
- **Chinese**: "用于构建全栈 React 应用的快速、强大的启动器"
- **Hindi**: "फुल-स्टैक React ऐप्स बनाने के लिए एक तेज़, व्यावहारिक स्टार्टर"
- **Arabic**: "بداية سريعة ومنظمة لبناء تطبيقات React كاملة المكدس"
- **Vietnamese**: "Một khởi đầu nhanh chóng và có ý kiến để xây dựng ứng dụng React full-stack"
- **Japanese**: "フルスタック React アプリを構築するための高速で意見のある スターター"
- **Thai**: "ตัวเริ่มต้นที่รวดเร็วและมีความคิดเห็นสำหรับการสร้างแอป React แบบ full-stack"

### 7. Adding New Languages (Template)

To add a new language in the future:

1. **Add language code to config:**
```typescript
export const SUPPORTED_LANGUAGES = [
  'en', 'es', 'fr', 'zh', 'hi', 'ar', 'vi', 'ja', 'th', 'your-new-lang'
] as const;

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  // ... existing languages
  'your-new-lang': 'Native Language Name',
} as const;
```

2. **Create translation file:**
```bash
mkdir app/locales/your-new-lang
cp app/locales/en/common.json app/locales/your-new-lang/common.json
# Then translate the content
```

3. **Update translations.ts:**
```typescript
import newLangCommon from '../../locales/your-new-lang/common.json';

const translations: Record<SupportedLanguage, NestedTranslationObject> = {
  // ... existing translations
  'your-new-lang': newLangCommon,
};
```

### 8. Type Safety

All translation keys are type-safe. TypeScript will provide autocomplete and error checking:

```tsx
// ✅ This works - valid key
const title = t('landing.title');

// ❌ This will show TypeScript error - invalid key
const invalid = t('invalid.key');
```

### 9. Testing Examples

Test language switching programmatically:

```tsx
import { useLanguage } from '~/lib/i18n';

export function LanguageTestDemo() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <div>
      <p>Current language: {language}</p>
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setLanguage('zh')}>中文</button>
        <button onClick={() => setLanguage('hi')}>हिन्दी</button>
        <button onClick={() => setLanguage('ar')}>العربية</button>
        <button onClick={() => setLanguage('vi')}>Tiếng Việt</button>
        <button onClick={() => setLanguage('ja')}>日本語</button>
        <button onClick={() => setLanguage('th')}>ไทย</button>
      </div>
    </div>
  );
}
```

### 10. Right-to-Left (RTL) Support

For Arabic language, you may want to add RTL support:

```tsx
import { useLanguage } from '~/lib/i18n';

export function RTLWrapper({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : ''}>
      {children}
    </div>
  );
}
```

## Features Implemented

✅ **Complete language support** for 9 languages including Top 5 by native speakers
✅ **Type-safe translations** with TypeScript autocomplete
✅ **URL-based language switching** (/zh/, /hi/, /ar/, etc.)
✅ **Automatic language detection** from browser preferences
✅ **Cookie persistence** for language preferences
✅ **Fallback support** to English for missing translations
✅ **Build and type-check successful** with all new languages

The implementation is production-ready and follows best practices for internationalization in React applications.