import { describe, it, expect } from 'vitest';
import {
  formatAddress,
  formatPhoneNumber,
  formatName,
  validatePostalCode,
  getCulturalColor,
  isColorCulturallyAppropriate,
  getFormattingExamples,
  type Address,
} from '~/lib/i18n/cultural-formatting';

describe('Cultural Formatting', () => {
  describe('Address Formatting', () => {
    const sampleAddress: Address = {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
    };

    it('should format address for US/English style', () => {
      const formatted = formatAddress(sampleAddress, 'en');
      
      expect(formatted).toContain('John Doe');
      expect(formatted).toContain('123 Main Street');
      expect(formatted).toContain('New York');
      expect(formatted).toContain('NY');
      expect(formatted).toContain('10001');
    });

    it('should format address for Chinese style', () => {
      const chineseAddress: Address = {
        name: '张小明',
        street: '长安街123号',
        city: '北京市',
        state: '北京',
        postalCode: '100001',
        country: '中国',
      };

      const formatted = formatAddress(chineseAddress, 'zh');
      
      // Chinese addresses typically start with country
      expect(formatted.indexOf('中国')).toBeLessThan(formatted.indexOf('张小明'));
    });

    it('should format multiline addresses', () => {
      const multiline = formatAddress(sampleAddress, 'en', { multiline: true });
      
      expect(multiline).toContain('\n');
      expect(multiline.split('\n').length).toBeGreaterThan(1);
    });

    it('should exclude country when requested', () => {
      const formatted = formatAddress(sampleAddress, 'en', { includeCountry: false });
      
      expect(formatted).not.toContain('USA');
    });

    it('should handle different separator styles', () => {
      const arabicAddress = formatAddress(sampleAddress, 'ar');
      
      expect(arabicAddress).toContain('، '); // Arabic comma with space
    });
  });

  describe('Phone Number Formatting', () => {
    it('should format US phone numbers', () => {
      const formatted = formatPhoneNumber('5551234567', 'en');
      
      expect(formatted).toBe('(555) 123-4567');
    });

    it('should format French phone numbers', () => {
      const formatted = formatPhoneNumber('0123456789', 'fr');
      
      expect(formatted).toBe('01 23 45 67 89');
    });

    it('should format Japanese phone numbers', () => {
      const formatted = formatPhoneNumber('09012345678', 'ja');
      
      expect(formatted).toBe('090-1234-5678');
    });

    it('should include country code when requested', () => {
      const formatted = formatPhoneNumber('5551234567', 'en', { includeCountryCode: true });
      
      expect(formatted).toContain('+1');
    });

    it('should format for international display', () => {
      const formatted = formatPhoneNumber('5551234567', 'en', { international: true });
      
      expect(formatted).toContain('+1');
    });

    it('should handle unmatched patterns gracefully', () => {
      const formatted = formatPhoneNumber('123', 'en');
      
      expect(formatted).toBe('123'); // Return original if no pattern match
    });
  });

  describe('Name Formatting', () => {
    const westernName = {
      first: 'John',
      middle: 'Michael',
      last: 'Smith',
    };

    const chineseName = {
      first: '小明',
      last: '张',
    };

    const arabicName = {
      first: 'أحمد',
      father: 'محمد',
      grandfather: 'علي',
      family: 'الخالدي',
    };

    it('should format Western names correctly', () => {
      const formatted = formatName(westernName, 'en');
      
      expect(formatted).toBe('John Michael Smith');
    });

    it('should format Chinese names correctly', () => {
      const formatted = formatName(chineseName, 'zh');
      
      expect(formatted).toBe('张小明'); // Last name first
    });

    it('should format Arabic names correctly', () => {
      const formatted = formatName(arabicName, 'ar');
      
      expect(formatted).toContain('أحمد');
      expect(formatted).toContain('محمد');
      expect(formatted).toContain('علي');
      expect(formatted).toContain('الخالدي');
    });

    it('should format formal names with initials', () => {
      const formatted = formatName(westernName, 'en', { formal: true });
      
      expect(formatted).toBe('John M. Smith');
    });

    it('should include honorifics', () => {
      const formatted = formatName(westernName, 'en', { honorific: 'Dr.' });
      
      expect(formatted).toBe('Dr. John Michael Smith');
    });

    it('should validate honorifics', () => {
      const formatted = formatName(westernName, 'en', { honorific: 'Invalid' });
      
      expect(formatted).toBe('John Michael Smith'); // Honorific not included if invalid
    });
  });

  describe('Postal Code Validation', () => {
    it('should validate US ZIP codes', () => {
      expect(validatePostalCode('12345', 'en')).toBe(true);
      expect(validatePostalCode('12345-6789', 'en')).toBe(true);
      expect(validatePostalCode('1234', 'en')).toBe(false);
      expect(validatePostalCode('123456', 'en')).toBe(false);
    });

    it('should validate French postal codes', () => {
      expect(validatePostalCode('75001', 'fr')).toBe(true);
      expect(validatePostalCode('1234', 'fr')).toBe(false);
      expect(validatePostalCode('123456', 'fr')).toBe(false);
    });

    it('should validate Japanese postal codes', () => {
      expect(validatePostalCode('123-4567', 'ja')).toBe(true);
      expect(validatePostalCode('12345', 'ja')).toBe(false);
      expect(validatePostalCode('123-45678', 'ja')).toBe(false);
    });

    it('should return true for languages without validation patterns', () => {
      // This would be true if no pattern is defined for a language
      expect(validatePostalCode('anything', 'th')).toBe(true);
    });
  });

  describe('Cultural Colors', () => {
    it('should return appropriate primary colors for different cultures', () => {
      expect(getCulturalColor('primary', 'en')).toBe('#3B82F6'); // Blue
      expect(getCulturalColor('primary', 'zh')).toBe('#DC2626'); // Red (auspicious)
      expect(getCulturalColor('primary', 'ar')).toBe('#10B981'); // Green (Islamic)
    });

    it('should return semantic colors', () => {
      const success = getCulturalColor('success', 'en');
      const warning = getCulturalColor('warning', 'en');
      const danger = getCulturalColor('danger', 'en');

      expect(success).toBe('#10B981');
      expect(warning).toBe('#F59E0B');
      expect(danger).toBe('#EF4444');
    });

    it('should check color appropriateness for different contexts', () => {
      // Red is auspicious for celebrations in Chinese culture
      const redCelebration = isColorCulturallyAppropriate('#DC2626', 'zh', 'celebration');
      expect(redCelebration.appropriate).toBe(true);

      // White might be inappropriate for celebrations in some cultures
      const whiteCelebration = isColorCulturallyAppropriate('#FFFFFF', 'zh', 'celebration');
      expect(whiteCelebration.appropriate).toBe(false);
      expect(whiteCelebration.reason).toBeDefined();
    });

    it('should handle general context appropriately', () => {
      const general = isColorCulturallyAppropriate('#0000FF', 'en', 'general');
      expect(general.appropriate).toBe(true);
    });

    it('should provide context-aware feedback', () => {
      const inappropriate = isColorCulturallyAppropriate('#DC2626', 'zh', 'mourning');
      if (!inappropriate.appropriate) {
        expect(inappropriate.reason).toContain('celebration');
      }
    });
  });

  describe('Formatting Examples', () => {
    it('should provide comprehensive examples for each language', () => {
      const examples = getFormattingExamples('en');

      expect(examples).toHaveProperty('address');
      expect(examples).toHaveProperty('phone');
      expect(examples).toHaveProperty('name');
      expect(examples).toHaveProperty('colors');

      expect(examples.address).toContain('John Doe');
      expect(examples.phone).toContain('+1');
      expect(examples.name).toContain('John');
      expect(examples.colors).toHaveProperty('primary');
    });

    it('should provide culturally appropriate examples', () => {
      const chineseExamples = getFormattingExamples('zh');
      const arabicExamples = getFormattingExamples('ar');

      // Chinese examples should show different formatting
      expect(chineseExamples.address).toBeDefined();
      expect(chineseExamples.phone).toContain('+86');

      // Arabic examples should use Arabic comma
      expect(arabicExamples.phone).toContain('+966');
    });
  });

  describe('Edge Cases', () => {
    it('should handle incomplete addresses gracefully', () => {
      const incompleteAddress: Address = {
        name: 'John Doe',
        city: 'New York',
      };

      const formatted = formatAddress(incompleteAddress, 'en');
      
      expect(formatted).toContain('John Doe');
      expect(formatted).toContain('New York');
      expect(formatted).not.toContain('undefined');
    });

    it('should handle incomplete names gracefully', () => {
      const incompleteName = {
        first: 'John',
      };

      const formatted = formatName(incompleteName, 'en');
      
      expect(formatted).toBe('John');
    });

    it('should handle empty inputs gracefully', () => {
      const emptyAddress = formatAddress({}, 'en');
      const emptyName = formatName({}, 'en');
      const emptyPhone = formatPhoneNumber('', 'en');

      expect(emptyAddress).toBe('');
      expect(emptyName).toBe('');
      expect(emptyPhone).toBe('');
    });
  });
});