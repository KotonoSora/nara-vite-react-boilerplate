import type { Route } from "./+types/($lang).admin";

import { requireUserId } from "~/auth.server";
import { PageContext } from "~/features/admin/context/page-context";
import { ContentAdminPage } from "~/features/admin/page";
import { getLanguageSession } from "~/language.server";
import {
  DEFAULT_LANGUAGE,
  getLanguageFromPath,
} from "~/lib/i18n/config";
import { getTranslation } from "~/lib/i18n/translations";
import { getUserById } from "~/user.server";

export async function loader({ request, context, params }: Route.LoaderArgs) {
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

  // Handle language detection
  const url = new URL(request.url);
  const pathLanguage = getLanguageFromPath(url.pathname);
  const languageSession = await getLanguageSession(request);
  const cookieLanguage = languageSession.getLanguage();

  // Priority: URL param > Cookie > Default
  const language = pathLanguage || cookieLanguage || DEFAULT_LANGUAGE;

  return { user, language };
}

export function meta({ data }: Route.MetaArgs): ReturnType<Route.MetaFunction> {
  if (!data) {
    return [
      { title: "Admin Panel - NARA" },
      { name: "description", content: "Administrative dashboard" },
    ];
  }

  const t = (key: string) => getTranslation(data.language, key as any);

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
