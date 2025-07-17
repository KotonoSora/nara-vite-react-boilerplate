import { BuiltForDevelopersSection } from "~/features/landing-page/components/built-for-developers-section";
import { FooterSection } from "~/features/landing-page/components/footer-section";
import { HeaderNavigationSection } from "~/features/landing-page/components/header-navigation-section";
import { HeroSection } from "~/features/landing-page/components/hero-section";
import { KeyFeaturesSection } from "~/features/landing-page/components/key-features-section";
import { LicenseSection } from "~/features/landing-page/components/license-section";
import { ShowcaseSection } from "~/features/landing-page/components/showcase-section";
import { TechStackSection } from "~/features/landing-page/components/tech-stack-section";
import { FeatureFlagDemo } from "~/features/feature-flags/demo";

export function ContentPage() {
  return (
    <main
      className="min-h-screen bg-background relative"
      style={{ contentVisibility: "auto" }}
    >
      {/* Header/Navigation Section */}
      <HeaderNavigationSection />

      {/* Hero Section */}
      <HeroSection />

      {/* Built for Developers Section */}
      <BuiltForDevelopersSection />

      {/* Key Features Section */}
      <KeyFeaturesSection />

      {/* Tech Stack Section */}
      <TechStackSection />

      {/* Feature Flags Demo Section */}
      <section className="relative py-16">
        <div className="container mx-auto px-4">
          <FeatureFlagDemo />
        </div>
      </section>

      {/* License Section */}
      <LicenseSection />

      {/* Showcase Section */}
      <ShowcaseSection />

      {/* Footer Section */}
      <FooterSection />
    </main>
  );
}
