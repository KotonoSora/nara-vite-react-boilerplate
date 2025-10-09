import { Link } from "react-router";

import { FooterSection } from "~/features/shared/components/footer-section";
import { HeaderNavigationSection } from "~/features/shared/components/header-navigation-section";

export function AboutPage() {
  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Header */}
      <HeaderNavigationSection />

      {/* Main content */}
      <section className="flex flex-col items-center justify-center min-h-0 h-full flex-1 py-12 px-4 text-center bg-background">
        <div className="max-w-2xl space-y-8 text-center">
          <h1 className="text-4xl font-light text-foreground">About</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We build things that matter. <br /> Simple, functional, beautiful.
          </p>
          <div className="w-24 h-0.5 bg-border mx-auto"></div>
          <p className="text-muted-foreground">
            Crafted with purpose. Built for tomorrow. <br /> Driven by
            precision.
          </p>

          <div className="pt-4 space-y-2">
            <p className="text-sm uppercase tracking-wider text-muted-foreground font-medium">
              Contact
            </p>
            <Link
              to="mailto:hi@kotonosora.com"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 inline-block"
            >
              hi@kotonosora.com
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <FooterSection />
    </div>
  );
}
