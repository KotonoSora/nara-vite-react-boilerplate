export interface UserPreferences {
  // Font preferences
  fontFamily: string;
  fontSize: number; // Scale factor (0.75, 1, 1.25, 1.5)
  
  // Color preferences
  colorTheme: 'light' | 'dark' | 'system' | 'custom';
  customColors?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  
  // Accessibility preferences
  reducedMotion: boolean;
  highContrast: boolean;
  soundEnabled: boolean;
  
  // Layout preferences
  compactMode: boolean;
}

export const defaultPreferences: UserPreferences = {
  fontFamily: 'Inter',
  fontSize: 1,
  colorTheme: 'system',
  reducedMotion: false,
  highContrast: false,
  soundEnabled: true,
  compactMode: false,
};

export const availableFonts = [
  { name: 'Inter', label: 'Inter (Default)', fallback: 'ui-sans-serif, system-ui, sans-serif' },
  { name: 'Roboto', label: 'Roboto', fallback: 'ui-sans-serif, system-ui, sans-serif' },
  { name: 'Open Sans', label: 'Open Sans', fallback: 'ui-sans-serif, system-ui, sans-serif' },
  { name: 'Lato', label: 'Lato', fallback: 'ui-sans-serif, system-ui, sans-serif' },
  { name: 'Poppins', label: 'Poppins', fallback: 'ui-sans-serif, system-ui, sans-serif' },
  { name: 'Montserrat', label: 'Montserrat', fallback: 'ui-sans-serif, system-ui, sans-serif' },
  { name: 'Source Sans Pro', label: 'Source Sans Pro', fallback: 'ui-sans-serif, system-ui, sans-serif' },
];

export const fontSizeOptions = [
  { value: 0.75, label: 'Small' },
  { value: 0.875, label: 'Medium' },
  { value: 1, label: 'Default' },
  { value: 1.125, label: 'Large' },
  { value: 1.25, label: 'Extra Large' },
];

// Local storage utilities
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