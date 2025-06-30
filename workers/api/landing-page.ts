import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";

import { showcase, showcaseTag } from "~/database/schema/showcase";

const app = new Hono<{ Bindings: Env }>();

app.get("/", async (c) => {
  try {
    const env = c.env;
    const {
      LANDING_PAGE_TITLE,
      LANDING_PAGE_DESCRIPTION,
      LANDING_PAGE_REPOSITORY,
      LANDING_PAGE_COMMERCIAL_LINK,
    } = env as {
      LANDING_PAGE_TITLE?: string;
      LANDING_PAGE_DESCRIPTION?: string;
      LANDING_PAGE_REPOSITORY?: string;
      LANDING_PAGE_COMMERCIAL_LINK?: string;
    };

    const db = drizzle(c.env.DB);
    const responseShowcases = await getShowcases(db);

    const result: PageInformation = {
      title:
        LANDING_PAGE_TITLE ||
        "NARA Boilerplate - Production-Ready React Starter",
      description:
        LANDING_PAGE_DESCRIPTION ||
        "Fast, opinionated starter template for building full-stack React apps with modern tooling and Cloudflare Workers deployment.",
      githubRepository:
        LANDING_PAGE_REPOSITORY ||
        "https://github.com/KotonoSora/nara-vite-react-boilerplate",
      commercialLink: LANDING_PAGE_COMMERCIAL_LINK,
      showcases: responseShowcases,
    };

    return c.json(result);
  } catch (error) {
    return c.json({ success: false, error }, 500);
  }
});

app.post("/seed", async (c) => {
  try {
    if (!c.env.DB) {
      return c.json({ success: false, error: "Database not available" });
    }
    const db = drizzle(c.env.DB);

    await seedShowcases(db);

    return c.json({ success: true });
  } catch (error) {
    console.error("Error seeding currencies:", error);
    return c.json({ success: false, error: "Failed to seed currencies" });
  }
});

export default app;

const getShowcases = async (db: ReturnType<typeof drizzle>) => {
  const rows = await db
    .select({
      id: showcase.id,
      name: showcase.name,
      description: showcase.description,
      url: showcase.url,
      image: showcase.image,
      tag: showcaseTag.tag,
    })
    .from(showcase)
    .leftJoin(showcaseTag, eq(showcase.id, showcaseTag.showcaseId));

  const map = new Map<number, ProjectInfo>();

  for (const row of rows) {
    if (!map.has(row.id)) {
      map.set(row.id, {
        id: row.id,
        name: row.name,
        description: row.description,
        url: row.url,
        image: row.image ?? undefined,
        tags: [],
      });
    }

    if (row.tag) {
      map.get(row.id)!.tags.push(row.tag);
    }
  }

  return Array.from(map.values());
};

const seedShowcases = async (db: ReturnType<typeof drizzle>) => {
  const existing = await db.select({ id: showcase.id }).from(showcase).limit(1);

  if (existing.length > 0) {
    return;
  }

  const showcaseRows = await db
    .insert(showcase)
    .values([
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
    ])
    .returning({ id: showcase.id });

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
};
