import type { TranslationFunction } from "@kotonosora/i18n-locales";

export function getSteps(t: TranslationFunction) {
  return [
    {
      number: 1,
      title: t("landing.gettingStarted.steps.clone.title"),
      description: t("landing.gettingStarted.steps.clone.description"),
      command: "npx degit KotonoSora/nara-vite-react-boilerplate my-app",
      note: t("landing.gettingStarted.steps.clone.note"),
    },
    {
      number: 2,
      title: t("landing.gettingStarted.steps.install.title"),
      description: t("landing.gettingStarted.steps.install.description"),
      command: "cd my-app \n bun install",
      note: t("landing.gettingStarted.steps.install.note"),
    },
    {
      number: 3,
      title: t("landing.gettingStarted.steps.database.title"),
      description: t("landing.gettingStarted.steps.database.description"),
      command: "bun run db:generate \n bun run db:migrate",
      note: t("landing.gettingStarted.steps.database.note"),
    },
    {
      number: 4,
      title: t("landing.gettingStarted.steps.start.title"),
      description: t("landing.gettingStarted.steps.start.description"),
      command: "bun run dev",
      note: t("landing.gettingStarted.steps.start.note"),
    },
  ];
}
