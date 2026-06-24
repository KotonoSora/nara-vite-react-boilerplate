import { getIntlLocaleByLanguage } from "@kotonosora/i18n";
import { useI18n } from "@kotonosora/i18n-react";

import type { BlogFrontmatter } from "../types/mdx";

interface BlogHeaderProps {
  frontmatter: BlogFrontmatter;
}

function LabelDescription({ description }: { description?: string }) {
  if (!description) return null;

  return <p className="text-xl text-muted-foreground">{description}</p>;
}

function LabelAuthor({ author }: { author?: string }) {
  const { t } = useI18n();
  if (!author) return null;

  return (
    <span>
      {t("blog.card.by")}&nbsp;{author}
    </span>
  );
}

function LabelDate({ date }: { date?: string }) {
  const { language } = useI18n();
  const locale = getIntlLocaleByLanguage(language);

  if (!date) return null;

  return (
    <time dateTime={date}>
      {new Date(date).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </time>
  );
}

function LabelTags({ tags }: { tags?: string[] }) {
  if (!tags || tags.length <= 0) return null;

  return (
    <div className="flex gap-2 mt-4">
      {tags.map((tag) => (
        <span key={tag} className="px-2 py-1 text-xs rounded-full bg-muted">
          {tag}
        </span>
      ))}
    </div>
  );
}

export function BlogHeader({ frontmatter }: BlogHeaderProps) {
  const { title, description, tags, author, date } = frontmatter;

  return (
    <header className="mb-8">
      <h1 className="text-4xl font-bold mb-2">{title}</h1>
      <LabelDescription description={description} />
      <div className="flex gap-4 text-sm text-muted-foreground mt-4">
        <LabelAuthor author={author} />
        <LabelDate date={date} />
      </div>
      <LabelTags tags={tags} />
    </header>
  );
}
