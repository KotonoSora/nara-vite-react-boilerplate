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
