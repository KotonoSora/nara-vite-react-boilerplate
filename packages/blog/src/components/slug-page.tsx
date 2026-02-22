import { getIntlLocaleByLanguage } from "@kotonosora/i18n";
import { useI18n } from "@kotonosora/i18n-react";
import { MDXProvider } from "@mdx-js/react";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";

import type { SlugBlogLoaderData } from "../types/mdx";

import { mdxComponents } from "../config/mdx-components";
import { getMdxModules } from "../utils/mdx-loader";

export function SlugPage() {
  const { t, language } = useI18n();
  const locale = getIntlLocaleByLanguage(language);
  const loaderData = useLoaderData<SlugBlogLoaderData>();
  const { frontmatter, slug, modulePath, loading } = loaderData || {};
  const { title, description, tags, author, date } = frontmatter || {};
  const [ContentComponent, setContentComponent] =
    useState<React.ComponentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      if (!modulePath) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      const modules = getMdxModules();

      for (const [path, loader] of Object.entries(modules)) {
        const fileName = path
          .split("/")
          .pop()
          ?.replace(/\.(mdx?|md)$/, "");

        const isDirectMatch = fileName === slug;
        const isIndexMatch = fileName === "index" && path.includes(`/${slug}/`);

        if (isDirectMatch || isIndexMatch) {
          try {
            const module = await loader();
            if (isMounted) {
              setContentComponent(() => module.default || null);
              setIsLoading(false);
            }
          } catch (error) {
            console.error(
              `Error loading MDX content for slug "${slug}":`,
              error,
            );
            if (isMounted) {
              setIsLoading(false);
            }
          }
          return;
        }
      }

      if (isMounted) {
        console.warn(`No MDX module found for slug "${slug}"`);
        setIsLoading(false);
      }
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, [slug, modulePath]);

  if (!frontmatter) {
    return (
      <section className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 max-w-7xl">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Post not found</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 max-w-7xl">
      {/* Custom meta tags with slug blog content */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={tags?.join(", ")} />
      <meta name="author" content={author} />

      <article className="prose prose-slate dark:prose-invert max-w-none">
        {/* Slug blog header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          {description && (
            <p className="text-xl text-muted-foreground">{description}</p>
          )}
          <div className="flex gap-4 text-sm text-muted-foreground mt-4">
            {author && (
              <span>
                {t("blog.card.by")}&nbsp;{author}
              </span>
            )}
            {date && (
              <time dateTime={date}>
                {new Date(date).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
          </div>
          {tags && tags.length > 0 && (
            <div className="flex gap-2 mt-4">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Slug blog content */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="space-y-4">
              <p className="text-muted-foreground">Loading content...</p>
              {loading && loading.total > 0 && (
                <div className="space-y-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${(loading.loaded / loading.total) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {loading.loaded} / {loading.total}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : ContentComponent ? (
          <MDXProvider components={mdxComponents}>
            <ContentComponent />
          </MDXProvider>
        ) : null}
      </article>
    </section>
  );
}
