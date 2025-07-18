import { useCallback, useEffect, useState } from 'react';
import type { UserPreferences } from '~/lib/user-preferences';
import { defaultPreferences, loadPreferences, savePreferences } from '~/lib/user-preferences';

export function usePreferencesStorage() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isClient, setIsClient] = useState(false);

  // Load preferences on client-side only
  useEffect(() => {
    setIsClient(true);
    setPreferences(loadPreferences());
  }, []);

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const newPreferences = { ...prev, ...updates };
      if (isClient) {
        savePreferences(newPreferences);
      }
      return newPreferences;
    });
  }, [isClient]);

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
    if (isClient) {
      savePreferences(defaultPreferences);
    }
  }, [isClient]);

  return {
    preferences,
    updatePreferences,
    resetPreferences,
    isClient,
  };
}