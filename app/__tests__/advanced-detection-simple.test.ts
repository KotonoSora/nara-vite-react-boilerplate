import { describe, it, expect } from 'vitest';
import {
  detectLanguageAdvanced,
  LANGUAGE_REGIONS,
  BROWSER_LANGUAGE_MAP,
} from '~/lib/i18n/advanced-detection';

describe('Advanced Language Detection - Simple Tests', () => {
  describe('Basic Detection', () => {
    it('should detect language from Accept-Language header', () => {
      const result = detectLanguageAdvanced({
        acceptLanguageHeader: 'fr-FR,fr;q=0.9,en;q=0.8',
      });

      expect(result.language).toBe('fr');
      expect(result.method).toBe('browser');
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('should fall back to default language', () => {
      const result = detectLanguageAdvanced({});

      expect(result.language).toBe('en');
      expect(result.method).toBe('default');
    });

    it('should include fallback chain', () => {
      const result = detectLanguageAdvanced({
        acceptLanguageHeader: 'es-MX,es;q=0.9,en;q=0.8',
      });

      expect(result.fallbackChain).toBeInstanceOf(Array);
      expect(result.fallbackChain.length).toBeGreaterThan(0);
    });
  });

  describe('Configuration Maps', () => {
    it('should have language regions defined', () => {
      expect(LANGUAGE_REGIONS.en).toContain('US');
      expect(LANGUAGE_REGIONS.fr).toContain('FR');
      expect(LANGUAGE_REGIONS.ja).toContain('JP');
    });

    it('should have browser language mappings', () => {
      expect(BROWSER_LANGUAGE_MAP['en-US']).toBe('en');
      expect(BROWSER_LANGUAGE_MAP['fr-FR']).toBe('fr');
      expect(BROWSER_LANGUAGE_MAP['zh-CN']).toBe('zh');
    });
  });

  describe('Geographic Detection', () => {
    it('should detect language from country codes', () => {
      const jpResult = detectLanguageAdvanced({ region: 'JP' });
      expect(jpResult.language).toBe('ja');

      const frResult = detectLanguageAdvanced({ region: 'FR' });
      expect(frResult.language).toBe('fr');
    });

    it('should provide confidence scores', () => {
      const result = detectLanguageAdvanced({ region: 'CN' });
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe('Timezone Detection', () => {
    it('should detect language from timezone', () => {
      const tokyoResult = detectLanguageAdvanced({ timezone: 'Asia/Tokyo' });
      expect(tokyoResult.language).toBe('ja');

      const parisResult = detectLanguageAdvanced({ timezone: 'Europe/Paris' });
      expect(parisResult.language).toBe('fr');
    });
  });

  describe('Multiple Strategies', () => {
    it('should combine multiple detection methods', () => {
      const result = detectLanguageAdvanced({
        acceptLanguageHeader: 'ja;q=0.8',
        timezone: 'Asia/Tokyo',
        region: 'JP',
      });

      expect(result.language).toBe('ja');
      expect(result.confidence).toBeGreaterThan(0.7); // Should be high with multiple confirmations
    });

    it('should handle conflicting signals gracefully', () => {
      const result = detectLanguageAdvanced({
        acceptLanguageHeader: 'en-US,en;q=0.9',
        timezone: 'Asia/Tokyo', // Japanese timezone
        region: 'JP', // Japanese region
      });

      // Should make a decision without throwing errors
      expect(['en', 'ja']).toContain(result.language);
      expect(result.confidence).toBeGreaterThan(0);
    });
  });
});