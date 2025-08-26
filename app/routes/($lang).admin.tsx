import { redirect } from "react-router";

import type { SupportedLanguage } from "~/lib/i18n";
import type { Route } from "./+types/($lang).admin";

import { PageContext } from "~/features/admin/context/page-context";
import { ContentAdminPage } from "~/features/admin/page";
import { createTranslationFunction } from "~/lib/i18n";

export async function loader({ context, request }: Route.LoaderArgs) {
  const { db } = context;

  const { resolveRequestLanguage } = await import(
    "~/lib/i18n/request-language.server"
  );

  const language: SupportedLanguage = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);

  const { getUserId } = await import("~/lib/auth/auth.server");

  const userId = await getUserId(request);
  if (!userId) {
    return redirect("/");
  }

  const { getUserById } = await import("~/lib/auth/user.server");

  const user = await getUserById(db, userId);
  if (!user) {
    return redirect("/");
  }
  // Check if user is admin
  if (user.role !== "admin") {
    return redirect("/");
  }

  return {
    title: t("admin.meta.title"),
    description: t("admin.meta.description"),
    user,
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (
    !("title" in loaderData) ||
    !("description" in loaderData) ||
    !loaderData.title ||
    !loaderData.description
  ) {
    return [
      { title: "Admin Panel" },
      { name: "description", content: "Administrative dashboard" },
    ];
  }

  return [
    { title: loaderData.title },
    { name: "description", content: loaderData.description },
  ];
}

export default function Admin({ loaderData }: Route.ComponentProps) {
  if (!loaderData || "error" in loaderData) return null;

  const { user } = loaderData;

  return (
    <PageContext.Provider value={{ user }}>
      <ContentAdminPage />
    </PageContext.Provider>
  );
}
