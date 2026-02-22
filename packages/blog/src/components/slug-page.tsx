import { getIntlLocaleByLanguage } from "@kotonosora/i18n";
import { useI18n } from "@kotonosora/i18n-react";
import { useLoaderData } from "react-router";

import type { SlugBlogLoaderData } from "../types/mdx";

export function SlugPage() {
  const { t, language } = useI18n();
  const locale = getIntlLocaleByLanguage(language);
  const { content, frontmatter } = useLoaderData<SlugBlogLoaderData>();
  const { title, description, tags, author, date } = frontmatter;

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
        {content}
      </article>
    </section>
  );
}
