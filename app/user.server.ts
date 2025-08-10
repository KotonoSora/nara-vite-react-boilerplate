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
import type { OAuthUserInfo, OAuthProvider } from "~/lib/auth/oauth.server";

const { user, loginLog, oauthAccount } = schema;

export type User = typeof user.$inferSelect;
export type CreateUserData = {
  email: string;
  password?: string; // Optional for OAuth users
  name: string;
  avatar?: string;
  role?: "admin" | "user";
  createdBy?: number | null; // Track which admin created this user
};

export async function createUser(
  db: DrizzleD1Database<typeof schema>,
  userData: CreateUserData,
  options: { sendVerificationEmail?: boolean; baseUrl?: string } = {},
): Promise<User> {
  const passwordHash = userData.password ? await hashPassword(userData.password) : null;
  const emailVerificationToken = generateEmailVerificationToken();
  const emailVerificationExpires = getEmailVerificationExpiry();

  const [newUser] = await db
    .insert(user)
    .values({
      email: userData.email,
      passwordHash,
      name: userData.name,
      avatar: userData.avatar,
      role: userData.role || "user",
      createdBy: userData.createdBy,
      emailVerificationToken,
      emailVerificationExpires,
      // OAuth users are considered verified
      emailVerified: !userData.password,
    })
    .returning();

  // Send verification email if requested and user has password (not OAuth)
  if (options.sendVerificationEmail && options.baseUrl && userData.password) {
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

    // Check if user has a password (not OAuth-only user)
    if (!foundUser.passwordHash) {
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
      await logLoginAttempt(db, foundUser.id, success, { ...metadata, provider: null });
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
  metadata: { ipAddress?: string; userAgent?: string; provider?: string | null },
): Promise<void> {
  await db.insert(loginLog).values({
    userId,
    success,
    ipAddress: metadata.ipAddress,
    userAgent: metadata.userAgent,
    provider: metadata.provider,
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

/**
 * OAuth-specific functions
 */

export async function findOrCreateOAuthUser(
  db: DrizzleD1Database<typeof schema>,
  oauthUserInfo: OAuthUserInfo,
  metadata?: { ipAddress?: string; userAgent?: string },
): Promise<User> {
  // First, try to find existing user by email
  let existingUser = await getUserByEmail(db, oauthUserInfo.email);

  if (!existingUser) {
    // Create new user for OAuth
    existingUser = await createUser(db, {
      email: oauthUserInfo.email,
      name: oauthUserInfo.name,
      avatar: oauthUserInfo.avatar_url,
      role: "user",
    });
  }

  // Check if OAuth account already exists
  const [existingOAuthAccount] = await db
    .select()
    .from(oauthAccount)
    .where(
      and(
        eq(oauthAccount.provider, oauthUserInfo.provider),
        eq(oauthAccount.providerAccountId, oauthUserInfo.id)
      )
    )
    .limit(1);

  if (!existingOAuthAccount) {
    // Link OAuth account to user
    await db
      .insert(oauthAccount)
      .values({
        userId: existingUser.id,
        provider: oauthUserInfo.provider,
        providerAccountId: oauthUserInfo.id,
      });
  } else {
    // Update existing OAuth account
    await db
      .update(oauthAccount)
      .set({ updatedAt: new Date() })
      .where(eq(oauthAccount.id, existingOAuthAccount.id));
  }

  // Update user's last login and avatar if needed
  const updateData: any = { 
    lastLoginAt: new Date(),
    updatedAt: new Date(),
  };

  if (oauthUserInfo.avatar_url && !existingUser.avatar) {
    updateData.avatar = oauthUserInfo.avatar_url;
  }

  await db
    .update(user)
    .set(updateData)
    .where(eq(user.id, existingUser.id));

  // Log the OAuth login
  if (metadata) {
    await logLoginAttempt(db, existingUser.id, true, {
      ...metadata,
      provider: oauthUserInfo.provider,
    });
  }

  return { ...existingUser, ...updateData };
}

export async function getUserOAuthAccounts(
  db: DrizzleD1Database<typeof schema>,
  userId: number,
): Promise<typeof oauthAccount.$inferSelect[]> {
  return await db
    .select()
    .from(oauthAccount)
    .where(eq(oauthAccount.userId, userId))
    .orderBy(oauthAccount.createdAt);
}

export async function unlinkOAuthAccount(
  db: DrizzleD1Database<typeof schema>,
  userId: number,
  provider: OAuthProvider,
): Promise<boolean> {
  const result = await db
    .delete(oauthAccount)
    .where(
      and(
        eq(oauthAccount.userId, userId),
        eq(oauthAccount.provider, provider)
      )
    );

  return (result as any)?.changes > 0 || (result as any)?.meta?.changes > 0;
}

/**
 * User Management Functions
 */

export async function deleteUser(
  db: DrizzleD1Database<typeof schema>,
  userId: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const foundUser = await getUserById(db, userId);
    
    if (!foundUser) {
      return { success: false, error: "User not found" };
    }

    // Delete user - cascading deletes will handle related records
    await db
      .delete(user)
      .where(eq(user.id, userId));

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

export async function getUsersCreatedBy(
  db: DrizzleD1Database<typeof schema>,
  adminId: number,
): Promise<User[]> {
  return await db
    .select()
    .from(user)
    .where(eq(user.createdBy, adminId))
    .orderBy(user.createdAt);
}

export async function updateUserByAdmin(
  db: DrizzleD1Database<typeof schema>,
  adminId: number,
  targetUserId: number,
  updateData: {
    name?: string;
    email?: string;
    avatar?: string;
    role?: "admin" | "user";
  },
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // Check if admin created this user
    const targetUser = await getUserById(db, targetUserId);
    
    if (!targetUser) {
      return { success: false, error: "User not found" };
    }

    if (targetUser.createdBy !== adminId) {
      return { success: false, error: "You can only modify users you created" };
    }

    const [updatedUser] = await db
      .update(user)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(user.id, targetUserId))
      .returning();

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error: "Failed to update user" };
  }
}

export async function deleteUserByAdmin(
  db: DrizzleD1Database<typeof schema>,
  adminId: number,
  targetUserId: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if admin created this user
    const targetUser = await getUserById(db, targetUserId);
    
    if (!targetUser) {
      return { success: false, error: "User not found" };
    }

    if (targetUser.createdBy !== adminId) {
      return { success: false, error: "You can only delete users you created" };
    }

    await db
      .delete(user)
      .where(eq(user.id, targetUserId));

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}
