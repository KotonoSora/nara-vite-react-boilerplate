import { useEffect, useState } from "react";

export interface BlogHeading {
  id: string;
  title: string;
  level: number;
}

interface UseBlogReaderProps {
  headings: BlogHeading[];
}

export function useBlogReader({ headings }: UseBlogReaderProps) {
  const [activeSection, setActiveSection] = useState<string>("");
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setReadingProgress(Math.min(progress, 100));

      const sectionElements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean) as HTMLElement[];

      let currentActive = "";
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element && element.getBoundingClientRect().top <= 120) {
          currentActive = headings[i].id;
          break;
        }
      }

      const newActiveId = currentActive || (headings[0] ? headings[0].id : "");
      setActiveSection(newActiveId);

      if (newActiveId) {
        document.getElementById(`toc-${newActiveId}`)?.scrollIntoView({
          behavior: "instant",
          block: "nearest",
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once initially to set the active section on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // Account for sticky header height
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return {
    activeSection,
    readingProgress,
    scrollToSection,
  };
}
