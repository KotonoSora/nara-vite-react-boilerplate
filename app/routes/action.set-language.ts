import type { Route } from "./+types/action.set-language";
import { redirect } from "react-router";
import { getLanguageSession } from "~/sessions/language.server";
import { isSupportedLanguage } from "~/lib/i18n";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const language = formData.get("language");

  if (typeof language === "string" && isSupportedLanguage(language)) {
    const languageSession = await getLanguageSession(request);
    languageSession.setLanguage(language);

    const cookie = await languageSession.commit();

    // Get the current URL and preserve the path
    const url = new URL(request.url);
    const referer = request.headers.get("referer");
    const redirectTo = referer || url.pathname;

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