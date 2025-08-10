import { eq } from "drizzle-orm";
import crypto from "crypto";
import type { Database } from "~/lib/types";
import { mfaSecret } from "~/database/schema/user";

const ISSUER = "NARA Boilerplate";

/**
 * Generate a new TOTP secret for a user
 */
export async function generateMFASecret(db: Database, userId: number, userEmail: string) {
  const secret = generateRandomBase32(20);
  const keyURI = `otpauth://totp/${encodeURIComponent(ISSUER)}:${encodeURIComponent(userEmail)}?secret=${secret}&issuer=${encodeURIComponent(ISSUER)}`;
  
  // Generate 8 backup codes
  const backupCodes = Array.from({ length: 8 }, () => 
    generateRandomString(8)
  );
  
  await db.insert(mfaSecret).values({
    userId,
    secret,
    backupCodes: JSON.stringify(backupCodes),
    isEnabled: false,
  });
  
  return {
    secret,
    keyURI,
    backupCodes,
  };
}

/**
 * Generate random base32 string
 */
function generateRandomBase32(length: number): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return result;
}

/**
 * Generate random alphanumeric string
 */
function generateRandomString(length: number): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return result;
}

/**
 * Enable MFA for a user after verifying setup
 */
export async function enableMFA(db: Database, userId: number, token: string) {
  const userMFA = await db
    .select()
    .from(mfaSecret)
    .where(eq(mfaSecret.userId, userId))
    .get();
    
  if (!userMFA) {
    throw new Error("MFA secret not found");
  }
  
  const isValid = await verifyTOTP(userMFA.secret, token);
  if (!isValid) {
    throw new Error("Invalid TOTP token");
  }
  
  await db
    .update(mfaSecret)
    .set({
      isEnabled: true,
      lastUsedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(mfaSecret.userId, userId));
    
  return true;
}

/**
 * Disable MFA for a user
 */
export async function disableMFA(db: Database, userId: number) {
  await db
    .delete(mfaSecret)
    .where(eq(mfaSecret.userId, userId));
}

/**
 * Verify TOTP token using simplified algorithm
 */
export async function verifyTOTP(secret: string, token: string): Promise<boolean> {
  try {
    const time = Math.floor(Date.now() / 1000);
    const timeWindow = Math.floor(time / 30);
    
    // Check current window and adjacent windows for clock skew
    for (let i = -1; i <= 1; i++) {
      const windowTime = timeWindow + i;
      const expectedToken = generateTOTP(secret, windowTime);
      if (expectedToken === token) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Generate TOTP token for a given time window
 */
function generateTOTP(secret: string, timeWindow: number): string {
  // Convert base32 secret to buffer
  const key = base32ToBuffer(secret);
  
  // Create time buffer (8 bytes, big endian)
  const timeBuffer = Buffer.alloc(8);
  timeBuffer.writeUInt32BE(Math.floor(timeWindow / 0x100000000), 0);
  timeBuffer.writeUInt32BE(timeWindow & 0xffffffff, 4);
  
  // Generate HMAC
  const hmac = crypto.createHmac('sha1', key);
  hmac.update(timeBuffer);
  const hash = hmac.digest();
  
  // Dynamic truncation
  const offset = hash[hash.length - 1] & 0x0f;
  const binary = 
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);
  
  // Generate 6-digit token
  const token = binary % 1000000;
  return token.toString().padStart(6, '0');
}

/**
 * Convert base32 string to buffer
 */
function base32ToBuffer(base32: string): Buffer {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  
  for (const char of base32.toUpperCase()) {
    const index = alphabet.indexOf(char);
    if (index === -1) continue;
    bits += index.toString(2).padStart(5, '0');
  }
  
  const bytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    const byte = bits.substr(i, 8);
    if (byte.length === 8) {
      bytes.push(parseInt(byte, 2));
    }
  }
  
  return Buffer.from(bytes);
}

/**
 * Verify backup code
 */
export async function verifyBackupCode(db: Database, userId: number, code: string): Promise<boolean> {
  const userMFA = await db
    .select()
    .from(mfaSecret)
    .where(eq(mfaSecret.userId, userId))
    .get();
    
  if (!userMFA || !userMFA.backupCodes) {
    return false;
  }
  
  const backupCodes: string[] = JSON.parse(userMFA.backupCodes);
  const codeIndex = backupCodes.indexOf(code.toUpperCase());
  
  if (codeIndex === -1) {
    return false;
  }
  
  // Remove used backup code
  backupCodes.splice(codeIndex, 1);
  
  await db
    .update(mfaSecret)
    .set({
      backupCodes: JSON.stringify(backupCodes),
      lastUsedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(mfaSecret.userId, userId));
    
  return true;
}

/**
 * Get user's MFA status
 */
export async function getUserMFAStatus(db: Database, userId: number) {
  const userMFA = await db
    .select()
    .from(mfaSecret)
    .where(eq(mfaSecret.userId, userId))
    .get();
    
  return {
    isEnabled: userMFA?.isEnabled || false,
    hasBackupCodes: userMFA ? JSON.parse(userMFA.backupCodes || "[]").length > 0 : false,
    lastUsedAt: userMFA?.lastUsedAt,
  };
}

/**
 * Regenerate backup codes
 */
export async function regenerateBackupCodes(db: Database, userId: number) {
  const userMFA = await db
    .select()
    .from(mfaSecret)
    .where(eq(mfaSecret.userId, userId))
    .get();
    
  if (!userMFA) {
    throw new Error("MFA not set up for user");
  }
  
  const newBackupCodes = Array.from({ length: 8 }, () => 
    generateRandomString(8)
  );
  
  await db
    .update(mfaSecret)
    .set({
      backupCodes: JSON.stringify(newBackupCodes),
      updatedAt: new Date(),
    })
    .where(eq(mfaSecret.userId, userId));
    
  return newBackupCodes;
}

/**
 * Verify MFA token (TOTP or backup code)
 */
export async function verifyMFAToken(db: Database, userId: number, token: string): Promise<boolean> {
  const userMFA = await db
    .select()
    .from(mfaSecret)
    .where(eq(mfaSecret.userId, userId))
    .get();
    
  if (!userMFA || !userMFA.isEnabled) {
    return false;
  }
  
  // First try TOTP
  const totpValid = await verifyTOTP(userMFA.secret, token);
  if (totpValid) {
    await db
      .update(mfaSecret)
      .set({
        lastUsedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(mfaSecret.userId, userId));
    return true;
  }
  
  // Then try backup code
  return await verifyBackupCode(db, userId, token);
}

/**
 * Check if user requires MFA verification
 */
export async function userRequiresMFA(db: Database, userId: number): Promise<boolean> {
  const userMFA = await db
    .select()
    .from(mfaSecret)
    .where(eq(mfaSecret.userId, userId))
    .get();
    
  return userMFA?.isEnabled || false;
}