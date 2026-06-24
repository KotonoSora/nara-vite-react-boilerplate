import { useEffect, useState } from "react";

import type { UseLegalReaderProps } from "../types/legal";

export function useLegalReader({
  sections,
  title,
  description,
}: UseLegalReaderProps) {
  const [activeSection, setActiveSection] = useState<string>("");
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setReadingProgress(Math.min(progress, 100));

      // Update active section based on scroll position
      const sectionElements = sections
        .map((section) => document.getElementById(section.id))
        .filter(Boolean);

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element && element.getBoundingClientRect().top <= 120) {
          // Account for header height
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once initially to set the active section on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

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
    handlePrint,
    handleShare,
  };
}
