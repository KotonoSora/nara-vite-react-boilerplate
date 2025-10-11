import { Link, useLoaderData } from "react-router";

import type { AboutPageContextType } from "./types/type";

import { FooterSection } from "~/features/shared/components/footer-section";
import { HeaderNavigation } from "~/features/shared/header-navigation";

export function AboutPage() {
  const { content } = useLoaderData<AboutPageContextType>();

  return (
    <div className="min-h-screen relative flex flex-col">
      <HeaderNavigation />

      <section className="flex flex-col items-center justify-center min-h-0 h-full flex-1 py-12 px-4 text-center bg-background">
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
    </div>
  );
}
