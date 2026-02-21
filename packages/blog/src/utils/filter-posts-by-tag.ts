import type { BlogPost } from "@/types/mdx";

/**
 * Filters an array of blog posts by a specific tag.
 * @param posts - The array of blog posts to filter
 * @param tag - The tag to filter by (case-insensitive)
 * @returns A filtered array of blog posts that contain the specified tag
 */
export function filterPostsByTag(posts: BlogPost[], tag: string): BlogPost[] {
  if (!tag) return posts;

  return posts.filter((post) =>
    post.frontmatter.tags?.some((t) => t.toLowerCase() === tag.toLowerCase()),
  );
}
