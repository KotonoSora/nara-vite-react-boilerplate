import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "~/database/schema/showcase";

const { showcase, showcaseTag } = schema;

const DEFAULT_SHOWCASES = [
  {
    name: "nara-finance-react-ts",
    description:
      "A set of modular finance utilities and components built with React and TypeScript, designed for flexibility and reuse.",
    url: "https://github.com/KotonoSora/nara-finance-react-ts",
  },
  {
    name: "nara-forest",
    description:
      "A clean and minimal Pomodoro timer web app for focused productivity, built with the NARA boilerplate.",
    url: "https://github.com/KotonoSora/nara-forest",
  },
  {
    name: "nara-familytree-react-ts",
    description:
      "A flexible family tree visualizer and editor built with React and TypeScript, designed for clarity and extensibility.",
    url: "https://github.com/KotonoSora/nara-familytree-react-ts",
  },
  {
    name: "nara-ui-library",
    description:
      "A modern UI library for finance-related tools, built with React and TypeScript for modularity and developer experience.",
    url: "https://github.com/KotonoSora/nara-ui-library",
  },
];

export async function seedShowcases(db: DrizzleD1Database<typeof schema>) {
  try {
    const existingShowcase = await db
      .select({ id: showcase.id })
      .from(showcase)
      .limit(1);

    if (!existingShowcase.length) {
      await db.insert(showcase).values(DEFAULT_SHOWCASES);
    }

    const existingShowcaseTags = await db
      .select({ id: showcaseTag.id })
      .from(showcaseTag)
      .limit(1);

    if (!existingShowcaseTags.length) {
      const showcaseRows = await db.select({ id: showcase.id }).from(showcase);

      const tagRows = [
        { showcaseId: showcaseRows[0].id, tag: "finance" },
        { showcaseId: showcaseRows[0].id, tag: "tools" },
        { showcaseId: showcaseRows[1].id, tag: "pomodoro" },
        { showcaseId: showcaseRows[1].id, tag: "forest" },
        { showcaseId: showcaseRows[2].id, tag: "family tree" },
        { showcaseId: showcaseRows[2].id, tag: "visualizer" },
        { showcaseId: showcaseRows[3].id, tag: "UI library" },
        { showcaseId: showcaseRows[3].id, tag: "tools" },
      ];

      await db.insert(showcaseTag).values(tagRows);
    }
  } catch (error) {
    console.error(error);
  }
}
