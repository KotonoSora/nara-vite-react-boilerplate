import { user } from "~/database/schema/user";

export type UserSchema = typeof user.$inferSelect;

export type CreateUserDataSchema = {
  email: string;
  password: string;
  name: string;
  role?: "admin" | "user";
};
