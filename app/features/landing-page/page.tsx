import { BuiltForDevelopersSection } from "./components/built-for-developers-section";
import { DonateSection } from "./components/donate-section";
import { FooterSection } from "./components/footer-section";
import { GettingStartedSection } from "./components/getting-started-section";
import { HeaderNavigationSection } from "./components/header-navigation-section";
import { HeroSection } from "./components/hero-section";
import { KeyFeaturesSection } from "./components/key-features-section";
import { LicenseSection } from "./components/license-section";
import { ShowcaseSection } from "./components/showcase-section";
import { TechStackSection } from "./components/tech-stack-section";

export function ContentPage() {
  return (
    <main
      className="min-h-screen bg-background"
      style={{ contentVisibility: "auto" }}
    >
      {/* Header/Navigation Section */}
      <HeaderNavigationSection />

      {/* Hero Section */}
      <HeroSection />

      {/* Getting Started Section */}
      <GettingStartedSection />

      {/* Built for Developers Section */}
      <BuiltForDevelopersSection />

      {/* Key Features Section */}
      <KeyFeaturesSection />

      {/* Tech Stack Section */}
      <TechStackSection />

      {/* License Section */}
      <LicenseSection />

      {/* Showcase Section */}
      <ShowcaseSection />

      {/* Footer Section */}
      <FooterSection />

      {/* Donate Section */}
      <DonateSection />
    </main>
  );
}
