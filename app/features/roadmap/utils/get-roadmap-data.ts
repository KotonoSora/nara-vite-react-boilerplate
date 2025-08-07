import type { TranslationFunction } from "~/lib/i18n/types";
import type { RoadmapData, RequestGuide } from "../types/roadmap-types";

export function getRoadmapData(t: TranslationFunction): RoadmapData {
  return {
    current: {
      reactRouter: {
        title: t("roadmap.features.current.reactRouter.title"),
        description: t("roadmap.features.current.reactRouter.description"),
        status: "Stable",
      },
      typescript: {
        title: t("roadmap.features.current.typescript.title"),
        description: t("roadmap.features.current.typescript.description"),
        status: "Stable",
      },
      cloudflareWorkers: {
        title: t("roadmap.features.current.cloudflareWorkers.title"),
        description: t("roadmap.features.current.cloudflareWorkers.description"),
        status: "Stable",
      },
      drizzleOrm: {
        title: t("roadmap.features.current.drizzleOrm.title"),
        description: t("roadmap.features.current.drizzleOrm.description"),
        status: "Stable",
      },
      honoApi: {
        title: t("roadmap.features.current.honoApi.title"),
        description: t("roadmap.features.current.honoApi.description"),
        status: "Stable",
      },
      tailwindUi: {
        title: t("roadmap.features.current.tailwindUi.title"),
        description: t("roadmap.features.current.tailwindUi.description"),
        status: "Stable",
      },
      authentication: {
        title: t("roadmap.features.current.authentication.title"),
        description: t("roadmap.features.current.authentication.description"),
        status: "Stable",
      },
      i18n: {
        title: t("roadmap.features.current.i18n.title"),
        description: t("roadmap.features.current.i18n.description"),
        status: "Stable",
        badge: "New",
      },
      testing: {
        title: t("roadmap.features.current.testing.title"),
        description: t("roadmap.features.current.testing.description"),
        status: "Stable",
      },
      cicd: {
        title: t("roadmap.features.current.cicd.title"),
        description: t("roadmap.features.current.cicd.description"),
        status: "Stable",
      },
    },
    development: {
      advancedAuth: {
        title: t("roadmap.features.development.advancedAuth.title"),
        description: t("roadmap.features.development.advancedAuth.description"),
        status: "In Progress",
        eta: t("roadmap.features.development.advancedAuth.eta"),
        badge: "Popular",
      },
      realtime: {
        title: t("roadmap.features.development.realtime.title"),
        description: t("roadmap.features.development.realtime.description"),
        status: "Planning",
        eta: t("roadmap.features.development.realtime.eta"),
        badge: "Community Requested",
      },
      monitoring: {
        title: t("roadmap.features.development.monitoring.title"),
        description: t("roadmap.features.development.monitoring.description"),
        status: "Research",
        eta: t("roadmap.features.development.monitoring.eta"),
      },
    },
    planned: {
      mobileApp: {
        title: t("roadmap.features.planned.mobileApp.title"),
        description: t("roadmap.features.planned.mobileApp.description"),
        status: "Planned",
        eta: t("roadmap.features.planned.mobileApp.eta"),
        badge: "Popular",
      },
      cms: {
        title: t("roadmap.features.planned.cms.title"),
        description: t("roadmap.features.planned.cms.description"),
        status: "Planned",
        eta: t("roadmap.features.planned.cms.eta"),
      },
      ecommerce: {
        title: t("roadmap.features.planned.ecommerce.title"),
        description: t("roadmap.features.planned.ecommerce.description"),
        status: "Planned",
        eta: t("roadmap.features.planned.ecommerce.eta"),
        badge: "Community Requested",
      },
      aiIntegration: {
        title: t("roadmap.features.planned.aiIntegration.title"),
        description: t("roadmap.features.planned.aiIntegration.description"),
        status: "Planned",
        eta: t("roadmap.features.planned.aiIntegration.eta"),
      },
      microservices: {
        title: t("roadmap.features.planned.microservices.title"),
        description: t("roadmap.features.planned.microservices.description"),
        status: "Planned",
        eta: t("roadmap.features.planned.microservices.eta"),
      },
    },
  };
}

export function getRequestGuide(t: TranslationFunction): RequestGuide {
  return {
    steps: {
      step1: {
        title: t("roadmap.requestGuide.steps.step1.title"),
        description: t("roadmap.requestGuide.steps.step1.description"),
      },
      step2: {
        title: t("roadmap.requestGuide.steps.step2.title"),
        description: t("roadmap.requestGuide.steps.step2.description"),
      },
      step3: {
        title: t("roadmap.requestGuide.steps.step3.title"),
        description: t("roadmap.requestGuide.steps.step3.description"),
      },
      step4: {
        title: t("roadmap.requestGuide.steps.step4.title"),
        description: t("roadmap.requestGuide.steps.step4.description"),
      },
    },
    template: {
      title: t("roadmap.requestGuide.template.title"),
      description: t("roadmap.requestGuide.template.description"),
      content: t("roadmap.requestGuide.template.content"),
    },
    guidelines: {
      title: t("roadmap.requestGuide.guidelines.title"),
      items: {
        specific: t("roadmap.requestGuide.guidelines.items.specific"),
        research: t("roadmap.requestGuide.guidelines.items.research"),
        scope: t("roadmap.requestGuide.guidelines.items.scope"),
        community: t("roadmap.requestGuide.guidelines.items.community"),
        maintenance: t("roadmap.requestGuide.guidelines.items.maintenance"),
      },
    },
  };
}