import { cn } from "@kotonosora/ui/lib/utils";
import { Link } from "react-router";

import type { BrandLogoProps } from "../../landing-page/types/type";

export function BrandLogo(props: BrandLogoProps) {
  const { url, onClick, className } = props;

  return (
    <Link
      to={url}
      className={cn(
        "flex items-center font-bold text-xl tracking-tight space-x-2",
        className,
      )}
      onClick={onClick}
      discover="none"
    >
      <img
        src="/assets/logo-dark.svg"
        alt="nara-logo-dark"
        className="w-8 h-8 hidden [html.dark_&]:block"
        loading="lazy"
        aria-hidden="true"
      />
      <img
        src="/assets/logo-light.svg"
        alt="nara-logo-light"
        className="w-8 h-8 hidden [html.light_&]:block"
        loading="lazy"
        aria-hidden="true"
      />
      <span>NARA</span>
    </Link>
  );
}
