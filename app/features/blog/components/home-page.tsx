import type { BlogPost } from "~/features/blog/utils/mdx-loader";

import { BlogPostCard } from "~/features/blog/components/blog-post-card";
import { useI18n } from "~/lib/i18n/hooks/use-i18n";

interface HomePageProps {
  posts?: BlogPost[];
}

export function HomePage({ posts = [] }: HomePageProps) {
  const { t } = useI18n();

  return (
    <section className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
      <div className="space-y-8">
        <header>
          <h1 className="text-4xl font-bold mb-4">{t("blog.home.title")}</h1>
          <p className="text-lg text-muted-foreground">
            {t("blog.home.subtitle")}
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("blog.home.noPosts")}</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
