import { BuiltForDevelopersSection } from "~/features/landing-page/components/built-for-developers-section";
import { FooterSection } from "~/features/landing-page/components/footer-section";
import { GettingStartedSection } from "~/features/landing-page/components/getting-started-section";
import { HeaderNavigationSection } from "~/features/landing-page/components/header-navigation-section";
import { HeroSection } from "~/features/landing-page/components/hero-section";
import { KeyFeaturesSection } from "~/features/landing-page/components/key-features-section";
import { LicenseSection } from "~/features/landing-page/components/license-section";
import { ShowcaseSection } from "~/features/landing-page/components/showcase-section";
import { TechStackSection } from "~/features/landing-page/components/tech-stack-section";

export function ContentPage() {
  return (
    <main
      className="min-h-screen bg-background"
      style={{ contentVisibility: "auto" }}
    >
      {/* Header/Navigation Section */}
      <header role="banner" id="navigation">
        <HeaderNavigationSection />
      </header>

      {/* Main Content Area */}
      <div id="main-content" role="main">
        {/* Hero Section */}
        <section aria-labelledby="hero-heading">
          <HeroSection />
        </section>

        {/* Getting Started Section */}
        <section aria-labelledby="getting-started-heading">
          <GettingStartedSection />
        </section>

        {/* Built for Developers Section */}
        <section aria-labelledby="developers-heading">
          <BuiltForDevelopersSection />
        </section>

        {/* Key Features Section */}
        <section aria-labelledby="features-heading">
          <KeyFeaturesSection />
        </section>

        {/* Tech Stack Section */}
        <section aria-labelledby="tech-stack-heading">
          <TechStackSection />
        </section>

        {/* License Section */}
        <section aria-labelledby="license-heading">
          <LicenseSection />
        </section>

        {/* Showcase Section */}
        <section aria-labelledby="showcase-heading">
          <ShowcaseSection />
        </section>
      </div>

      {/* Footer Section */}
      <footer role="contentinfo">
        <FooterSection />
      </footer>
    </main>
  );
}
