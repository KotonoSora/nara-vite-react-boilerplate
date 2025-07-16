import { eq } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";

import { hashPassword, verifyPassword } from "~/lib/auth";
import * as schema from "~/database/schema";

const { user } = schema;

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
): Promise<User> {
  const passwordHash = await hashPassword(userData.password);

  const [newUser] = await db
    .insert(user)
    .values({
      email: userData.email,
      passwordHash,
      name: userData.name,
      role: userData.role || "user",
    })
    .returning();

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
): Promise<User | null> {
  const foundUser = await getUserByEmail(db, email);
  
  if (!foundUser) {
    return null;
  }

  const isValidPassword = await verifyPassword(password, foundUser.passwordHash);
  
  if (!isValidPassword) {
    return null;
  }

  return foundUser;
}