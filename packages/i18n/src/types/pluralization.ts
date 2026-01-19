// Pluralization rules for different languages
// Based on Unicode CLDR plural rules: https://cldr.unicode.org/

export type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";

export interface PluralRules {
  [key: string]: {
    zero?: string;
    one?: string;
    two?: string;
    few?: string;
    many?: string;
    other: string; // fallback, required
  };
}
