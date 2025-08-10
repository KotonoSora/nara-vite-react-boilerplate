import { describe, it, expect } from 'vitest';
import { 
  formatNumber, 
  formatCurrency, 
  formatDate, 
  formatTime,
  formatRelativeTime,
  formatPercentage,
  formatList,
  getRelativeTimeString,
  formatCompactNumber
} from '~/lib/i18n/formatting';

describe('I18n Formatting Utilities', () => {
  describe('Number Formatting', () => {
    it('should format numbers for different locales', () => {
      const number = 1234.56;
      
      expect(formatNumber(number, 'en')).toBe('1,234.56');
      // French uses a thin non-breaking space (\u202f) as thousands separator
      expect(formatNumber(number, 'fr')).toMatch(/1[\s\u202f]234,56/);
      expect(formatNumber(number, 'zh')).toBe('1,234.56');
    });

    it('should format compact numbers', () => {
      expect(formatCompactNumber(1000, 'en')).toBe('1K');
      expect(formatCompactNumber(1000000, 'en')).toBe('1M');
      expect(formatCompactNumber(1500, 'en')).toBe('1.5K');
    });
  });

  describe('Currency Formatting', () => {
    it('should format currency for different locales', () => {
      const amount = 1234.56;
      
      expect(formatCurrency(amount, 'en')).toContain('$');
      expect(formatCurrency(amount, 'en')).toContain('1,234.56');
      
      expect(formatCurrency(amount, 'fr')).toContain('€');
      // Japanese yen symbol can be either ¥ or ￥
      expect(formatCurrency(amount, 'ja')).toMatch(/[¥￥]/);
    });

    it('should format currency with custom currency code', () => {
      const amount = 100;
      const result = formatCurrency(amount, 'en', 'EUR');
      expect(result).toContain('€');
    });
  });

  describe('Date Formatting', () => {
    it('should format dates for different locales', () => {
      const date = new Date('2024-01-15');
      
      const enDate = formatDate(date, 'en');
      expect(enDate).toContain('January');
      expect(enDate).toContain('15');
      expect(enDate).toContain('2024');
      
      const frDate = formatDate(date, 'fr');
      expect(frDate).toContain('janvier');
    });

    it('should handle string and number dates', () => {
      const dateString = '2024-01-15';
      const dateNumber = new Date('2024-01-15').getTime();
      
      const fromString = formatDate(dateString, 'en');
      const fromNumber = formatDate(dateNumber, 'en');
      
      expect(fromString).toBeDefined();
      expect(fromNumber).toBeDefined();
    });
  });

  describe('Time Formatting', () => {
    it('should format time for different locales', () => {
      const date = new Date('2024-01-15T14:30:00');
      
      const enTime = formatTime(date, 'en');
      const frTime = formatTime(date, 'fr');
      
      expect(enTime).toBeDefined();
      expect(frTime).toBeDefined();
    });
  });

  describe('Percentage Formatting', () => {
    it('should format percentages correctly', () => {
      expect(formatPercentage(0.12, 'en')).toBe('12%');
      expect(formatPercentage(0.5, 'en')).toBe('50%');
    });
  });

  describe('List Formatting', () => {
    it('should format lists for different locales', () => {
      const items = ['apple', 'banana', 'cherry'];
      
      const enList = formatList(items, 'en');
      expect(enList).toContain('and');
      
      const frList = formatList(items, 'fr');
      expect(frList).toContain('et');
    });

    it('should handle single items', () => {
      const singleItem = ['apple'];
      const result = formatList(singleItem, 'en');
      expect(result).toBe('apple');
    });
  });

  describe('Relative Time Formatting', () => {
    it('should format relative time', () => {
      const result = formatRelativeTime(-1, 'day', 'en');
      expect(result).toContain('yesterday');
    });

    it('should get smart relative time strings', () => {
      const now = new Date();
      const pastDate = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago
      
      const result = getRelativeTimeString(pastDate, 'en');
      expect(result).toContain('hour');
    });
  });
});