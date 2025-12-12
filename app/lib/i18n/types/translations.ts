/**
 * Import generated translation types
 * Types are generated from app/locales/en/*.json using scripts/generate-i18n-types.ts
 * This approach avoids importing JSON files directly, reducing bundle size in modular monolith architecture
 * 
 * To regenerate types: bun run generate:i18n-types
 */
import type { NamespaceTranslations } from "./generated-translations";

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

// Generate all possible translation keys from the namespace translation structure
export type TranslationKey = NestedKeyOf<NamespaceTranslations>;

// Type for translation function return (always a string)
export type TranslationFunction = (
  key: TranslationKey,
  params?: Record<string, string | number>,
) => string;

// Helper type to extract nested object values
export type NestedTranslationObject = NamespaceTranslations;
