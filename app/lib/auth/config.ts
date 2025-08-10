import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateSessionId(): string {
  return crypto.randomUUID();
}

export function getSessionExpiry(): Date {
  const now = new Date();
  // Session expires in 30 days
  now.setDate(now.getDate() + 30);
  return now;
}

export function generateEmailVerificationToken(): string {
  return crypto.randomUUID() + '-' + Date.now().toString(36);
}

export function generatePasswordResetToken(): string {
  return crypto.randomUUID() + '-' + Date.now().toString(36);
}

export function getEmailVerificationExpiry(): Date {
  const now = new Date();
  // Token expires in 24 hours
  now.setHours(now.getHours() + 24);
  return now;
}

export function getPasswordResetExpiry(): Date {
  const now = new Date();
  // Token expires in 1 hour
  now.setHours(now.getHours() + 1);
  return now;
}

// Rate limiting helpers
export const AUTH_RATE_LIMITS = {
  LOGIN_ATTEMPTS: 5,
  PASSWORD_RESET_ATTEMPTS: 3,
  EMAIL_VERIFICATION_ATTEMPTS: 3,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
} as const;

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isStrongPassword(password: string): {
  isValid: boolean;
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
} {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  
  const isValid = Object.values(requirements).every(Boolean);
  
  return { isValid, requirements };
}
