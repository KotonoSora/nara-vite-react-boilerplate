import type { Route } from "./+types/($lang).admin";

import { requireUserId } from "~/auth.server";
import { PageContext } from "~/features/admin/context/page-context";
import { ContentAdminPage } from "~/features/admin/page";
import { detectLanguageAndLoadTranslations } from "~/lib/i18n/loader-utils";
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

  // Enhanced language detection and translation loading
  const { language, t } = await detectLanguageAndLoadTranslations(request);

  return { user, language, t };
}

export function meta({ data }: Route.MetaArgs): ReturnType<Route.MetaFunction> {
  if (!data) {
    return [
      { title: "Admin Panel - NARA" },
      { name: "description", content: "Administrative dashboard" },
    ];
  }

  const { t } = data as any;

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
