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