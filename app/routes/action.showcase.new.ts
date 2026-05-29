import { data } from "react-router";

import type { Route } from "./+types/action.showcase.new";

import { DatabaseContext } from "~/lib/context/server";

export function loader({ request }: Route.LoaderArgs) {
  return data(
    {},
    {
      status: 302,
      headers: {
        Location: request.headers.get("referer") || "/",
      },
    },
  );
}

export async function action({ request, context }: Route.ActionArgs) {
  try {
    const formData = await request.formData();

    const raw = {
      name: formData.get("name") ?? "",
      description: formData.get("description") ?? "",
      url: formData.get("url") ?? "",
      image: formData.get("image") ?? "",
      publishedAt: formData.get("publishedAt") ?? "",
      authorId: formData.get("authorId") ?? "",
      tags: formData.getAll("tags"),
    };

    const { createShowcaseSchema, parseValidationErrors } =
      await import("~/features/landing-page/schemas/create-showcase.schema");
    const { createShowcaseService } =
      await import("~/workers/api/showcase/create/create-showcase.service");

    const result = createShowcaseSchema.safeParse(raw);
    if (!result.success) {
      const fieldErrors = parseValidationErrors(result);
      return data({ error: "Validation failed", fieldErrors }, { status: 400 });
    }

    const { name, description, url, image, publishedAt, authorId, tags } =
      result.data;
    const imageValue = image && image.length ? image : undefined;
    const publishedAtDate =
      publishedAt instanceof Date ? publishedAt : undefined;
    const authorIdValue = authorId && authorId.length ? authorId : undefined;

    const db = context.get(DatabaseContext);
    if (!db) {
      return data({ error: "Database not available" }, { status: 500 });
    }
    const showcase = await createShowcaseService(db, {
      name,
      description,
      url,
      image: imageValue,
      publishedAt: publishedAtDate,
      tags,
      authorId: authorIdValue,
    });

    return data({ success: true, showcase }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create showcase";
    return data({ error: message }, { status: 500 });
  }
}
