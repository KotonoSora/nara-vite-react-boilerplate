import type { TranslationFunction } from "@kotonosora/i18n";

export function getFeaturesConfigs(t: TranslationFunction) {
  return [
    {
      icon: "shield",
      title: t("landing.features.typeSafety.title"),
      description: t("landing.features.typeSafety.description"),
      colors: {
        primary: "blue-500",
        secondary: "blue-600",
        icon: "text-blue-600",
        hover: "group-hover:text-blue-600",
        background: "to-primary/5",
      },
    },
    {
      icon: "zap",
      title: t("landing.features.performance.title"),
      description: t("landing.features.performance.description"),
      colors: {
        primary: "yellow-500",
        secondary: "orange-500",
        icon: "text-yellow-600",
        hover: "group-hover:text-yellow-600",
        background: "to-yellow-500/5",
      },
    },
    {
      icon: "wrench",
      title: t("landing.features.developerErgonomics.title"),
      description: t("landing.features.developerErgonomics.description"),
      colors: {
        primary: "green-500",
        secondary: "emerald-500",
        icon: "text-green-600",
        hover: "group-hover:text-green-600",
        background: "to-green-500/5",
      },
    },
    {
      icon: "layers",
      title: t("landing.features.versatile.title"),
      description: t("landing.features.versatile.description"),
      colors: {
        primary: "purple-500",
        secondary: "pink-500",
        icon: "text-purple-600",
        hover: "group-hover:text-purple-600",
        background: "to-purple-500/5",
      },
    },
  ];
}
