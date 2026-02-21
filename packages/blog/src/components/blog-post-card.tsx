import { getIntlLocaleByLanguage } from "@kotonosora/i18n";
import { useI18n } from "@kotonosora/i18n-react";
import { Link } from "react-router";

import type { BlogPostCardProps } from "../types/mdx";

import { formatDate } from "../utils/format-date";

export function BlogPostCard({ post }: BlogPostCardProps) {
  const { t, language } = useI18n();
  const locale = getIntlLocaleByLanguage(language);
  const postUrl = post.url ?? `/blog/${post.slug}`;
  const isExternal = Boolean(post.url);

  return (
    <article className="flex flex-col p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
      <header className="mb-4">
        {isExternal ? (
          <a
            href={postUrl}
            className="text-2xl font-semibold hover:text-primary transition-colors"
          >
            {post.frontmatter.title}
          </a>
        ) : (
          <Link
            to={postUrl}
            className="text-2xl font-semibold hover:text-primary transition-colors"
          >
            {post.frontmatter.title}
          </Link>
        )}
        {post.frontmatter.date && (
          <time
            dateTime={post.frontmatter.date}
            className="block text-sm text-muted-foreground mt-2"
          >
            {formatDate(post.frontmatter.date, locale)}
          </time>
        )}
      </header>

      {post.frontmatter.description && (
        <p className="text-muted-foreground mb-4 grow">
          {post.frontmatter.description}
        </p>
      )}

      {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.frontmatter.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 text-xs rounded-full bg-muted">
              {tag}
            </span>
          ))}
        </div>
      )}

      <footer className="flex items-center justify-between mt-auto pt-4 border-t">
        {post.frontmatter.author && (
          <span className="text-sm text-muted-foreground">
            {t("blog.card.by")} {post.frontmatter.author}
          </span>
        )}
        {isExternal ? (
          <a
            href={postUrl}
            className="text-sm font-medium text-primary hover:underline"
          >
            {t("blog.card.readMore")} →
          </a>
        ) : (
          <Link
            to={postUrl}
            className="text-sm font-medium text-primary hover:underline"
          >
            {t("blog.card.readMore")} →
          </Link>
        )}
      </footer>
    </article>
  );
}
