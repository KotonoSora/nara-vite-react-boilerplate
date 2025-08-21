import type { getUserById, User } from "~/user.server";
import type { AdminLoaderData } from "../types/types";

/**
 * Check if the loader data has meta fields
 * @param data - The loader data to check
 * @returns True if the loader data has meta fields, false otherwise
 */
export function hasMetaFields(
  data: unknown,
): data is { pageTitle: string; pageDescription: string } {
  return (
    data !== null &&
    typeof data === "object" &&
    "pageTitle" in data &&
    "pageDescription" in data &&
    typeof (data as any).pageTitle === "string" &&
    typeof (data as any).pageDescription === "string"
  );
}

/**
 * Check if the user is an admin
 * @param user - The user to check
 * @returns True if the user is an admin, false otherwise
 */
export function isAdminUser(
  user: NonNullable<Awaited<ReturnType<typeof getUserById>>>,
): user is User {
  return user.role === "admin";
}

/**
 * Check if the loader data is for the admin page
 * @param data - The loader data to check
 * @returns True if the loader data is for the admin page, false otherwise
 */
export function isAdminLoaderData(data: unknown): data is AdminLoaderData {
  return data !== null && typeof data === "object" && "user" in data;
}
