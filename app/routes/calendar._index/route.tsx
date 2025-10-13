import type { Route } from "./+types/route";

import { FooterSection } from "~/features/shared/components/footer-section";
import { HeaderNavigation } from "~/features/shared/header-navigation";
import { GeneralInformationContext } from "~/middleware/information";

import { ContentCalendarInfinityPage } from "./page";

import styleUrl from "./style/custom.css?url";

export function loader({ context }: Route.LoaderArgs) {
  const pageInformation = context.get(GeneralInformationContext);
  return pageInformation;
}

export function links() {
  return [{ rel: "stylesheet", href: styleUrl }];
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Calendar Infinity" },
    { name: "description", content: "Demo calendar app" },
  ];
}

export default function Page({}: Route.ComponentProps) {
  return (
    <main className="min-h-screen bg-background content-visibility-auto">
      <HeaderNavigation />

      <section className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 space-y-8">
        <ContentCalendarInfinityPage />
      </section>

      <FooterSection />
    </main>
  );
}
