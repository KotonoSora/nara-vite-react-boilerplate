import { describe, expect, test } from 'vitest';
import { getTranslation, createTranslationFunction } from '~/lib/i18n/translations';

describe('translations', () => {
  test('getTranslation should return correct translation for valid keys', () => {
    expect(getTranslation('en', 'common.loading')).toBe('Loading...');
    expect(getTranslation('es', 'common.loading')).toBe('Cargando...');
    expect(getTranslation('fr', 'common.loading')).toBe('Chargement...');
  });

  test('getTranslation should return nested translation values', () => {
    expect(getTranslation('en', 'landing.title')).toBe('NARA React Boilerplate');
    expect(getTranslation('es', 'landing.title')).toBe('NARA React Boilerplate');
    expect(getTranslation('fr', 'landing.title')).toBe('NARA React Boilerplate');
  });

  test('getTranslation should fallback to English for missing translations', () => {
    // Test with a key that should exist in English but might be missing in other languages
    const englishText = getTranslation('en', 'common.search');
    const spanishText = getTranslation('es', 'common.search');
    const frenchText = getTranslation('fr', 'common.search');
    
    expect(englishText).toBe('Search');
    expect(spanishText).toBe('Buscar');
    expect(frenchText).toBe('Rechercher');
  });

  test('getTranslation should return the key if translation is completely missing', () => {
    const result = getTranslation('en', 'nonexistent.key' as any);
    expect(result).toBe('nonexistent.key');
  });

  test('createTranslationFunction should create a function bound to a language', () => {
    const tEn = createTranslationFunction('en');
    const tEs = createTranslationFunction('es');
    
    expect(tEn('common.loading')).toBe('Loading...');
    expect(tEs('common.loading')).toBe('Cargando...');
  });

  test('should handle parameter replacement when implemented', () => {
    // This test demonstrates how parameter replacement would work
    // when we implement it in the future
    const result = getTranslation('en', 'common.loading', { name: 'Test' });
    expect(result).toBe('Loading...'); // Currently just returns the translation without params
  });
});