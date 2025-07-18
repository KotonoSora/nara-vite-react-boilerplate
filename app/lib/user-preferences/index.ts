// Re-export all user preferences utilities and types
export type { UserPreferences } from './types';
export type { FontOption, FontSizeOption } from './fonts';

export { defaultPreferences } from './defaults';
export { availableFonts, fontSizeOptions } from './fonts';
export { savePreferences, loadPreferences } from './storage';