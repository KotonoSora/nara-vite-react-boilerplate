---
title: Blog Feature
description: MDX/MD Rendering System
date: 2025-11-16
author: KotonoSora
tags: [React, TypeScript, Tutorial]
published: true
---

## Blog Feature - MDX/MD Rendering System

Optimized blog system with dynamic MDX/MD file loading, type safety, and flexible content management.

## Features

- ✅ **Dynamic Loading**: Automatically loads MDX and MD files based on slug
- ✅ **Type Safety**: Full TypeScript support with generated types
- ✅ **Flexible Structure**: Supports both `slug.mdx` and `slug/index.mdx` patterns
- ✅ **Rich Formatting**: Pre-configured MDX components with Tailwind styling
- ✅ **Frontmatter Support**: Extract metadata from blog posts
- ✅ **SEO Optimized**: Automatic meta tags from frontmatter
- ✅ **Error Handling**: Proper 404 handling for missing posts
- ✅ **Sorted Posts**: Automatically sorts by date (newest first)

## File Structure

```
app/features/blog/
├── config/
│   └── mdx-components.tsx      # Centralized MDX component styling
├── content/
│   ├── example.mdx             # Blog post example
│   ├── getting-started.mdx     # Sample post 1
│   └── typescript-tips.md      # Sample post 2 (MD format)
├── components/
│   ├── home-page.tsx           # Blog listing page
│   ├── slug-page.tsx           # Individual blog post page
│   └── slug-hydrate-fallback.tsx
├── middleware/
│   ├── blog-middleware.ts
│   └── slug-blog-middleware.tsx # Handles dynamic post loading
├── utils/
│   └── mdx-loader.ts           # Core loading logic
└── types/
    └── type.ts                 # TypeScript definitions
```

## Usage

### Creating a New Blog Post

Create a new MDX or MD file in `app/features/blog/content/`:

```mdx
---
title: Your Post Title
description: A brief description
date: 2025-01-15
author: Your Name
tags: [React, TypeScript]
published: true
---

## Your Content Here

Write your blog post using Markdown syntax...
```

### Accessing Blog Posts

- **List all posts**: `/blog` - Shows all published posts
- **Individual post**: `/blog/slug-name` - Displays single post

### Supported File Patterns

The loader checks these paths in order:

1. `/content/slug.mdx`
2. `/content/slug.md`
3. `/content/slug/index.mdx`
4. `/content/slug/index.md`

## Frontmatter Fields

| Field         | Type     | Required | Description                    |
| ------------- | -------- | -------- | ------------------------------ |
| `title`       | string   | ✅       | Post title (used in meta tags) |
| `description` | string   | ❌       | Brief description (SEO)        |
| `date`        | string   | ❌       | Publication date (ISO format)  |
| `author`      | string   | ❌       | Author name                    |
| `tags`        | string[] | ❌       | Post categories/tags           |
| `image`       | string   | ❌       | Featured image URL             |
| `published`   | boolean  | ❌       | Publish status (default: true) |

## MDX Components

Pre-styled components available in all MDX files:

- **Typography**: h1-h6, p, blockquote, hr
- **Lists**: ul, ol, li
- **Code**: code (inline), pre (blocks with syntax highlighting)
- **Tables**: table, thead, tbody, tr, th, td
- **Links & Images**: a, img
- **Diagrams**: Mermaid support via `mermaid` component

### Using Components in MDX

```mdx
import MyImage from "~/assets/image.svg?no-inline";
import { Spinner } from "~/components/ui/spinner";

<Spinner className="size-8" />

<img src={MyImage} alt="Description" />
```

## API Reference

### `loadBlogPost(slug: string)`

Load a single blog post by slug.

```typescript
const post = await loadBlogPost("getting-started");
// Returns: BlogPost | null
```

### `getAllBlogPosts()`

Get all published blog posts, sorted by date.

```typescript
const posts = await getAllBlogPosts();
// Returns: BlogPost[]
```

### `getBlogPostsMetadata()`

Get metadata for all available posts without loading content.

```typescript
const metadata = getBlogPostsMetadata();
// Returns: Array<{ slug: string; path: string }>
```

## Type Definitions

### BlogPost

```typescript
interface BlogPost {
  slug: string;
  content: ComponentType;
  frontmatter: BlogFrontmatter;
}
```

### BlogFrontmatter

```typescript
interface BlogFrontmatter {
  title: string;
  description?: string;
  date?: string;
  author?: string;
  tags?: string[];
  image?: string;
  published?: boolean;
}
```

## Optimization Features

1. **Dynamic Imports**: Uses Vite's `import.meta.glob` for code splitting
2. **Lazy Loading**: Posts loaded only when needed
3. **Error Recovery**: Graceful fallback for missing/invalid posts
4. **Type Generation**: React Router auto-generates route types
5. **SEO Meta Tags**: Automatic meta tag generation from frontmatter

## Extending

### Add Custom MDX Components

Edit `app/features/blog/config/mdx-components.tsx`:

```typescript
export const mdxComponents = {
  // ... existing components
  CustomComponent: (props) => <div className="custom-style" {...props} />,
};
```

### Add Content Filters

Extend `getAllBlogPosts()` in `mdx-loader.ts`:

```typescript
export async function getPostsByTag(tag: string) {
  const allPosts = await getAllBlogPosts();
  return allPosts.filter((post) => post.frontmatter.tags?.includes(tag));
}
```

## Troubleshooting

### Post Not Found (404)

- Check file exists in `app/features/blog/content/`
- Verify filename matches URL slug
- Ensure `published` field isn't set to `false`

### Frontmatter Not Parsed

- Verify frontmatter is between `---` markers
- Check YAML syntax is valid
- Ensure `remark-mdx-frontmatter` plugin is configured

### Styles Not Applied

- Check MDX components are imported from `config/mdx-components.tsx`
- Verify Tailwind classes are valid
- Ensure `custom.css` is loaded in route

## Performance Tips

1. Keep individual posts under 100KB for optimal loading
2. Use lazy image loading for media-heavy posts
3. Minimize frontmatter complexity
4. Consider pagination for large post lists
