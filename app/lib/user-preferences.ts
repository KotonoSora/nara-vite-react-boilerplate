// Re-export everything from the new modular structure for backwards compatibility
export type { UserPreferences, FontOption, FontSizeOption } from './user-preferences';
export {
  defaultPreferences,
  availableFonts,
  fontSizeOptions,
  savePreferences,
  loadPreferences,
} from './user-preferences';