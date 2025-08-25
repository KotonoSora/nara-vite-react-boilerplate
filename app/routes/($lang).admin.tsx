import { data, redirect } from "react-router";

import type { SupportedLanguage } from "~/lib/i18n";
import type { Route } from "./+types/($lang).admin";

import { getUserId } from "~/auth.server";
import { PageContext } from "~/features/admin/context/page-context";
import { ContentAdminPage } from "~/features/admin/page";
import { createTranslationFunction } from "~/lib/i18n";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";
import { getUserById } from "~/user.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  try {
    const { db } = context;
    const language: SupportedLanguage = await resolveRequestLanguage(request);
    const t = createTranslationFunction(language);
    const userId = await getUserId(request);
    if (!userId) {
      return redirect("/");
    }
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
  } catch (error) {
    console.error("Admin page error:", error);

    return data({ error: "Failed to admin page data" }, { status: 500 });
  }
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
