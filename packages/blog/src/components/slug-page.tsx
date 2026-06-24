import { useI18n } from "@kotonosora/i18n-react";
import { MDXProvider } from "@mdx-js/react";
import { Link, useLoaderData } from "react-router";

import type { SlugBlogLoaderData } from "../types/mdx";

import { mdxComponents } from "../config/mdx-components";
import { useBlogHeadings } from "../hooks/use-blog-headings";
import { useBlogMdxContent } from "../hooks/use-blog-mdx-content";
import { useBlogReader } from "../hooks/use-blog-reader";
import { BlogHeader } from "./blog-header";
import { BlogTableOfContents } from "./blog-table-of-contents";

export function SlugPage() {
  const { t } = useI18n();
  const loaderData = useLoaderData<SlugBlogLoaderData>();
  const { frontmatter, slug, modulePath, loading } = loaderData || {};
  const { title, description, tags, author } = frontmatter || {};

  const { contentComponent: ContentComponent, isLoading } = useBlogMdxContent({
    slug,
    modulePath,
  });

  const headings = useBlogHeadings({
    isLoading,
    contentComponent: ContentComponent,
  });

  const { activeSection, readingProgress, scrollToSection } = useBlogReader({
    headings,
  });

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

      {/* Reading Progress Bar */}
      {headings.length > 0 && (
        <div className="fixed top-0 left-0 right-0 z-60">
          <div
            className="h-1 bg-primary transition-all duration-300"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      )}

      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Sidebar - Table of Contents */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="lg:sticky lg:top-20 space-y-4 lg:space-y-6">
            {/* Back Navigation */}
            <div className="mb-4 lg:mb-6">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                discover="none"
              >
                ← {t("blog.error.viewAllPosts")}
              </Link>
            </div>

            {/* Table of Contents */}
            {headings.length > 0 && (
              <BlogTableOfContents
                headings={headings}
                activeSection={activeSection}
                scrollToSection={scrollToSection}
              />
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <article className="prose prose-slate dark:prose-invert max-w-none">
            {/* Slug blog header */}
            <BlogHeader frontmatter={frontmatter} />

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
        </div>
      </div>
    </section>
  );
}
