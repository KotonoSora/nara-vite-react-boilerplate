import { createContext, useContext, useState, useEffect, type FC, type ReactNode } from "react";

export interface AccessibilitySettings {
  reduceMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  keyboardNavigation: boolean;
  screenReaderOptimized: boolean;
  focusIndicators: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (updates: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  reduceMotion: false,
  highContrast: false,
  largeText: false,
  keyboardNavigation: true,
  screenReaderOptimized: false,
  focusIndicators: true,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("accessibility-settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error("Failed to parse accessibility settings:", error);
      }
    } else {
      // Auto-detect user preferences
      const autoDetectedSettings: Partial<AccessibilitySettings> = {};
      
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        autoDetectedSettings.reduceMotion = true;
      }
      
      if (window.matchMedia("(prefers-contrast: high)").matches) {
        autoDetectedSettings.highContrast = true;
      }
      
      if (Object.keys(autoDetectedSettings).length > 0) {
        setSettings(current => ({ ...current, ...autoDetectedSettings }));
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("accessibility-settings", JSON.stringify(settings));
  }, [settings]);

  // Apply CSS classes based on settings
  useEffect(() => {
    const htmlElement = document.documentElement;
    
    // Reduce motion
    if (settings.reduceMotion) {
      htmlElement.classList.add("reduce-motion");
    } else {
      htmlElement.classList.remove("reduce-motion");
    }
    
    // High contrast
    if (settings.highContrast) {
      htmlElement.classList.add("high-contrast");
    } else {
      htmlElement.classList.remove("high-contrast");
    }
    
    // Large text
    if (settings.largeText) {
      htmlElement.classList.add("large-text");
    } else {
      htmlElement.classList.remove("large-text");
    }
    
    // Enhanced focus indicators
    if (settings.focusIndicators) {
      htmlElement.classList.add("enhanced-focus");
    } else {
      htmlElement.classList.remove("enhanced-focus");
    }
    
    // Screen reader optimized
    if (settings.screenReaderOptimized) {
      htmlElement.classList.add("screen-reader-optimized");
    } else {
      htmlElement.classList.remove("screen-reader-optimized");
    }
  }, [settings]);

  const updateSettings = (updates: Partial<AccessibilitySettings>) => {
    setSettings(current => ({ ...current, ...updates }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem("accessibility-settings");
  };

  return (
    <AccessibilityContext.Provider 
      value={{ 
        settings, 
        updateSettings, 
        resetSettings 
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
};