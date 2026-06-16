import { useEffect, useState } from "react";

import { getMdxModules } from "../utils/mdx-loader";

interface UseBlogMdxContentProps {
  slug?: string;
  modulePath?: string;
}

export function useBlogMdxContent({
  slug,
  modulePath,
}: UseBlogMdxContentProps) {
  const [contentComponent, setContentComponent] =
    useState<React.ComponentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      if (!modulePath || !slug) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      const modules = getMdxModules();

      for (const [path, loader] of Object.entries(modules)) {
        const fileName = path
          .split("/")
          .pop()
          ?.replace(/\.(mdx?|md)$/, "");

        const isDirectMatch = fileName === slug;
        const isIndexMatch = fileName === "index" && path.includes(`/${slug}/`);

        if (isDirectMatch || isIndexMatch) {
          try {
            const module = await loader();
            if (isMounted) {
              setContentComponent(() => module.default || null);
              setIsLoading(false);
            }
          } catch (error) {
            console.error(
              `Error loading MDX content for slug "${slug}":`,
              error,
            );
            if (isMounted) {
              setIsLoading(false);
            }
          }
          return;
        }
      }

      if (isMounted) {
        console.warn(`No MDX module found for slug "${slug}"`);
        setIsLoading(false);
      }
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, [slug, modulePath]);

  return {
    contentComponent,
    isLoading,
  };
}
