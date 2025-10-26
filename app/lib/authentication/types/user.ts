import { user } from "~/database/schema/user";

export type UserSchema = typeof user.$inferSelect;

export type CreateUserDataSchema = {
  email: string;
  password: string;
  name: string;
  role?: "admin" | "user";
};

export type EmailVerificationResultSchema =
  | { success: true; user: UserSchema }
  | {
      success: false;
      error: string;
      errorCode:
        | "INVALID_TOKEN"
        | "EXPIRED_TOKEN"
        | "ALREADY_VERIFIED"
        | "TOKEN_NOT_FOUND"
        | "DATABASE_ERROR";
    };
