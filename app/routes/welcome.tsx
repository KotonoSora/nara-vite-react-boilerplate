import type { Route } from "./+types/welcome";

import * as schema from "~/database/schema";

import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "D1 Demo" },
    { name: "description", content: "D1 Demo Screen!" },
  ];
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  let name = formData.get("name");
  let email = formData.get("email");
  if (typeof name !== "string" || typeof email !== "string") {
    return { guestBookError: "Name and email are required" };
  }

  name = name.trim();
  email = email.trim();
  if (!name || !email) {
    return { guestBookError: "Name and email are required" };
  }

  try {
    await context.db.insert(schema.guestBook).values({ name, email });
  } catch (error) {
    return { guestBookError: "Error adding to guest book" };
  }
}

export async function loader({ context }: Route.LoaderArgs) {
  const guestBook = await context.db.query.guestBook.findMany({
    columns: {
      id: true,
      name: true,
    },
  });

  return {
    guestBook,
    message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
  };
}

export default function WelcomeDemo({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  return (
    <Welcome
      guestBook={loaderData.guestBook}
      guestBookError={actionData?.guestBookError}
      message={loaderData.message}
    />
  );
}
