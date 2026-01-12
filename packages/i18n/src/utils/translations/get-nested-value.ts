import type { NestedTranslationObject } from "../../types/translations";

/**
 * Retrieves a nested value from an object using a dot-notation path string.
 *
 * @param obj - The nested translation object to traverse
 * @param path - A dot-separated string representing the path to the desired value (e.g., "user.profile.name")
 * @returns The string value at the specified path, or undefined if the path doesn't exist or the value is not a string
 *
 * @example
 * ```typescript
 * const translations = { user: { profile: { name: "John" } } };
 * getNestedValue(translations, "user.profile.name"); // Returns "John"
 * getNestedValue(translations, "user.invalid.path"); // Returns undefined
 * ```
 */
export function getNestedValue(
  obj: NestedTranslationObject,
  path: string,
): string | undefined {
  return path.split(".").reduce<unknown>((current, key) => {
    return current &&
      typeof current === "object" &&
      current !== null &&
      key in current
      ? (current as Record<string, unknown>)[key]
      : undefined;
  }, obj) as string | undefined;
}
