import type { Route } from "./+types/($lang).admin";

import { PageContext } from "~/features/admin/context/page-context";
import { ContentAdminPage } from "~/features/admin/page";
import { getLanguageSession } from "~/language.server";
import {
  DEFAULT_LANGUAGE,
  getLanguageFromPath,
  getTranslation,
} from "~/lib/i18n";
import { getUserPermissions } from "~/lib/auth/permissions.server";
import { applyAdminSecurity, logSecurityAccess } from "~/lib/auth/route-security.server";

export async function loader({ request, context, params }: Route.LoaderArgs) {
  const { db } = context;

  // Apply admin security with high-level authentication
  const authResult = await applyAdminSecurity(request, db);

  // Get user's permissions for display
  const permissions = await getUserPermissions(db, authResult.userId);

  // Log security access
  await logSecurityAccess(db, authResult, request, "/admin", "high");

  // Handle language detection
  const url = new URL(request.url);
  const pathLanguage = getLanguageFromPath(url.pathname);
  const languageSession = await getLanguageSession(request);
  const cookieLanguage = languageSession.getLanguage();

  // Priority: URL param > Cookie > Default
  const language = pathLanguage || cookieLanguage || DEFAULT_LANGUAGE;

  return { 
    user: authResult.user, 
    language, 
    permissions,
    authFlow: authResult.flow,
    securityLevel: "high"
  };
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
