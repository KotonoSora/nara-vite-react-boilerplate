import { useTranslation } from "@kotonosora/i18n-react";
import { useLoaderData } from "react-router";

import type { HomePageLoaderData } from "../types/type";

import { BlogPostCard } from "../components/blog-post-card";

export function HomePage() {
  const t = useTranslation();
  const { posts } = useLoaderData<HomePageLoaderData>();

  return (
    <section className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
      {/* Home blog content */}
      <div className="space-y-8">
        <header>
          <h1 className="text-4xl font-bold mb-4">{t("blog.home.title")}</h1>
          <p className="text-lg text-muted-foreground">
            {t("blog.home.subtitle")}
          </p>
        </header>
        {Array.isArray(posts) && posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("blog.home.noPosts")}</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.isArray(posts) &&
              posts.length > 0 &&
              posts.map((post) => <BlogPostCard key={post.slug} post={post} />)}
          </div>
        )}
      </div>
    </section>
  );
}
