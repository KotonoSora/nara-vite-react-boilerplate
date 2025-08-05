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

import "~/app.css";

export const links: Route.LinksFunction = () => [
  {
    rel: "preload",
    href: "/fonts/Inter.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
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

  // Preload translations for the detected language and default language on server
  if (typeof window === "undefined") {
    const { preloadTranslations } = await import("~/lib/i18n/translations");
    try {
      await Promise.all([
        preloadTranslations(language),
        language !== DEFAULT_LANGUAGE ? preloadTranslations(DEFAULT_LANGUAGE) : Promise.resolve(),
      ]);
    } catch (error) {
      // Non-blocking - continue if translation loading fails
      console.warn("Failed to preload translations:", error);
    }
  }

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
  const isDev = import.meta.env.DEV;

  // Determine error type and message
  const isRouteError = isRouteErrorResponse(error);
  const is404 = isRouteError && error.status === 404;
  
  let message: string;
  let details: string;
  let stack: string | undefined;

  if (is404) {
    message = "404";
    details = "The requested page could not be found.";
  } else if (isRouteError) {
    message = "Error";
    details = error.statusText || "An unexpected error occurred.";
  } else if (isDev && error instanceof Error) {
    message = "Development Error";
    details = error.message;
    stack = error.stack;
  } else {
    message = "Oops!";
    details = "An unexpected error occurred.";
  }

  // In development, log the error
  if (isDev) {
    console.error("ErrorBoundary:", error);
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h2 className="text-2xl font-bold mb-4">{message}</h2>
      <p className="text-muted-foreground mb-4">{details}</p>
      {stack && isDev && (
        <details className="mt-4">
          <summary className="cursor-pointer font-semibold mb-2">Stack Trace</summary>
          <pre className="w-full p-4 overflow-x-auto bg-muted rounded-md text-sm">
            <code>{stack}</code>
          </pre>
        </details>
      )}
    </main>
  );
}
