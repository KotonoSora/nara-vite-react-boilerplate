import { Link } from "react-router";

type BrandLogoProps = {
  to?: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  title?: string;
  "aria-label"?: string;
};

export function BrandLogo({
  to = "/",
  className,
  onClick,
  title,
  "aria-label": ariaLabel,
}: BrandLogoProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      className={
        "flex items-center gap-2 self-center text-xl font-bold" +
        (className ? ` ${className}` : "")
      }
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
      NARA
    </Link>
  );
}
