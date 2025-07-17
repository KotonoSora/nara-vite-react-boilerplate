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

import type { Route } from "./+types/root";

import { Toaster } from "~/components/ui/sonner";
import { themeSessionResolver } from "~/sessions.server";
import { I18nProvider } from "~/lib/i18n";

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

export async function loader({ request }: Route.LoaderArgs) {
  const { getTheme } = await themeSessionResolver(request);
  const url = new URL(request.url);
  
  // Import i18n utilities
  const { getLanguageFromPath, detectLanguageFromAcceptLanguage, DEFAULT_LANGUAGE } = await import("~/lib/i18n");
  const { getLanguageSession } = await import("~/sessions/language.server");
  
  // Detect language from URL, cookie, or browser preference
  const pathLanguage = getLanguageFromPath(url.pathname);
  const languageSession = await getLanguageSession(request);
  const cookieLanguage = languageSession.getLanguage();
  const acceptLanguage = detectLanguageFromAcceptLanguage(request.headers.get("Accept-Language") || "");
  
  // Priority: URL > Cookie > Accept-Language > Default
  const language = pathLanguage || cookieLanguage || acceptLanguage || DEFAULT_LANGUAGE;
  
  return {
    theme: getTheme(),
    language,
  };
}

function InnerLayout({
  ssrTheme,
  language,
  children,
}: {
  ssrTheme: boolean;
  language: string;
  children: React.ReactNode;
}) {
  const [theme] = useTheme();

  return (
    <html lang={language} className={clsx("font-sans", theme)}>
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
      <InnerLayout ssrTheme={Boolean(data?.theme)} language={data?.language || "en"}>
        {children}
      </InnerLayout>
    </ThemeProvider>
  );
}

export default function App() {
  const data = useRouteLoaderData<typeof loader>("root");
  
  return (
    <I18nProvider initialLanguage={data?.language as any || "en"}>
      <Outlet />
    </I18nProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  // Try to use translations, but fallback to English if context is not available
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;
  
  try {
    // Try to import and use translations
    const { getTranslation } = require("~/lib/i18n/translations");
    
    if (isRouteErrorResponse(error)) {
      message = error.status === 404 ? "404" : getTranslation('en', 'common.error');
      details =
        error.status === 404
          ? getTranslation('en', 'errors.pageNotFound')
          : error.statusText || getTranslation('en', 'errors.unexpectedError');
    } else if (import.meta.env.DEV && error && error instanceof Error) {
      details = error.message;
      stack = error.stack;
    } else {
      details = getTranslation('en', 'errors.unexpectedError');
    }
  } catch {
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
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
