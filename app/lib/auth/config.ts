export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hashedPassword;
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
  return crypto.randomUUID() + "-" + Date.now().toString(36);
}

export function getEmailVerificationExpiry(): Date {
  const now = new Date();
  // Token expires in 24 hours
  now.setHours(now.getHours() + 24);
  return now;
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

export function generatePasswordResetToken(): string {
  return crypto.randomUUID() + "-" + Date.now().toString(36);
}

export function getPasswordResetExpiry(): Date {
  const now = new Date();
  // Token expires in 1 hour
  now.setHours(now.getHours() + 1);
  return now;
}
