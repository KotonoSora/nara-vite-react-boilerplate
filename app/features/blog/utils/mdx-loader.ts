import type { ComponentType } from "react";

export interface MDXModule {
  default: ComponentType;
  frontmatter?: BlogFrontmatter;
}

export interface BlogFrontmatter {
  title: string;
  description?: string;
  date?: string;
  author?: string;
  tags?: string[];
  image?: string;
  published?: boolean;
}

export interface BlogPost {
  slug: string;
  content: ComponentType;
  frontmatter: BlogFrontmatter;
}

const mdxModules = import.meta.glob<MDXModule>(
  "/app/features/blog/content/**/*.{md,mdx}",
  { eager: false },
);

export async function loadBlogPost(slug: string): Promise<BlogPost | null> {
  const possiblePaths = [
    `/app/features/blog/content/${slug}.mdx`,
    `/app/features/blog/content/${slug}.md`,
    `/app/features/blog/content/${slug}/index.mdx`,
    `/app/features/blog/content/${slug}/index.md`,
  ];

  for (const path of possiblePaths) {
    const loader = mdxModules[path];
    if (loader) {
      try {
        const module = await loader();
        return {
          slug,
          content: module.default,
          frontmatter: module.frontmatter || {
            title: slug,
            description: "",
            published: true,
          },
        };
      } catch (error) {
        console.error(`Error loading blog post at ${path}:`, error);
        continue;
      }
    }
  }

  return null;
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];

  for (const [path, loader] of Object.entries(mdxModules)) {
    try {
      const module = await loader();
      const slug = extractSlugFromPath(path);

      if (module.frontmatter?.published !== false) {
        posts.push({
          slug,
          content: module.default,
          frontmatter: module.frontmatter || {
            title: slug,
            description: "",
            published: true,
          },
        });
      }
    } catch (error) {
      console.error(`Error loading blog post at ${path}:`, error);
    }
  }

  return posts.sort((a, b) => {
    const dateA = a.frontmatter.date
      ? new Date(a.frontmatter.date).getTime()
      : 0;
    const dateB = b.frontmatter.date
      ? new Date(b.frontmatter.date).getTime()
      : 0;
    return dateB - dateA;
  });
}

function extractSlugFromPath(path: string): string {
  const match = path.match(/\/content\/(.+)\.(md|mdx)$/);
  if (!match) return "";

  let slug = match[1];
  if (slug.endsWith("/index")) {
    slug = slug.replace(/\/index$/, "");
  }

  return slug;
}

export function getBlogPostsMetadata(): Array<{
  slug: string;
  path: string;
}> {
  return Object.keys(mdxModules).map((path) => ({
    slug: extractSlugFromPath(path),
    path,
  }));
}
