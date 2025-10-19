import type { ProjectInfo } from "~/features/showcases/types/type";
import type { TranslationFunction } from "~/lib/i18n/types/translations";

/**
 * Get built-in demo showcases.
 *
 * @param t - i18n translation function
 * @returns Array of built-in demo pages.
 */
export function getBuiltInDemos(t: TranslationFunction): ProjectInfo[] {
  return [
    {
      id: "built-in-demo-charts",
      name: t("landing.showcase.demos.charts.name"),
      description: t("landing.showcase.demos.charts.description"),
      url: "/chart",
      tags: [
        t("landing.showcase.demos.charts.tags.0"),
        t("landing.showcase.demos.charts.tags.1"),
        t("landing.showcase.demos.charts.tags.2"),
      ],
    },
    {
      id: "built-in-demo-calendar",
      name: t("landing.showcase.demos.calendar.name"),
      description: t("landing.showcase.demos.calendar.description"),
      url: "/calendar",
      tags: [
        t("landing.showcase.demos.calendar.tags.0"),
        t("landing.showcase.demos.calendar.tags.1"),
        t("landing.showcase.demos.calendar.tags.2"),
      ],
    },
  ];
}
