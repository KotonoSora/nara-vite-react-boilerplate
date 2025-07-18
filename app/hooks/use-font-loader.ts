import { useEffect } from 'react';
import type { UserPreferences } from '~/lib/user-preferences';

export function useFontLoader(fontFamily: string, isClient: boolean) {
  useEffect(() => {
    if (!isClient) return;
    
    // Apply font family
    if (fontFamily !== 'Inter') {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@100;300;400;500;600;700;800;900&display=swap`;
      link.rel = 'stylesheet';
      link.id = 'custom-font';
      
      // Remove existing custom font
      const existingLink = document.getElementById('custom-font');
      if (existingLink) {
        existingLink.remove();
      }
      
      document.head.appendChild(link);
    }

    // Update CSS custom property for font family
    const root = document.documentElement;
    const fontStack = fontFamily === 'Inter' 
      ? '"Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
      : `"${fontFamily}", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
    
    root.style.setProperty('--font-sans', fontStack);
  }, [fontFamily, isClient]);
}