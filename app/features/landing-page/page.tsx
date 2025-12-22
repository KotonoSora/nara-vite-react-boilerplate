import { Suspense } from "react";

import { FooterSection } from "../shared/components/footer-section";
import { HeaderNavigation } from "../shared/header-navigation";
import { BuiltForDevelopersSection } from "./components/built-for-developers-section";
import { DonateSection } from "./components/donate-section";
import { GettingStartedSection } from "./components/getting-started-section";
import { HeroSection } from "./components/hero-section";
import { KeyFeaturesSection } from "./components/key-features-section";
import { LicenseSection } from "./components/license-section";
import { ShowcaseSection } from "./components/showcase-section";
import { TechStackSection } from "./components/tech-stack-section";

export function ContentPage() {
  return (
    <main className="min-h-screen bg-background content-visibility-auto">
      {/* Header/Navigation Section */}
      <HeaderNavigation />

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
      <Suspense fallback={<div>Loading...</div>}>
        <ShowcaseSection />
      </Suspense>

      {/* Footer Section */}
      <FooterSection />

      {/* Donate Section */}
      <DonateSection />
    </main>
  );
}
