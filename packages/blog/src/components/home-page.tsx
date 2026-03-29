import { useTranslation } from "@kotonosora/i18n-react";
import { useLoaderData } from "react-router";

import type { HomePageLoaderData } from "../types/mdx";

import { BlogPostCard } from "../components/blog-post-card";

export function HomePage() {
  const t = useTranslation();
  const { posts = [], loading } = useLoaderData<HomePageLoaderData>() || {};

  const hasPosts = Array.isArray(posts) && posts.length > 0;

  return (
    <section className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 max-w-7xl">
      {/* Home blog content */}
      <div className="space-y-8">
        <header>
          <h1 className="text-4xl font-bold mb-4">{t("blog.home.title")}</h1>
          <p className="text-lg text-muted-foreground">
            {t("blog.home.subtitle")}
          </p>
        </header>

        {loading?.isLoading ? (
          <div className="text-center py-12">
            <div className="space-y-4">
              <p className="text-muted-foreground">Loading posts...</p>
              {loading.total > 0 && (
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
                    {loading.loaded} / {loading.total} posts
                  </p>
                  {loading.currentSlug && (
                    <p className="text-xs text-muted-foreground">
                      {loading.currentSlug}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : !hasPosts ? (
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
