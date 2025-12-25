import { Link } from "react-router";

import type { BlogPost } from "~/features/blog/utils/mdx-loader";

import { formatDate } from "~/features/blog/utils/format-date";
import { useTranslation } from "~/lib/i18n/hooks/use-translation";

interface BlogPostCardProps {
  post: BlogPost;
  locale?: string;
}

export function BlogPostCard({ post, locale = "en-US" }: BlogPostCardProps) {
  const t = useTranslation();
  return (
    <article className="flex flex-col p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
      <header className="mb-4">
        <Link
          to={`/blog/${post.slug}`}
          className="text-2xl font-semibold hover:text-primary transition-colors"
        >
          {post.frontmatter.title}
        </Link>
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
        <Link
          to={`/blog/${post.slug}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          {t("blog.card.readMore")} →
        </Link>
      </footer>
    </article>
  );
}
