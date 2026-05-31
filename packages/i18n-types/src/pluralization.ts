// Pluralization rules for different languages
// Based on Unicode CLDR plural rules: https://cldr.unicode.org/

export type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";

/** Shape of a single plural entry: optional forms + required fallback */
export type PluralForm = {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string; // fallback, required
};

export interface PluralRules<T extends PluralForm = PluralForm> {
  [key: string]: T;
}
