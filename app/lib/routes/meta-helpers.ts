export function metaFromLoaderData(
  data: { meta?: { title?: string; description?: string } } | null | undefined,
) {
  if (!data || !("meta" in data) || !data.meta) return null;
  const { title, description } = data.meta;
  if (!title && !description) return null;
  const out: Array<Record<string, string>> = [];
  if (title) out.push({ title: `${title} - NARA` });
  if (description) out.push({ name: "description", content: description });
  return out;
}
