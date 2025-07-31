import { data, redirect } from "react-router";

import type { Route } from "./+types/action.set-language";

import { getLanguageSession } from "~/language.server";
import {
  addLanguageToPath,
  getLanguageFromPath,
  isSupportedLanguage,
} from "~/lib/i18n";

export function loader({ request }: Route.LoaderArgs) {
  return data(
    {},
    {
      status: 302,
      headers: {
        Location: request.headers.get("referer") || "/",
      },
    },
  );
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const language = formData.get("language");

  if (typeof language === "string" && isSupportedLanguage(language)) {
    const languageSession = await getLanguageSession(request);
    languageSession.setLanguage(language);

    const cookie = await languageSession.commit();

    // Get the current URL from referer and update with new language
    const referer = request.headers.get("referer");
    let redirectTo = referer || "/";

    if (referer) {
      try {
        const refererUrl = new URL(referer);
        const currentPath = refererUrl.pathname;

        // Only modify the path if it already contains a language segment
        const existingLanguage = getLanguageFromPath(currentPath);
        if (existingLanguage) {
          // Transform the pathname to include the new language
          redirectTo = addLanguageToPath(currentPath, language);
        } else {
          // No language in current path, keep original path
          redirectTo = currentPath;
        }
      } catch {
        // If URL parsing fails, fallback to referer or root
        redirectTo = referer || "/";
      }
    }

    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": cookie,
      },
    });
  }

  // If invalid language, just redirect back
  const referer = request.headers.get("referer");
  return redirect(referer || "/");
}
