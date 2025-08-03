import type { ComponentProps, ReactNode } from "react";

import { FooterSection } from "~/features/landing-page/components/footer-section";
import { LAYOUT_CONSTANTS } from "~/lib/constants/ui";
import { cn } from "~/lib/utils";

import { HeaderNavigation } from "../navigation";
import type { HeaderNavigationProps } from "../navigation/types";

export interface PageLayoutProps extends ComponentProps<"main"> {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  headerProps?: HeaderNavigationProps;
  containerClassName?: string;
  fullWidth?: boolean;
}

export function PageLayout({
  children,
  showHeader = true,
  showFooter = true,
  headerProps,
  className,
  containerClassName,
  fullWidth = false,
  ...props
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showHeader && <HeaderNavigation {...headerProps} />}
      
      <main
        className={cn(
          "flex-1",
          !fullWidth && "container mx-auto",
          LAYOUT_CONSTANTS.SECTION_PADDING_X,
          className,
        )}
        style={{ contentVisibility: "auto" }}
        {...props}
      >
        <div className={cn(!fullWidth && LAYOUT_CONSTANTS.CONTAINER_MAX_WIDTH, "mx-auto", containerClassName)}>
          {children}
        </div>
      </main>
      
      {showFooter && <FooterSection />}
    </div>
  );
}