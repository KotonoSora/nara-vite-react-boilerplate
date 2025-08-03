import { X } from "lucide-react";
import type { FC } from "react";
import { Link } from "react-router";

import { Button } from "~/components/ui/button";
import { ANIMATION_CLASSES, NAVIGATION_IDS } from "~/lib/constants/ui";
import { cn } from "~/lib/utils";

import type { MobileNavigationProps, NavigationItem } from "./types";

const MobileNavigationItem: FC<{ item: NavigationItem; onClick: () => void }> = ({
  item,
  onClick,
}) => {
  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-4 py-3 text-base font-medium hover:bg-muted/50 transition-colors"
        onClick={onClick}
      >
        {item.icon && <item.icon className="h-5 w-5" />}
        {item.label}
      </a>
    );
  }

  return (
    <Link
      to={item.href}
      className="flex items-center gap-3 px-4 py-3 text-base font-medium hover:bg-muted/50 transition-colors"
      onClick={onClick}
    >
      {item.icon && <item.icon className="h-5 w-5" />}
      {item.label}
    </Link>
  );
};

export const MobileNavigation: FC<MobileNavigationProps> = ({
  items,
  isOpen,
  onClose,
  className,
  ...props
}) => {
  if (!isOpen) return null;

  return (
    <nav
      id={NAVIGATION_IDS.MOBILE}
      className={cn(
        "fixed inset-x-0 top-16 z-50 bg-background border-b shadow-lg",
        ANIMATION_CLASSES.SLIDE_IN_FROM_TOP,
        className,
      )}
      {...props}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <h2 className="text-lg font-semibold">Navigation</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="py-4 space-y-1">
          {items.map((item, index) => (
            <MobileNavigationItem
              key={`${item.href}-${index}`}
              item={item}
              onClick={onClose}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};