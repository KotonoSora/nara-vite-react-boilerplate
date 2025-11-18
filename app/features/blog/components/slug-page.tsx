import type { SlugBlogLoaderData } from "~/features/blog/types/type";

export function SlugPage({ content }: SlugBlogLoaderData) {
  return (
    <section className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
      {content}
    </section>
  );
}
