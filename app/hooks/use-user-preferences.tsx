import React, { createContext, useContext } from 'react';
import type { UserPreferences } from '~/lib/user-preferences/types';
import { usePreferencesStorage } from './use-preferences-storage';
import { useThemeSync } from './use-theme-sync';
import { useFontLoader } from './use-font-loader';
import { usePreferencesSync } from './use-preferences-sync';

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
  const { preferences, updatePreferences, resetPreferences, isClient } = usePreferencesStorage();
  
  // Sync theme with remix-themes
  useThemeSync(preferences, isClient);
  
  // Load fonts dynamically
  useFontLoader(preferences.fontFamily, isClient);
  
  // Sync preferences to DOM
  usePreferencesSync(preferences, isClient);

  return (
    <UserPreferencesContext.Provider 
      value={{ preferences, updatePreferences, resetPreferences }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}