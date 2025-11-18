import type { Route } from "./+types/($lang).blog._index";

import { HomePage } from "~/features/blog/components/home-page";
import { getAllBlogPosts } from "~/features/blog/utils/mdx-loader";

export async function clientLoader() {
  const posts = await getAllBlogPosts();
  return { posts };
}

clientLoader.hydrate = true as const;

export function meta() {
  return [
    { title: "Blog - All Posts" },
    {
      name: "description",
      content: "Read our latest articles, tutorials, and insights",
    },
  ];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  return <HomePage posts={loaderData.posts} />;
}
