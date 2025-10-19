import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import { useI18n } from "~/lib/i18n/hooks/common";
import { cn } from "~/lib/utils";

export function ButtonScrollToTop() {
  const { t } = useI18n();
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const onScroll = () => setShowScroll(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleScrollToTop = () => {
    if (typeof window === "undefined") {
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Button
      className={cn("z-10 fixed bottom-4 right-4 rounded-full w-8 h-8", {
        visible: showScroll,
        invisible: !showScroll,
      })}
      onClick={handleScrollToTop}
      aria-label={t("showcase.scrollToTop")}
    >
      <ArrowUp size={20} />
    </Button>
  );
}
