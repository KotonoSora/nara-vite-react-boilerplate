import { memo } from "react";

export const FooterSection = memo(function FooterSection() {
  return (
    <footer
      className="border-t py-12 px-4 bg-background/80 backdrop-blur-sm"
      style={{ contentVisibility: "auto" }}
    >
      <div className="container mx-auto text-center">
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img
              src="assets/logo-dark.svg"
              alt=""
              className="w-8 h-8 hidden [html.dark_&]:block"
              loading="lazy"
            />
            <img
              src="assets/logo-light.svg"
              alt=""
              className="w-8 h-8 hidden [html.light_&]:block"
              loading="lazy"
            />
            <h3 className="text-2xl font-bold">NARA</h3>
          </div>
          <p className="text-muted-foreground">
            The Full-Stack React Boilerplate That Actually Ships
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          © 2025 NARA Boilerplate. Built with ❤️ by KotonoSora — to help you
          ship faster and with confidence.
        </p>
      </div>
    </footer>
  );
});
