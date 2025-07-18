import { useEffect } from 'react';
import { useTheme, Theme } from 'remix-themes';
import type { UserPreferences } from '~/lib/user-preferences';

export function useThemeSync(preferences: UserPreferences, isClient: boolean) {
  const [, setTheme] = useTheme();

  // Handle system theme detection and application
  useEffect(() => {
    if (!isClient) return;

    const applyTheme = () => {
      if (preferences.colorTheme === 'system') {
        // Detect system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? Theme.DARK : Theme.LIGHT);
      } else if (preferences.colorTheme === 'light') {
        setTheme(Theme.LIGHT);
      } else if (preferences.colorTheme === 'dark') {
        setTheme(Theme.DARK);
      }
      // Note: 'custom' theme will be handled by CSS custom properties in usePreferencesSync
    };

    applyTheme();

    // Listen for system theme changes when using system theme
    if (preferences.colorTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [preferences.colorTheme, isClient, setTheme]);
}