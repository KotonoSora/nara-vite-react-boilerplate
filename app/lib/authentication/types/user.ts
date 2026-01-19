import type { User } from "~/database/schema";

export type CreateUserDataSchema = {
  email: string;
  password: string;
  name: string;
  role?: "admin" | "user";
};

export type EmailVerificationResultSchema =
  | { success: true; user: User }
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
