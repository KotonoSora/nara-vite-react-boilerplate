import { MDXProvider } from "@mdx-js/react";
import { data } from "react-router";

import type { JSX } from "react";
import type { MiddlewareFunction } from "react-router";

import type { BlogFrontmatter } from "~/features/blog/utils/mdx-loader";

import { mdxComponents } from "~/features/blog/config/mdx-components";
import { loadBlogPost } from "~/features/blog/utils/mdx-loader";
import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";

interface SlugBlogContext {
  content: JSX.Element;
  frontmatter: BlogFrontmatter;
  slug: string;
}

export const { slugBlogMiddlewareContext } =
  createMiddlewareContext<SlugBlogContext>("slugBlogMiddlewareContext");

export const slugBlogMiddleware: MiddlewareFunction = async (
  { context, params },
  next,
) => {
  const slug = params.slug as string;

  if (!slug) {
    throw data({ error: "Slug parameter is required" }, { status: 400 });
  }

  const post = await loadBlogPost(slug);

  if (!post) {
    throw data({ error: "Blog post not found" }, { status: 404 });
  }

  const MDXContent = post.content;

  const contextValue: SlugBlogContext = {
    slug: post.slug,
    frontmatter: post.frontmatter,
    content: (
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{post.frontmatter.title}</h1>
          {post.frontmatter.description && (
            <p className="text-xl text-muted-foreground">
              {post.frontmatter.description}
            </p>
          )}
          <div className="flex gap-4 text-sm text-muted-foreground mt-4">
            {post.frontmatter.author && (
              <span>By {post.frontmatter.author}</span>
            )}
            {post.frontmatter.date && (
              <time dateTime={post.frontmatter.date}>
                {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
          </div>
          {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
            <div className="flex gap-2 mt-4">
              {post.frontmatter.tags.map((tag) => (
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
        <MDXProvider components={mdxComponents}>
          <MDXContent />
        </MDXProvider>
      </article>
    ),
  };

  context.set(slugBlogMiddlewareContext, contextValue);

  return await next();
};
