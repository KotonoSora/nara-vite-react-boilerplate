import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  detectLanguageAdvanced,
  saveUserLanguagePreferences,
  loadUserLanguagePreferences,
  suggestLanguageForUser,
  type UserLanguagePreferences,
} from '~/lib/i18n/advanced-detection';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Advanced Language Detection', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  describe('detectLanguageAdvanced', () => {
    it('should detect language from Accept-Language header', () => {
      const result = detectLanguageAdvanced({
        acceptLanguageHeader: 'fr-FR,fr;q=0.9,en;q=0.8',
      });

      expect(result.language).toBe('fr');
      expect(result.method).toBe('browser');
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should detect language from timezone', () => {
      const result = detectLanguageAdvanced({
        timezone: 'Asia/Tokyo',
      });

      expect(result.language).toBe('ja');
      expect(result.method).toBe('geographic');
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('should detect language from region', () => {
      const result = detectLanguageAdvanced({
        region: 'FR',
      });

      expect(result.language).toBe('fr');
      expect(result.method).toBe('geographic');
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('should provide fallback chain', () => {
      const result = detectLanguageAdvanced({
        acceptLanguageHeader: 'es-MX,es;q=0.9,en;q=0.8,fr;q=0.7',
      });

      expect(result.language).toBe('es');
      expect(result.fallbackChain).toContain('en');
      expect(result.fallbackChain).toContain('fr');
    });

    it('should fall back to default language when no detection possible', () => {
      const result = detectLanguageAdvanced({});

      expect(result.language).toBe('en');
      expect(result.method).toBe('default');
      expect(result.confidence).toBeLessThan(0.2);
    });

    it('should handle multiple detection strategies', () => {
      const result = detectLanguageAdvanced({
        acceptLanguageHeader: 'zh-CN,zh;q=0.9',
        timezone: 'Asia/Shanghai',
        region: 'CN',
      });

      expect(result.language).toBe('zh');
      expect(result.confidence).toBeGreaterThan(0.8);
    });
  });

  describe('User Preferences', () => {
    it('should save user language preferences', () => {
      const preferences: UserLanguagePreferences = {
        primaryLanguage: 'fr',
        fallbackLanguages: ['en', 'es'],
        lastUsed: '2024-01-01T00:00:00.000Z',
        detectionMethod: 'manual',
        timezone: 'Europe/Paris',
      };

      saveUserLanguagePreferences(preferences);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'nara-lang-preferences',
        JSON.stringify(preferences)
      );
    });

    it('should load user language preferences', () => {
      const preferences: UserLanguagePreferences = {
        primaryLanguage: 'ja',
        fallbackLanguages: ['en'],
        lastUsed: '2024-01-01T00:00:00.000Z',
        detectionMethod: 'geographic',
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(preferences));

      const loaded = loadUserLanguagePreferences();

      expect(loaded).toEqual(preferences);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('nara-lang-preferences');
    });

    it('should return null for invalid preferences', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');

      const loaded = loadUserLanguagePreferences();

      expect(loaded).toBeNull();
    });

    it('should validate loaded preferences', () => {
      const invalidPreferences = {
        primaryLanguage: 'invalid',
        fallbackLanguages: ['en'],
        lastUsed: '2024-01-01T00:00:00.000Z',
        detectionMethod: 'manual',
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(invalidPreferences));

      const loaded = loadUserLanguagePreferences();

      expect(loaded).toBeNull();
    });
  });

  describe('Language Suggestions', () => {
    it('should suggest languages based on user context', () => {
      const suggestions = suggestLanguageForUser(
        'en',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'America/New_York',
        'US'
      );

      expect(suggestions).toBeInstanceOf(Array);
      expect(suggestions.length).toBeLessThanOrEqual(3);
      expect(suggestions).not.toContain('en'); // Shouldn't suggest current language
    });

    it('should suggest appropriate secondary languages', () => {
      const suggestions = suggestLanguageForUser('zh');

      expect(suggestions).toContain('en'); // English is common secondary
      expect(suggestions.length).toBeGreaterThan(0);
    });

    it('should limit suggestions to maximum of 3', () => {
      const suggestions = suggestLanguageForUser('en');

      expect(suggestions.length).toBeLessThanOrEqual(3);
    });
  });

  describe('Browser Language Mapping', () => {
    it('should map browser language variants correctly', () => {
      const testCases = [
        { input: 'en-US,en;q=0.9', expected: 'en' },
        { input: 'es-MX,es;q=0.9', expected: 'es' },
        { input: 'zh-CN,zh;q=0.9', expected: 'zh' },
        { input: 'fr-CA,fr;q=0.9', expected: 'fr' },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = detectLanguageAdvanced({
          acceptLanguageHeader: input,
        });
        expect(result.language).toBe(expected);
      });
    });
  });

  describe('Geographic Detection', () => {
    it('should detect languages based on country codes', () => {
      const testCases = [
        { region: 'JP', expected: 'ja' },
        { region: 'TH', expected: 'th' },
        { region: 'VN', expected: 'vi' },
        { region: 'IN', expected: 'hi' },
        { region: 'SA', expected: 'ar' },
      ];

      testCases.forEach(({ region, expected }) => {
        const result = detectLanguageAdvanced({ region });
        expect(result.language).toBe(expected);
      });
    });

    it('should provide appropriate confidence scores', () => {
      const primaryRegion = detectLanguageAdvanced({ region: 'FR' });
      const secondaryRegion = detectLanguageAdvanced({ region: 'BE' }); // Belgium also speaks French

      expect(primaryRegion.confidence).toBeGreaterThan(secondaryRegion.confidence);
    });
  });

  describe('Quality Scoring', () => {
    it('should respect Accept-Language quality values', () => {
      const highQuality = detectLanguageAdvanced({
        acceptLanguageHeader: 'fr;q=1.0,en;q=0.5',
      });
      
      const lowQuality = detectLanguageAdvanced({
        acceptLanguageHeader: 'fr;q=0.3,en;q=0.8',
      });

      expect(highQuality.language).toBe('fr');
      expect(lowQuality.language).toBe('en');
    });

    it('should combine multiple confidence factors', () => {
      const singleFactor = detectLanguageAdvanced({
        acceptLanguageHeader: 'ja;q=0.8',
      });

      const multipleFactors = detectLanguageAdvanced({
        acceptLanguageHeader: 'ja;q=0.8',
        timezone: 'Asia/Tokyo',
        region: 'JP',
      });

      expect(multipleFactors.confidence).toBeGreaterThan(singleFactor.confidence);
    });
  });
});