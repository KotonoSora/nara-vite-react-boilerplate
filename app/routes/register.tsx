import { data, redirect } from "react-router";
import { z } from "zod";

import type { Route } from "./+types/register";

import { createUserSession, getUserId } from "~/auth.server";
import { RegisterForm } from "~/features/auth/components/register-form";
import {
  createUser,
  getUserByEmail,
} from "~/features/auth/services/user.server";

const registerSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export async function loader({ request }: Route.LoaderArgs) {
  // Redirect if already logged in
  const userId = await getUserId(request);
  if (userId) {
    throw redirect("/dashboard");
  }

  return {};
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();

  const result = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!result.success) {
    const firstError = result.error.issues[0];
    return data(
      { error: firstError?.message || "Please check your input" },
      { status: 400 },
    );
  }

  const { name, email, password } = result.data;
  const { db } = context;

  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(db, email);
    if (existingUser) {
      return data(
        { error: "An account with this email already exists" },
        { status: 400 },
      );
    }

    // Create new user
    const newUser = await createUser(db, {
      name,
      email,
      password,
      role: "user",
    });

    return createUserSession(newUser.id, "/dashboard");
  } catch (error) {
    console.error("Registration error:", error);
    return data(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

export function meta(): ReturnType<Route.MetaFunction> {
  return [
    { title: "Sign Up - NARA" },
    { name: "description", content: "Create a new NARA account" },
  ];
}

export default function Register({ actionData }: Route.ComponentProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <RegisterForm error={actionData?.error} isSubmitting={false} />
    </div>
  );
}
