import { Link } from "react-router";

import { useTranslation } from "~/lib/i18n/hooks/use-translation";

interface BlogErrorProps {
  error?: {
    status?: number;
    statusText?: string;
    message?: string;
  };
}

export function BlogError({ error }: BlogErrorProps) {
  const t = useTranslation();
  const status = error?.status || 500;
  const isNotFound = status === 404;

  return (
    <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-24">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-muted-foreground">{status}</h1>
          <h2 className="text-3xl font-bold">
            {isNotFound
              ? t("blog.error.notFoundTitle")
              : t("blog.error.serverErrorTitle")}
          </h2>
        </div>

        <p className="text-lg text-muted-foreground">
          {isNotFound
            ? t("blog.error.notFoundMessage")
            : t("blog.error.serverErrorMessage")}
        </p>

        {error?.message && !isNotFound && (
          <details className="text-left p-4 bg-muted rounded-lg">
            <summary className="cursor-pointer font-medium">
              {t("blog.error.errorDetails")}
            </summary>
            <pre className="mt-2 text-sm overflow-x-auto">{error.message}</pre>
          </details>
        )}

        <div className="flex gap-4 justify-center pt-6">
          <Link
            to="/blog"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            {t("blog.error.viewAllPosts")}
          </Link>
          <Link
            to="/"
            className="px-6 py-3 border rounded-lg hover:bg-muted transition-colors font-medium"
          >
            {t("blog.error.goHome")}
          </Link>
        </div>
      </div>
    </section>
  );
}
