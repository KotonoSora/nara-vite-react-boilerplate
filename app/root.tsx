import clsx from "clsx";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "react-router";
import {
  PreventFlashOnWrongTheme,
  Theme,
  ThemeProvider,
  useTheme,
} from "remix-themes";

import type { SupportedLanguage } from "~/lib/i18n";
import type { Route } from "./+types/root";

import appCssUrl from "~/app.css?url";
import { getUserId } from "~/auth.server";
import { Toaster } from "~/components/ui/sonner";
import { getLanguageSession } from "~/language.server";
import { AuthProvider } from "~/lib/auth";
import {
  DEFAULT_LANGUAGE,
  detectLanguageFromAcceptLanguage,
  getLanguageFromPath,
  getTranslation,
  I18nProvider,
  isRTLLanguage,
} from "~/lib/i18n";
import { themeSessionResolver } from "~/sessions.server";
import { getUserById } from "~/user.server";

export const links: Route.LinksFunction = () => [
  {
    rel: "preload",
    href: "/fonts/Inter.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  { rel: "preload", href: appCssUrl, as: "style" },
  { rel: "stylesheet", href: appCssUrl, fetchPriority: "low" as const },
  { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
];

export async function loader({ request, context }: Route.LoaderArgs) {
  const { getTheme } = await themeSessionResolver(request);
  const url = new URL(request.url);

  // Detect language from URL, cookie, or browser preference
  const pathLanguage = getLanguageFromPath(url.pathname);
  const languageSession = await getLanguageSession(request);
  const cookieLanguage = languageSession.getLanguage();
  const acceptLanguage = detectLanguageFromAcceptLanguage(
    request.headers.get("Accept-Language") || "",
  );

  // Priority: URL > Cookie > Accept-Language > Default
  const language: SupportedLanguage =
    pathLanguage || cookieLanguage || acceptLanguage || DEFAULT_LANGUAGE;

  // Get current user if logged in and context is available
  const userId = await getUserId(request);
  let user = null;

  if (userId && context?.db) {
    try {
      user = await getUserById(context.db, userId);
    } catch (error) {
      // If user lookup fails, continue without user (they'll be logged out)
      console.error("Error loading user:", error);
    }
  }

  return {
    theme: getTheme(),
    language,
    user,
  };
}

function InnerLayout({
  ssrTheme,
  language,
  children,
}: {
  ssrTheme: boolean;
  language: SupportedLanguage;
  children: React.ReactNode;
}) {
  const [theme] = useTheme();
  const direction = isRTLLanguage(language) ? "rtl" : "ltr";

  return (
    <html lang={language} dir={direction} className={clsx("font-sans", theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={ssrTheme} />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <Toaster />
      </body>
    </html>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");

  return (
    <ThemeProvider
      specifiedTheme={data?.theme as Theme}
      themeAction="/action/set-theme"
    >
      <I18nProvider initialLanguage={data?.language || DEFAULT_LANGUAGE}>
        <AuthProvider user={data?.user || null}>
          <InnerLayout
            ssrTheme={Boolean(data?.theme)}
            language={data?.language || DEFAULT_LANGUAGE}
          >
            {children}
          </InnerLayout>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  try {
    if (isRouteErrorResponse(error)) {
      message = error.status === 404 ? "404" : getTranslation("en", "error");
      details =
        error.status === 404
          ? getTranslation("en", "errors.pageNotFound")
          : error.statusText || getTranslation("en", "errors.unexpectedError");
    } else if (import.meta.env.DEV && error && error instanceof Error) {
      details = error.message;
      stack = error.stack;
    } else {
      details = getTranslation("en", "errors.unexpectedError");
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary translation error:", error);
    }

    // Fallback to English if translations fail
    if (isRouteErrorResponse(error)) {
      message = error.status === 404 ? "404" : "Error";
      details =
        error.status === 404
          ? "The requested page could not be found."
          : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
      details = error.message;
      stack = error.stack;
    }
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h2>{message}</h2>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
