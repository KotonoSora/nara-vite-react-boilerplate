import { eq } from "drizzle-orm";

import * as schema from "~/database/schema";
import { hashPassword, verifyPassword } from "~/lib/auth/config";
import type { Database, User, CreateUserData } from "~/types";

const { user } = schema;

export async function createUser(
  db: Database,
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
  db: Database,
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
  db: Database,
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
  db: Database,
  email: string,
  password: string,
): Promise<User | null> {
  const foundUser = await getUserByEmail(db, email);

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

  return foundUser;
}
