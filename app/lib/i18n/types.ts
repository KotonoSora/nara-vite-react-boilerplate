// Import all translation files to generate types
import enCommon from "~/locales/en/common.json";

// Extract the shape of the translation object to create a recursive type
type TranslationValue = string | { [key: string]: TranslationValue };

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

// Generate all possible translation keys from the English translation file
export type TranslationKey = NestedKeyOf<typeof enCommon>;

// Type for translation function return (always a string)
export type TranslationFunction = (
  key: TranslationKey,
  params?: Record<string, string | number>,
) => string;

// Helper type to extract nested object values
export type NestedTranslationObject = typeof enCommon;

// Type for the entire translations object
export type Translations = Record<string, NestedTranslationObject>;
