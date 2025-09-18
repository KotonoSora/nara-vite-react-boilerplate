import clsx from "clsx";
import { lazy, Suspense, useEffect, useState } from "react";
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

import type { SupportedLanguage } from "~/lib/i18n/config";
import type { MiddlewareFunction } from "react-router";
import type { Route } from "./+types/root";

import appCssUrl from "~/app.css?url";
import { DemoTag } from "~/features/shared/components/demo-tag";
import { AuthProvider } from "~/lib/auth/provider";
import { DEFAULT_LANGUAGE, isRTLLanguage } from "~/lib/i18n/config";
import { I18nProvider } from "~/lib/i18n/provider";
import { AuthContext, authMiddleware } from "~/middleware/auth";
import { I18nContext, i18nMiddleware } from "~/middleware/i18n";
import { ThemeContext, themeMiddleware } from "~/middleware/theme";
import { cancelIdleCallback, scheduleIdleCallback } from "~/utils.client";

// Lazy-load notifications to avoid pulling them into the initial bundle
const ToasterLazy = lazy(async () => ({
  default: (await import("~/components/ui/sonner")).Toaster,
}));

export const links: Route.LinksFunction = () => {
  const links: ReturnType<Route.LinksFunction> = [
    { rel: "preload", href: appCssUrl, as: "style" },
    { rel: "stylesheet", href: appCssUrl },
    { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
  ];

  // Preload Inter only in production to avoid dev warnings and keep fast paint in prod
  if (import.meta.env.PROD) {
    links.unshift({
      rel: "preload",
      href: "/fonts/Inter.woff2",
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous",
    });
  }

  return links;
};

export const middleware: MiddlewareFunction[] = [
  i18nMiddleware,
  themeMiddleware,
  authMiddleware,
];

export async function loader({ request, context }: Route.LoaderArgs) {
  const { language } = context.get(I18nContext);
  const { theme } = context.get(ThemeContext);
  const { user } = context.get(AuthContext);
  return { theme, language, user };
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
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    // Defer notifications to idle to keep hydration fast
    const id = scheduleIdleCallback(() => setClientReady(true));
    return () => cancelIdleCallback(id);
  }, []);

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
        {clientReady ? (
          <Suspense fallback={null}>
            <ToasterLazy />
          </Suspense>
        ) : null}
        {import.meta.env.DEV && <DemoTag />}
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
        <AuthProvider user={data?.user ?? null}>
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
