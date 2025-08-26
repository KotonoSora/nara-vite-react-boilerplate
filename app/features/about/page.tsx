import { DarkAbout } from "./components/dark-edgy";
import { NewspaperAbout } from "./components/newspaper-about";
import { PlayfulAbout } from "./components/playful-about";
import { ShadcnAbout } from "./components/shadcn-about";
import { TechAbout } from "./components/tech-about";
import { MinimalistAbout } from "./components/ultra-minimalist";

export function AboutPage() {
  return (
    <div className="min-h-screen relative">
      {/* This page is demo style of about page. You can create your own style */}
      <MinimalistAbout />
      <DarkAbout />
      <PlayfulAbout />
      <NewspaperAbout />
      <TechAbout />
      <ShadcnAbout />
    </div>
  );
}
