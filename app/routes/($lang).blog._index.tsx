import type { Route } from "./+types/($lang).blog._index";

import { HomePage } from "~/features/blog/components/home-page";
import { getAllBlogPosts } from "~/features/blog/utils/mdx-loader";
import { generateMetaTags } from "~/features/seo/utils/generate-meta-tags";

export async function clientLoader() {
  const posts = await getAllBlogPosts();
  return { posts };
}

clientLoader.hydrate = true as const;

export function meta() {
  return generateMetaTags({
    title: "Blog - All Posts",
    description: "Read our latest articles, tutorials, and insights",
  });
}

export default function Page({ loaderData }: Route.ComponentProps) {
  return <HomePage posts={loaderData.posts} />;
}
