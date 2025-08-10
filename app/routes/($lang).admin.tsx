import type { Route } from "./+types/($lang).admin";

import { requireUserId } from "~/auth.server";
import { PageContext } from "~/features/admin/context/page-context";
import { ContentAdminPage } from "~/features/admin/page";
import { getLanguageSession } from "~/language.server";
import {
  DEFAULT_LANGUAGE,
  getLanguageFromPath,
  getTranslation,
} from "~/lib/i18n";
import { getUserById } from "~/user.server";
import { createPermissionChecker, getUserPermissions } from "~/lib/auth/permissions.server";

export async function loader({ request, context, params }: Route.LoaderArgs) {
  const userId = await requireUserId(request);
  const { db } = context;

  const user = await getUserById(db, userId);

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  // Enhanced permission check using RBAC
  const permissionChecker = createPermissionChecker(db);
  try {
    await permissionChecker.requireAdmin(userId);
  } catch (error) {
    throw new Response("Access denied. Admin permissions required.", { status: 403 });
  }

  // Get user's permissions for display
  const permissions = await getUserPermissions(db, userId);

  // Handle language detection
  const url = new URL(request.url);
  const pathLanguage = getLanguageFromPath(url.pathname);
  const languageSession = await getLanguageSession(request);
  const cookieLanguage = languageSession.getLanguage();

  // Priority: URL param > Cookie > Default
  const language = pathLanguage || cookieLanguage || DEFAULT_LANGUAGE;

  return { user, language, permissions };
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
