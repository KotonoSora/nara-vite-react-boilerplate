import { eq, and, gt } from "drizzle-orm";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "~/database/schema";
import { 
  hashPassword, 
  verifyPassword,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  getEmailVerificationExpiry,
  getPasswordResetExpiry,
} from "~/lib/auth/config";
import { sendEmailVerification, sendPasswordReset } from "~/lib/auth/email.server";

const { user, loginLog } = schema;

export type User = typeof user.$inferSelect;
export type CreateUserData = {
  email: string;
  password: string;
  name: string;
  role?: "admin" | "user";
};

export async function createUser(
  db: DrizzleD1Database<typeof schema>,
  userData: CreateUserData,
  options: { sendVerificationEmail?: boolean; baseUrl?: string } = {},
): Promise<User> {
  const passwordHash = await hashPassword(userData.password);
  const emailVerificationToken = generateEmailVerificationToken();
  const emailVerificationExpires = getEmailVerificationExpiry();

  const [newUser] = await db
    .insert(user)
    .values({
      email: userData.email,
      passwordHash,
      name: userData.name,
      role: userData.role || "user",
      emailVerificationToken,
      emailVerificationExpires,
    })
    .returning();

  // Send verification email if requested
  if (options.sendVerificationEmail && options.baseUrl) {
    const verificationLink = `${options.baseUrl}/verify-email?token=${emailVerificationToken}`;
    await sendEmailVerification({
      name: newUser.name,
      email: newUser.email,
      verificationLink,
    });
  }

  return newUser;
}

export async function getUserByEmail(
  db: DrizzleD1Database<typeof schema>,
  email: string,
): Promise<User | null> {
  const [foundUser] = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  return foundUser || null;
}

export async function getUserById(
  db: DrizzleD1Database<typeof schema>,
  id: number,
): Promise<User | null> {
  const [foundUser] = await db
    .select()
    .from(user)
    .where(eq(user.id, id))
    .limit(1);

  return foundUser || null;
}

export async function authenticateUser(
  db: DrizzleD1Database<typeof schema>,
  email: string,
  password: string,
  metadata?: { ipAddress?: string; userAgent?: string },
): Promise<User | null> {
  const foundUser = await getUserByEmail(db, email);

  let success = false;
  
  try {
    if (!foundUser) {
      return null;
    }

    const isValidPassword = await verifyPassword(
      password,
      foundUser.passwordHash,
    );

    if (!isValidPassword) {
      return null;
    }

    success = true;
    
    // Update last login
    await db
      .update(user)
      .set({ 
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(user.id, foundUser.id));

    return foundUser;
  } finally {
    // Log the login attempt
    if (foundUser && metadata) {
      await logLoginAttempt(db, foundUser.id, success, metadata);
    }
  }
}

export async function verifyEmailWithToken(
  db: DrizzleD1Database<typeof schema>,
  token: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  const [foundUser] = await db
    .select()
    .from(user)
    .where(
      and(
        eq(user.emailVerificationToken, token),
        gt(user.emailVerificationExpires!, new Date())
      )
    )
    .limit(1);

  if (!foundUser) {
    return { success: false, error: "Invalid or expired verification token" };
  }

  if (foundUser.emailVerified) {
    return { success: false, error: "Email already verified" };
  }

  // Mark email as verified and clear token
  const [updatedUser] = await db
    .update(user)
    .set({
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
      updatedAt: new Date(),
    })
    .where(eq(user.id, foundUser.id))
    .returning();

  return { success: true, user: updatedUser };
}

export async function requestPasswordReset(
  db: DrizzleD1Database<typeof schema>,
  email: string,
  baseUrl: string,
): Promise<{ success: boolean; error?: string }> {
  const foundUser = await getUserByEmail(db, email);

  if (!foundUser) {
    // Don't reveal if user exists or not for security
    return { success: true };
  }

  const resetToken = generatePasswordResetToken();
  const resetExpires = getPasswordResetExpiry();

  await db
    .update(user)
    .set({
      passwordResetToken: resetToken,
      passwordResetExpires: resetExpires,
      updatedAt: new Date(),
    })
    .where(eq(user.id, foundUser.id));

  const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
  
  await sendPasswordReset({
    name: foundUser.name,
    email: foundUser.email,
    resetLink,
  });

  return { success: true };
}

export async function resetPasswordWithToken(
  db: DrizzleD1Database<typeof schema>,
  token: string,
  newPassword: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  const [foundUser] = await db
    .select()
    .from(user)
    .where(
      and(
        eq(user.passwordResetToken, token),
        gt(user.passwordResetExpires!, new Date())
      )
    )
    .limit(1);

  if (!foundUser) {
    return { success: false, error: "Invalid or expired reset token" };
  }

  const passwordHash = await hashPassword(newPassword);

  const [updatedUser] = await db
    .update(user)
    .set({
      passwordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
      updatedAt: new Date(),
    })
    .where(eq(user.id, foundUser.id))
    .returning();

  return { success: true, user: updatedUser };
}

export async function resendEmailVerification(
  db: DrizzleD1Database<typeof schema>,
  email: string,
  baseUrl: string,
): Promise<{ success: boolean; error?: string }> {
  const foundUser = await getUserByEmail(db, email);

  if (!foundUser) {
    return { success: false, error: "User not found" };
  }

  if (foundUser.emailVerified) {
    return { success: false, error: "Email already verified" };
  }

  const emailVerificationToken = generateEmailVerificationToken();
  const emailVerificationExpires = getEmailVerificationExpiry();

  await db
    .update(user)
    .set({
      emailVerificationToken,
      emailVerificationExpires,
      updatedAt: new Date(),
    })
    .where(eq(user.id, foundUser.id));

  const verificationLink = `${baseUrl}/verify-email?token=${emailVerificationToken}`;
  
  await sendEmailVerification({
    name: foundUser.name,
    email: foundUser.email,
    verificationLink,
  });

  return { success: true };
}

export async function logLoginAttempt(
  db: DrizzleD1Database<typeof schema>,
  userId: number,
  success: boolean,
  metadata: { ipAddress?: string; userAgent?: string },
): Promise<void> {
  await db.insert(loginLog).values({
    userId,
    success,
    ipAddress: metadata.ipAddress,
    userAgent: metadata.userAgent,
  });
}

export async function getRecentLoginAttempts(
  db: DrizzleD1Database<typeof schema>,
  userId: number,
  hours: number = 1,
): Promise<typeof loginLog.$inferSelect[]> {
  const since = new Date();
  since.setHours(since.getHours() - hours);

  return await db
    .select()
    .from(loginLog)
    .where(
      and(
        eq(loginLog.userId, userId),
        gt(loginLog.createdAt, since)
      )
    )
    .orderBy(loginLog.createdAt);
}
