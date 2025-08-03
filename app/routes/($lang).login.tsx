import { data, redirect } from "react-router";
import { z } from "zod";

import type { Route } from "./+types/($lang).login";

import { createUserSession, getUserId } from "~/auth.server";
import { PageContext } from "~/features/login/context/page-context";
import { ContentLoginPage } from "~/features/login/page";
import { authenticateUser } from "~/user.server";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
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

  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return data(
      { error: "Please check your email and password" },
      { status: 400 },
    );
  }

  const { email, password } = result.data;
  const { db } = context;

  try {
    const user = await authenticateUser(db, email, password);

    if (!user) {
      return data({ error: "Invalid email or password" }, { status: 400 });
    }

    return createUserSession(user.id, "/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    return data(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign In - NARA" },
    { name: "description", content: "Sign in to your NARA account" },
  ];
}

export default function Login({ actionData }: Route.ComponentProps) {
  return (
    <PageContext.Provider value={{ ...actionData }}>
      <ContentLoginPage />
    </PageContext.Provider>
  );
}
