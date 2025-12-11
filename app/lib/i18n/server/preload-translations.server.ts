import type { SupportedLanguage } from "../types/common";

import { ensureTranslationsLoaded } from "../utils/translations/get-translation";

/**
 * Preloads translations on the server side to ensure they're available
 * before rendering the initial HTML. This prevents flash of untranslated content.
 *
 * This should be called in root loader or middleware that runs before rendering.
 *
 * @param language - The language to preload
 *
 * @example
 * ```typescript
 * // In root loader
 * export async function loader({ context }: LoaderArgs) {
 *   const language = getLanguageFromContext(context);
 *   await preloadTranslationsServer(language);
 *   return { language };
 * }
 * ```
 */
export async function preloadTranslationsServer(
  language: SupportedLanguage,
): Promise<void> {
  await ensureTranslationsLoaded(language);
}
