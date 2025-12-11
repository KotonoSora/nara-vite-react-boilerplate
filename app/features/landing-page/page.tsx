import { lazy, Suspense } from "react";

import { FooterSection } from "../shared/components/footer-section";
import { HeaderNavigation } from "../shared/header-navigation";
import { HeroSection } from "./components/hero-section";

const GettingStartedSection = lazy(() =>
  import("./components/getting-started-section").then((m) => ({ default: m.GettingStartedSection }))
);
const BuiltForDevelopersSection = lazy(() =>
  import("./components/built-for-developers-section").then((m) => ({ default: m.BuiltForDevelopersSection }))
);
const KeyFeaturesSection = lazy(() =>
  import("./components/key-features-section").then((m) => ({ default: m.KeyFeaturesSection }))
);
const TechStackSection = lazy(() =>
  import("./components/tech-stack-section").then((m) => ({ default: m.TechStackSection }))
);
const LicenseSection = lazy(() =>
  import("./components/license-section").then((m) => ({ default: m.LicenseSection }))
);
const ShowcaseSection = lazy(() =>
  import("./components/showcase-section").then((m) => ({ default: m.ShowcaseSection }))
);
const DonateSection = lazy(() =>
  import("./components/donate-section").then((m) => ({ default: m.DonateSection }))
);

function SectionLoader() {
  return (
    <div className="w-full h-[200px] flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

export function ContentPage() {
  return (
    <main className="min-h-screen bg-background content-visibility-auto">
      {/* Header/Navigation Section */}
      <HeaderNavigation />

      {/* Hero Section - Always loaded for LCP */}
      <HeroSection />

      {/* Below-the-fold sections - Lazy loaded */}
      <Suspense fallback={<SectionLoader />}>
        <GettingStartedSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <BuiltForDevelopersSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <KeyFeaturesSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <TechStackSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <LicenseSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <ShowcaseSection />
      </Suspense>

      {/* Footer Section */}
      <FooterSection />

      <Suspense fallback={null}>
        <DonateSection />
      </Suspense>
    </main>
  );
}
