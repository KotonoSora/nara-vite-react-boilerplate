import { useLoaderData } from "react-router";

export function SlugPage() {
  const { content } = useLoaderData();

  return (
    <section className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 space-y-8 flex flex-col flex-1 justify-start items-start text-left">
      {content}
    </section>
  );
}
