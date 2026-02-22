/**
 * Global cache for loaded blog post components
 * This is used to share content between middleware and components without serialization
 */
const contentCache = new Map<string, React.ComponentType<any>>();

export function setContentCache(
  slug: string,
  component: React.ComponentType<any>,
) {
  contentCache.set(slug, component);
}

export function getContentCache(slug: string) {
  return contentCache.get(slug);
}

export function clearContentCache(slug?: string) {
  if (slug) {
    contentCache.delete(slug);
  } else {
    contentCache.clear();
  }
}
