import type { Route } from "./+types/($lang).admin";

import { requireUserId } from "~/auth.server";
import { PageContext } from "~/features/admin/context/page-context";
import { ContentAdminPage } from "~/features/admin/page";
import { createTranslationFunction } from "~/lib/i18n";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";
import { getUserById } from "~/user.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const userId = await requireUserId(request);
  const { db } = context;

  const user = await getUserById(db, userId);

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  // Check if user is admin
  if (user.role !== "admin") {
    throw new Response("Access denied. Admin role required.", { status: 403 });
  }

  const language = await resolveRequestLanguage(request);

  return { user, language };
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) {
    return [
      { title: "Admin Panel - NARA" },
      { name: "description", content: "Administrative dashboard" },
    ];
  }

  const t = createTranslationFunction(loaderData.language);

  return [
    { title: t("admin.meta.title") },
    { name: "description", content: t("admin.meta.description") },
  ];
}

export default function Admin({ loaderData }: Route.ComponentProps) {
  return (
    <PageContext.Provider value={loaderData}>
      <ContentAdminPage />
    </PageContext.Provider>
  );
}
