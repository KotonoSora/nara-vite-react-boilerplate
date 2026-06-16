import { useI18n } from "@kotonosora/i18n-react";

import type { BlogFrontmatter } from "../types/mdx";

interface BlogHeaderProps {
  frontmatter: BlogFrontmatter;
  locale: string;
}

export function BlogHeader({ frontmatter, locale }: BlogHeaderProps) {
  const { t } = useI18n();
  const { title, description, tags, author, date } = frontmatter;

  return (
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
            <span key={tag} className="px-2 py-1 text-xs rounded-full bg-muted">
              {tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
