import { useEffect } from 'react';
import type { UserPreferences } from '~/lib/user-preferences';

export function usePreferencesSync(preferences: UserPreferences, isClient: boolean) {
  useEffect(() => {
    if (!isClient) return;

    const root = document.documentElement;
    
    // Apply font size scaling
    root.style.setProperty('--font-scale', preferences.fontSize.toString());
    
    // Apply custom colors if using custom theme
    if (preferences.colorTheme === 'custom' && preferences.customColors) {
      Object.entries(preferences.customColors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });
    }

    // Apply accessibility preferences
    if (preferences.reducedMotion) {
      root.style.setProperty('--animation-duration', '0s');
      root.style.setProperty('--transition-duration', '0s');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }

    // Apply high contrast mode
    if (preferences.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply compact mode
    if (preferences.compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
  }, [preferences, isClient]);
}