import { useEffect, useState } from "react";

import type { BlogHeading } from "../components/blog-table-of-contents";

interface UseBlogHeadingsProps {
  isLoading: boolean;
  contentComponent: React.ComponentType | null;
}

export function useBlogHeadings({
  isLoading,
  contentComponent,
}: UseBlogHeadingsProps) {
  const [headings, setHeadings] = useState<BlogHeading[]>([]);

  useEffect(() => {
    if (isLoading || !contentComponent) return;

    const timer = setTimeout(() => {
      const articleEl = document.querySelector("article");
      if (!articleEl) return;

      const headingEls = articleEl.querySelectorAll("h2, h3");
      const extractedHeadings: BlogHeading[] = [];

      headingEls.forEach((el, index) => {
        const text = el.textContent || "";
        if (!text) return;

        let id = el.id;
        if (!id) {
          id = text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");

          if (!id) {
            id = `heading-${index}`;
          }
          el.id = id;
        }

        extractedHeadings.push({
          id,
          title: text,
          level: el.tagName === "H2" ? 2 : 3,
        });
      });

      setHeadings(extractedHeadings);
    }, 100);

    return () => clearTimeout(timer);
  }, [isLoading, contentComponent]);

  return headings;
}
