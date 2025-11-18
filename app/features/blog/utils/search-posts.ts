import type { BlogPost } from "./mdx-loader";

export function searchPosts(posts: BlogPost[], query: string): BlogPost[] {
  if (!query.trim()) return posts;

  const lowerQuery = query.toLowerCase();

  return posts.filter((post) => {
    const titleMatch = post.frontmatter.title
      .toLowerCase()
      .includes(lowerQuery);
    const descriptionMatch = post.frontmatter.description
      ?.toLowerCase()
      .includes(lowerQuery);
    const authorMatch = post.frontmatter.author
      ?.toLowerCase()
      .includes(lowerQuery);
    const tagsMatch = post.frontmatter.tags?.some((tag) =>
      tag.toLowerCase().includes(lowerQuery),
    );

    return titleMatch || descriptionMatch || authorMatch || tagsMatch;
  });
}

export function filterPostsByTag(posts: BlogPost[], tag: string): BlogPost[] {
  if (!tag) return posts;

  return posts.filter((post) =>
    post.frontmatter.tags?.some((t) => t.toLowerCase() === tag.toLowerCase()),
  );
}

export function filterPostsByAuthor(
  posts: BlogPost[],
  author: string,
): BlogPost[] {
  if (!author) return posts;

  return posts.filter(
    (post) => post.frontmatter.author?.toLowerCase() === author.toLowerCase(),
  );
}

export function getAllTags(posts: BlogPost[]): string[] {
  const tags = new Set<string>();

  posts.forEach((post) => {
    post.frontmatter.tags?.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}

export function getAllAuthors(posts: BlogPost[]): string[] {
  const authors = new Set<string>();

  posts.forEach((post) => {
    if (post.frontmatter.author) {
      authors.add(post.frontmatter.author);
    }
  });

  return Array.from(authors).sort();
}

export function sortPostsByDate(
  posts: BlogPost[],
  order: "asc" | "desc" = "desc",
): BlogPost[] {
  return [...posts].sort((a, b) => {
    const dateA = a.frontmatter.date
      ? new Date(a.frontmatter.date).getTime()
      : 0;
    const dateB = b.frontmatter.date
      ? new Date(b.frontmatter.date).getTime()
      : 0;

    return order === "desc" ? dateB - dateA : dateA - dateB;
  });
}

export function sortPostsByTitle(
  posts: BlogPost[],
  order: "asc" | "desc" = "asc",
): BlogPost[] {
  return [...posts].sort((a, b) => {
    const comparison = a.frontmatter.title.localeCompare(b.frontmatter.title);
    return order === "desc" ? -comparison : comparison;
  });
}
