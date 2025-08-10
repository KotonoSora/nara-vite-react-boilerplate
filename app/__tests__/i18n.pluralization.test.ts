import { describe, it, expect, vi } from 'vitest';
import { 
  getPluralCategory, 
  pluralize, 
  getCommonPlural,
  createPluralFunction 
} from '~/lib/i18n/pluralization';

describe('I18n Pluralization', () => {
  describe('Plural Category Detection', () => {
    it('should detect English plural categories', () => {
      expect(getPluralCategory(0, 'en')).toBe('other');
      expect(getPluralCategory(1, 'en')).toBe('one');
      expect(getPluralCategory(2, 'en')).toBe('other');
      expect(getPluralCategory(10, 'en')).toBe('other');
    });

    it('should detect Arabic plural categories', () => {
      expect(getPluralCategory(0, 'ar')).toBe('zero');
      expect(getPluralCategory(1, 'ar')).toBe('one');
      expect(getPluralCategory(2, 'ar')).toBe('two');
      expect(getPluralCategory(3, 'ar')).toBe('few');
      expect(getPluralCategory(11, 'ar')).toBe('many');
    });

    it('should handle Chinese (no plural distinctions)', () => {
      expect(getPluralCategory(0, 'zh')).toBe('other');
      expect(getPluralCategory(1, 'zh')).toBe('other');
      expect(getPluralCategory(100, 'zh')).toBe('other');
    });
  });

  describe('Pluralization Function', () => {
    it('should pluralize English correctly', () => {
      const forms = {
        one: '{{count}} item',
        other: '{{count}} items'
      };

      expect(pluralize(1, 'en', forms)).toBe('1 item');
      expect(pluralize(0, 'en', forms)).toBe('0 items');
      expect(pluralize(5, 'en', forms)).toBe('5 items');
    });

    it('should pluralize without count when specified', () => {
      const forms = {
        one: 'item',
        other: 'items'
      };

      expect(pluralize(1, 'en', forms, false)).toBe('item');
      expect(pluralize(5, 'en', forms, false)).toBe('items');
    });

    it('should handle Arabic pluralization', () => {
      const forms = {
        zero: 'لا توجد عناصر',
        one: 'عنصر واحد',
        two: 'عنصران',
        few: '{{count}} عناصر',
        many: '{{count}} عنصراً',
        other: '{{count}} عنصر'
      };

      expect(pluralize(0, 'ar', forms)).toBe('لا توجد عناصر');
      expect(pluralize(1, 'ar', forms)).toBe('عنصر واحد');
      expect(pluralize(2, 'ar', forms)).toBe('عنصران');
      expect(pluralize(3, 'ar', forms)).toBe('3 عناصر');
      expect(pluralize(11, 'ar', forms)).toBe('11 عنصراً');
    });
  });

  describe('Common Plurals', () => {
    it('should return common plurals for English', () => {
      expect(getCommonPlural('items', 1, 'en')).toBe('1 item');
      expect(getCommonPlural('items', 5, 'en')).toBe('5 items');
      expect(getCommonPlural('users', 1, 'en')).toBe('1 user');
      expect(getCommonPlural('users', 0, 'en')).toBe('0 users');
    });

    it('should return common plurals for Spanish', () => {
      expect(getCommonPlural('items', 1, 'es')).toBe('1 artículo');
      expect(getCommonPlural('items', 5, 'es')).toBe('5 artículos');
    });

    it('should handle zero cases with special forms', () => {
      // English doesn't actually use zero forms, it uses other form for 0
      expect(getCommonPlural('comments', 0, 'en')).toBe('0 comments');
      expect(getCommonPlural('likes', 0, 'en')).toBe('0 likes');
    });

    it('should warn about missing keys', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = getCommonPlural('nonexistent', 1, 'en');
      expect(result).toBe('1 nonexistent');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('No plural forms found for key: nonexistent')
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('Plural Function Factory', () => {
    it('should create language-specific plural functions', () => {
      const englishPlural = createPluralFunction('en');
      const spanishPlural = createPluralFunction('es');
      
      expect(englishPlural('items', 1)).toBe('1 item');
      expect(englishPlural('items', 5)).toBe('5 items');
      
      expect(spanishPlural('items', 1)).toBe('1 artículo');
      expect(spanishPlural('items', 5)).toBe('5 artículos');
    });

    it('should handle custom forms in plural functions', () => {
      const englishPlural = createPluralFunction('en');
      
      const customForms = {
        one: '{{count}} custom item',
        other: '{{count}} custom items'
      };
      
      expect(englishPlural('test', 1, customForms)).toBe('1 custom item');
      expect(englishPlural('test', 5, customForms)).toBe('5 custom items');
    });
  });
});