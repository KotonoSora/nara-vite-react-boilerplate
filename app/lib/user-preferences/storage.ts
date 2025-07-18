import type { UserPreferences } from './types';
import { defaultPreferences } from './defaults';

// Local storage key
const PREFERENCES_KEY = 'nara-user-preferences';

export function savePreferences(preferences: UserPreferences): void {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.warn('Failed to save user preferences:', error);
  }
}

export function loadPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultPreferences, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to load user preferences:', error);
  }
  return defaultPreferences;
}