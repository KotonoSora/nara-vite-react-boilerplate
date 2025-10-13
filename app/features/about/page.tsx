import { Link, useLoaderData } from "react-router";

import type { AboutPageContextType } from "./types/type";

import { FooterSection } from "~/features/shared/components/footer-section";
import { HeaderNavigation } from "~/features/shared/header-navigation";

export function AboutPage() {
  const { content } = useLoaderData<AboutPageContextType>();

  return (
    <main className="min-h-screen bg-background content-visibility-auto">
      <HeaderNavigation />

      <section className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 space-y-4">
        <div className="max-w-2xl space-y-8 text-center">
          <h1 className="text-4xl font-light text-foreground">
            {content.heading}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {content.tagline} <br /> {content.taglineSecond}
          </p>
          <div className="w-24 h-0.5 bg-border mx-auto"></div>
          <p className="text-muted-foreground">
            {content.description} <br /> {content.descriptionSecond}
          </p>

          <div className="pt-4 space-y-2">
            <p className="text-sm uppercase tracking-wider text-muted-foreground font-medium">
              {content.contactLabel}
            </p>
            <Link
              to={`mailto:${content.email}`}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 inline-block"
            >
              {content.email}
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
