import type { Route } from "./+types/($lang).admin";

import { getUserId, logout } from "~/auth.server";
import { PageContext } from "~/features/admin/context/page-context";
import { ContentAdminPage } from "~/features/admin/page";
import { isAdminLoaderData, isAdminUser } from "~/features/admin/utils/helper";
import { hasMetaFields } from "~/features/dashboard/utils/helper";
import { createTranslationFunction } from "~/lib/i18n";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";
import { getUserById } from "~/user.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  try {
    const language = await resolveRequestLanguage(request);
    const t = createTranslationFunction(language);
    const userId = await getUserId(request);

    if (!userId) {
      return logout(request);
    }
    const { db } = context;
    const user = await getUserById(db, userId);

    if (!user || !isAdminUser(user)) {
      return logout(request);
    }

    return {
      user,
      pageTitle: t("admin.meta.title"),
      pageDescription: t("admin.meta.description"),
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (hasMetaFields(loaderData)) {
    const { pageTitle, pageDescription } = loaderData;
    return [
      { title: pageTitle },
      { name: "description", content: pageDescription },
    ];
  }

  return [
    { title: "Admin Panel - NARA" },
    { name: "description", content: "Administrative dashboard" },
  ];
}

export default function Admin({ loaderData }: Route.ComponentProps) {
  if (!isAdminLoaderData(loaderData)) {
    return null;
  }

  const { user } = loaderData;

  return (
    <PageContext.Provider value={{ user }}>
      <ContentAdminPage />
    </PageContext.Provider>
  );
}
