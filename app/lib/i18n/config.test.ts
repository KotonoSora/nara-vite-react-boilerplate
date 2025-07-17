import { describe, expect, test } from 'vitest';
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  getLanguageFromPath,
  removeLanguageFromPath,
  addLanguageToPath,
  detectLanguageFromAcceptLanguage,
} from '~/lib/i18n/config';

describe('i18n configuration', () => {
  test('isSupportedLanguage should correctly identify supported languages', () => {
    expect(isSupportedLanguage('en')).toBe(true);
    expect(isSupportedLanguage('es')).toBe(true);
    expect(isSupportedLanguage('fr')).toBe(true);
    expect(isSupportedLanguage('de')).toBe(false);
    expect(isSupportedLanguage('invalid')).toBe(false);
  });

  test('getLanguageFromPath should extract language from URL path', () => {
    expect(getLanguageFromPath('/en/about')).toBe('en');
    expect(getLanguageFromPath('/es/showcase')).toBe('es');
    expect(getLanguageFromPath('/fr/')).toBe('fr');
    expect(getLanguageFromPath('/about')).toBe(null);
    expect(getLanguageFromPath('/')).toBe(null);
    expect(getLanguageFromPath('/de/about')).toBe(null); // unsupported language
  });

  test('removeLanguageFromPath should remove language prefix from path', () => {
    expect(removeLanguageFromPath('/en/about')).toBe('/about');
    expect(removeLanguageFromPath('/es/showcase/demo')).toBe('/showcase/demo');
    expect(removeLanguageFromPath('/fr/')).toBe('/');
    expect(removeLanguageFromPath('/about')).toBe('/about');
    expect(removeLanguageFromPath('/')).toBe('/');
  });

  test('addLanguageToPath should add language prefix to path', () => {
    expect(addLanguageToPath('/about', 'es')).toBe('/es/about');
    expect(addLanguageToPath('/showcase', 'fr')).toBe('/fr/showcase');
    expect(addLanguageToPath('/', 'es')).toBe('/es');
    expect(addLanguageToPath('/about', 'en')).toBe('/about'); // default language
  });

  test('detectLanguageFromAcceptLanguage should detect preferred language', () => {
    expect(detectLanguageFromAcceptLanguage('en-US,en;q=0.9,es;q=0.8')).toBe('en');
    expect(detectLanguageFromAcceptLanguage('es-ES,es;q=0.9,en;q=0.8')).toBe('es');
    expect(detectLanguageFromAcceptLanguage('fr-FR,fr;q=0.9')).toBe('fr');
    expect(detectLanguageFromAcceptLanguage('de-DE,de;q=0.9')).toBe('en'); // fallback to default
    expect(detectLanguageFromAcceptLanguage('')).toBe('en'); // fallback to default
    expect(detectLanguageFromAcceptLanguage(undefined)).toBe('en'); // fallback to default
  });
});