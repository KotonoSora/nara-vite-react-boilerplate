---
title: "Package @kotonosora/blog Engine Features"
description: "Blog publishing system with content rendering, virtual scrolling, and analytics integration"
date: "2026-02-22"
published: true
author: "Development Team"
tags: ["blog", "content", "publishing", "blog-engine"]
---

# @kotonosora/blog Engine Features

## Overview

`@kotonosora/blog` is a blog publishing and rendering engine providing components for displaying blog posts, handling content virtualization for performance, and integrating with analytics tracking.

## Package Information

- **Name**: `@kotonosora/blog`
- **Version**: 0.0.1
- **Type**: React component library
- **Location**: `packages/blog/`
- **Dependencies**:
  - `@kotonosora/ui` (workspace) - UI components
  - `@kotonosora/i18n-react` (workspace) - Translations
  - `@kotonosora/google-analytics` (workspace) - Analytics
  - `react`, `react-dom` (19.2.4)
  - `lucide-react` (0.563.0) - Icons
  - `date-fns` (4.1.0) - Date formatting
  - `react-virtuoso` (4.18.1) - Virtual scrolling

## Architecture

### Component Structure

```
packages/blog/
├── src/
│   ├── components/
│   │   ├── BlogPostList.tsx       # Virtualized list of posts
│   │   ├── BlogPostCard.tsx       # Individual post card
│   │   ├── BlogPostReader.tsx     # Full post view
│   │   ├── BlogCategoryFilter.tsx # Category filtering
│   │   ├── BlogSearch.tsx         # Search functionality
│   │   └── BlogMetadata.tsx       # Post metadata (author, date, etc.)
│   ├── hooks/
│   │   ├── useBlogPosts.ts        # Fetch blog posts
│   │   ├── useBlogSearch.ts       # Search logic
│   │   └── useBlogAnalytics.ts    # Track blog metrics
│   ├── utils/
│   │   ├── parsePost.ts           # Parse blog markdown
│   │   ├── formatPostDate.ts      # Date formatting
│   │   └── generateExcerpt.ts     # Create post summary
│   ├── types/
│   │   └── blog.types.ts          # TypeScript interfaces
│   ├── styles/
│   │   └── custom.css             # Blog styles
│   └── index.ts                   # Main exports
└── package.json
```

## Core Components

### BlogPostList (Virtual Scrolling)

Efficiently renders large lists of blog posts using `react-virtuoso`:

```typescript
import { BlogPostList } from '@kotonosora/blog'

export function BlogsPage() {
  const posts = [
    { id: '1', title: 'Post 1', excerpt: '...', date: '2026-02-22' },
    { id: '2', title: 'Post 2', excerpt: '...', date: '2026-02-21' },
    // ... hundreds more
  ]

  return (
    <BlogPostList
      posts={posts}
      onPostClick={(post) => navigate(`/blog/${post.id}`)}
      isLoading={false}
    />
  )
}
```

**Features:**

- Virtual scrolling for thousands of posts
- Automatic height calculation
- Smooth scrolling performance
- Lazy loading support

### BlogPostCard

Display individual post in list:

```typescript
import { BlogPostCard } from '@kotonosora/blog'

export function PostInList({ post }) {
  return (
    <BlogPostCard
      title={post.title}
      excerpt={post.excerpt}
      author={post.author}
      date={post.date}
      image={post.coverImage}
      category={post.category}
      readTime={post.readTime}
      onClick={() => handleSelect(post)}
    />
  )
}
```

**Card Properties:**

- Post title, excerpt, author
- Publication date with formatting
- Cover image with fallback
- Category badge
- Estimated read time
- Click handler for navigation

### BlogPostReader

Full post rendering component:

```typescript
import { BlogPostReader } from '@kotonosora/blog'

export function FullPost({ post, relatedPosts }) {
  return (
    <BlogPostReader
      post={post}
      onNavigate={(direction) => loadAdjacentPost(direction)}
      relatedPosts={relatedPosts}
      enableComments={true}
    />
  )
}
```

**Features:**

- Full markdown/MDX rendering
- Table of contents generation
- Code syntax highlighting
- Image optimization
- Navigation between posts
- Related posts suggestions
- Comment section integration

### BlogCategoryFilter

Filter posts by category:

```typescript
import { BlogCategoryFilter } from '@kotonosora/blog'

export function BlogWithFiltering() {
  const [category, setCategory] = useState<string | null>(null)

  return (
    <div>
      <BlogCategoryFilter
        categories={['React', 'TypeScript', 'Web Dev']}
        selected={category}
        onChange={setCategory}
      />
      <BlogPostList
        posts={filterPostsByCategory(posts, category)}
      />
    </div>
  )
}
```

### BlogSearch

Search across blog posts:

```typescript
import { BlogSearch } from '@kotonosora/blog'
import { useBlogSearch } from '@kotonosora/blog'

export function SearchableBlog() {
  const { results, isSearching, search } = useBlogSearch()

  return (
    <>
      <BlogSearch
        onSearch={(query) => search(query)}
        placeholder="Search articles..."
        isLoading={isSearching}
      />
      <BlogPostList posts={results} />
    </>
  )
}
```

## Custom Hooks

### useBlogPosts

Fetch and manage blog posts:

```typescript
import { useBlogPosts } from '@kotonosora/blog'

export function BlogPage() {
  const {
    posts,
    totalCount,
    isLoading,
    error,
    loadMore,
    refresh
  } = useBlogPosts({
    pageSize: 20,
    category: 'React',
    sortBy: 'published_at'
  })

  if (isLoading) return <Spinner />
  if (error) return <ErrorMessage error={error} />

  return (
    <>
      <BlogPostList posts={posts} />
      {posts.length < totalCount && (
        <Button onClick={loadMore}>Load More</Button>
      )}
    </>
  )
}
```

**Options:**

- `pageSize` - Posts per page (default: 10)
- `category` - Filter by category
- `sortBy` - Sort field (published_at, updated_at, title)
- `author` - Filter by author
- `searchQuery` - Filter by search term

### useBlogSearch

Search posts:

```typescript
import { useBlogSearch } from '@kotonosora/blog'

export function SearchComponent() {
  const { results, isSearching, search } = useBlogSearch({
    minChars: 2,
    debounceMs: 300
  })

  const handleSearch = (query: string) => {
    search(query)
  }

  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isSearching && <Spinner />}
      <ul>
        {results.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

**Features:**

- Debounced search queries
- Minimum character threshold
- Case-insensitive matching
- Partial word matching

### useBlogAnalytics

Track blog engagement:

```typescript
import { useBlogAnalytics } from '@kotonosora/blog'

export function BlogPostWithTracking({ post }) {
  const {
    trackPostView,
    trackTimeSpent,
    trackScroll
  } = useBlogAnalytics()

  useEffect(() => {
    trackPostView(post.id)

    return () => {
      trackTimeSpent(post.id, timeOnPage)
    }
  }, [post.id])

  return <BlogPostReader post={post} onScroll={trackScroll} />
}
```

**Events Tracked:**

- `trackPostView(postId)` - User viewed post
- `trackTimeSpent(postId, seconds)` - Time spent on post
- `trackScroll(postId, scrollPercent)` - Scroll depth
- `trackShare(postId, platform)` - Social shares
- `trackComment(postId)` - Comment added

## Blog Data Structure

### Post Type Definition

```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown/MDX
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  image?: string; // Cover image URL
  published: boolean;
  publishedAt: Date;
  updatedAt: Date;
  readTime: number; // Minutes
  views: number;
  likes: number;
}
```

## Integration Patterns

### With React Router

```typescript
// Route: ($lang).blog._index.tsx
import { useBlogPosts } from '@kotonosora/blog'
import { BlogPostList } from '@kotonosora/blog'

export const loader = async () => {
  const posts = await fetchBlogPosts()
  return { posts }
}

export default function BlogList({ loaderData }: Route.ComponentProps) {
  return <BlogPostList posts={loaderData.posts} />
}

// Route: ($lang).blog.$.tsx
export const loader = async ({ params }: Route.LoaderArgs) => {
  const post = await fetchPostBySlug(params['*'])
  return { post }
}

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  return <BlogPostReader post={loaderData.post} />
}
```

### With Analytics

```typescript
import { useGoogleAnalytics } from '@kotonosora/google-analytics'
import { useBlogAnalytics } from '@kotonosora/blog'

export function BlogPostPage({ post }) {
  const { trackEvent } = useGoogleAnalytics()
  const { trackPostView } = useBlogAnalytics()

  useEffect(() => {
    trackPostView(post.id)
    trackEvent('blog_post_viewed', {
      post_id: post.id,
      post_title: post.title,
      category: post.category
    })
  }, [post.id])

  return <BlogPostReader post={post} />
}
```

### With i18n

```typescript
import { useTranslation } from '@kotonosora/i18n-react'
import { BlogPostCard } from '@kotonosora/blog'

export function LocalizedBlogCard({ post }) {
  const { t } = useTranslation()

  return (
    <BlogPostCard
      title={post.title}
      excerpt={post.excerpt}
      date={post.publishedAt}
      readTime={post.readTime}
      label={t('blog.read_time', { time: post.readTime })}
    />
  )
}
```

## Performance Optimization

### Virtual Scrolling Benefits

The `react-virtuoso` integration provides:

```typescript
// Only visible items are rendered
// ~20 items visible → renders ~20 DOM nodes
// Not 1000 items → 1000 DOM nodes

// Smooth scrolling at 60fps
// Automatic height calculation
// Works with dynamic heights
```

### Image Optimization

```typescript
import { BlogPostCard } from '@kotonosora/blog'

export function OptimizedCard({ post }) {
  return (
    <BlogPostCard
      image={post.image}
      imageAlt={post.title}
      imageLazy={true}        // Lazy load images
      imageOptimization="0.8" // 80% load optimization
    />
  )
}
```

### Pagination vs Infinite Scroll

```typescript
// Pagination approach
<BlogPostList
  posts={currentPagePosts}
  pagination={{
    currentPage,
    totalPages,
    onPageChange: setCurrentPage
  }}
/>

// Infinite scroll with virtualization
const { posts, loadMore } = useBlogPosts({ pageSize: 20 })

return (
  <InfiniteScroll
    dataLength={posts.length}
    next={loadMore}
    hasMore={hasMorePosts}
  >
    <BlogPostList posts={posts} />
  </InfiniteScroll>
)
```

## Styling

### Custom CSS

`packages/blog/src/styles/custom.css`:

```css
.blog-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-size: 1.1rem;
  line-height: 1.8;
}

.blog-post-card {
  border-radius: 0.5rem;
  overflow: hidden;
  transition: all 0.2s ease;
}

.blog-post-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.blog-post-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.blog-post-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #666;
}
```

## Testing

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BlogPostCard } from '@kotonosora/blog'

describe('BlogPostCard', () => {
  it('renders post information', () => {
    const post = {
      id: '1',
      title: 'Test Post',
      excerpt: 'Test excerpt',
      author: { name: 'John', email: 'john@example.com' },
      date: new Date(),
      readTime: 5
    }

    render(<BlogPostCard {...post} />)

    expect(screen.getByText('Test Post')).toBeInTheDocument()
    expect(screen.getByText('Test excerpt')).toBeInTheDocument()
    expect(screen.getByText('John')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    const post = { /* ... */ }

    render(<BlogPostCard {...post} onClick={onClick} />)

    await userEvent.click(screen.getByRole('article'))
    expect(onClick).toHaveBeenCalled()
  })
})
```

## Best Practices

1. **Use Virtual Scrolling**: For lists with 100+ items
2. **Lazy Load Images**: Set `imageLazy={true}` on cards
3. **Track Engagement**: Integrate with analytics to understand reader behavior
4. **Optimize Assets**: Compress and optimize cover images
5. **SEO-Friendly URLs**: Use descriptive slugs (e.g., `my-blog-post-title`)
6. **Structure Metadata**: Include proper frontmatter for sorting/filtering
7. **Cache Posts**: Use React Router loaders with caching
8. **Pagination**: Choose pagination vs infinite scroll based on UX needs

---

The blog engine provides a complete solution for publishing, discovering, and tracking content across the NARA application.
