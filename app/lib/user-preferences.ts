// Re-export everything from the modular structure for backwards compatibility
export type { UserPreferences } from './user-preferences/types';
export type { FontOption, FontSizeOption } from './user-preferences/fonts';
export { defaultPreferences } from './user-preferences/defaults';
export { availableFonts, fontSizeOptions } from './user-preferences/fonts';
export { savePreferences, loadPreferences } from './user-preferences/storage';