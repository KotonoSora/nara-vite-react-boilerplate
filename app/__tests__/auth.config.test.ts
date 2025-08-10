import { describe, it, expect } from 'vitest';
import { 
  hashPassword, 
  verifyPassword, 
  isStrongPassword,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  getEmailVerificationExpiry,
  getPasswordResetExpiry
} from '~/lib/auth/config';

describe('Authentication Utilities', () => {
  describe('Password Hashing', () => {
    it('should hash passwords securely', async () => {
      const password = 'testPassword123!';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(20);
    });

    it('should verify correct passwords', async () => {
      const password = 'testPassword123!';
      const hash = await hashPassword(password);
      
      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect passwords', async () => {
      const password = 'testPassword123!';
      const wrongPassword = 'wrongPassword123!';
      const hash = await hashPassword(password);
      
      const isValid = await verifyPassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });
  });

  describe('Password Strength Validation', () => {
    it('should validate strong passwords', () => {
      const strongPassword = 'MyStr0ng!P@ssw0rd';
      const result = isStrongPassword(strongPassword);
      
      expect(result.isValid).toBe(true);
      expect(result.requirements.minLength).toBe(true);
      expect(result.requirements.hasUppercase).toBe(true);
      expect(result.requirements.hasLowercase).toBe(true);
      expect(result.requirements.hasNumber).toBe(true);
      expect(result.requirements.hasSpecialChar).toBe(true);
    });

    it('should reject weak passwords', () => {
      const weakPassword = 'password';
      const result = isStrongPassword(weakPassword);
      
      expect(result.isValid).toBe(false);
      expect(result.requirements.minLength).toBe(true);
      expect(result.requirements.hasUppercase).toBe(false);
      expect(result.requirements.hasNumber).toBe(false);
      expect(result.requirements.hasSpecialChar).toBe(false);
    });

    it('should reject short passwords', () => {
      const shortPassword = 'Abcd1!';
      const result = isStrongPassword(shortPassword);
      
      expect(result.isValid).toBe(false);
      expect(result.requirements.minLength).toBe(false);
    });
  });

  describe('Token Generation', () => {
    it('should generate unique email verification tokens', () => {
      const token1 = generateEmailVerificationToken();
      const token2 = generateEmailVerificationToken();
      
      expect(token1).toBeDefined();
      expect(token2).toBeDefined();
      expect(token1).not.toBe(token2);
      expect(token1.length).toBeGreaterThan(30);
    });

    it('should generate unique password reset tokens', () => {
      const token1 = generatePasswordResetToken();
      const token2 = generatePasswordResetToken();
      
      expect(token1).toBeDefined();
      expect(token2).toBeDefined();
      expect(token1).not.toBe(token2);
      expect(token1.length).toBeGreaterThan(30);
    });
  });

  describe('Token Expiry', () => {
    it('should set email verification expiry to 24 hours', () => {
      const now = new Date();
      const expiry = getEmailVerificationExpiry();
      
      const diffInHours = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);
      expect(diffInHours).toBeCloseTo(24, 0);
    });

    it('should set password reset expiry to 1 hour', () => {
      const now = new Date();
      const expiry = getPasswordResetExpiry();
      
      const diffInMinutes = (expiry.getTime() - now.getTime()) / (1000 * 60);
      expect(diffInMinutes).toBeCloseTo(60, 0);
    });
  });
});