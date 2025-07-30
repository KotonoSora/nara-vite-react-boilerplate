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
import { getLanguageSession } from "~/language.server";
import {
  DEFAULT_LANGUAGE,
  detectLanguageFromAcceptLanguage,
  getLanguageFromPath,
  getTranslation,
  I18nProvider,
  isRTLLanguage,
  isSupportedLanguage,
} from "~/lib/i18n";
import { themeSessionResolver } from "~/sessions.server";

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

  // Detect language from URL, cookie, or browser preference
  const pathLanguage = getLanguageFromPath(url.pathname);
  const languageSession = await getLanguageSession(request);
  const cookieLanguage = languageSession.getLanguage();
  const acceptLanguage = detectLanguageFromAcceptLanguage(
    request.headers.get("Accept-Language") || "",
  );

  // Priority: URL > Cookie > Accept-Language > Default
  const language =
    pathLanguage || cookieLanguage || acceptLanguage || DEFAULT_LANGUAGE;

  return {
    theme: getTheme(),
    language,
  };
}

function InnerLayout({
  ssrTheme,
  ssrLanguage,
  children,
}: {
  ssrTheme: boolean;
  ssrLanguage: string;
  children: React.ReactNode;
}) {
  const [theme] = useTheme();
  const language = isSupportedLanguage(ssrLanguage)
    ? ssrLanguage
    : DEFAULT_LANGUAGE;
  const direction = isRTLLanguage(language) ? "rtl" : "ltr";

  return (
    <html
      lang={ssrLanguage || DEFAULT_LANGUAGE}
      dir={direction}
      className={clsx("font-sans", theme)}
    >
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
        <InnerLayout
          ssrTheme={Boolean(data?.theme)}
          ssrLanguage={data?.language || DEFAULT_LANGUAGE}
        >
          {children}
        </InnerLayout>
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
      message =
        error.status === 404 ? "404" : getTranslation("en", "common.error");
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
