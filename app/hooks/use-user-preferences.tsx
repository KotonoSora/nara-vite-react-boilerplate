import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UserPreferences } from '~/lib/user-preferences';
import { defaultPreferences, loadPreferences, savePreferences } from '~/lib/user-preferences';

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isClient, setIsClient] = useState(false);

  // Load preferences on client-side only
  useEffect(() => {
    setIsClient(true);
    setPreferences(loadPreferences());
  }, []);

  // Apply preferences to document
  useEffect(() => {
    if (!isClient) return;

    const root = document.documentElement;
    
    // Apply font family
    if (preferences.fontFamily !== 'Inter') {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${preferences.fontFamily.replace(' ', '+')}:wght@100;300;400;500;600;700;800;900&display=swap`;
      link.rel = 'stylesheet';
      link.id = 'custom-font';
      
      // Remove existing custom font
      const existingLink = document.getElementById('custom-font');
      if (existingLink) {
        existingLink.remove();
      }
      
      document.head.appendChild(link);
    }

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

    // Update CSS custom property for font family
    const fontStack = preferences.fontFamily === 'Inter' 
      ? '"Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
      : `"${preferences.fontFamily}", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
    
    root.style.setProperty('--font-sans', fontStack);
  }, [preferences, isClient]);

  const updatePreferences = React.useCallback((updates: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const newPreferences = { ...prev, ...updates };
      if (isClient) {
        savePreferences(newPreferences);
      }
      return newPreferences;
    });
  }, [isClient]);

  const resetPreferences = React.useCallback(() => {
    setPreferences(defaultPreferences);
    if (isClient) {
      savePreferences(defaultPreferences);
    }
  }, [isClient]);

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