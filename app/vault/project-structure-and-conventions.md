---
title: "Project Structure and Conventions"
description: "Directory organization, file naming conventions, routing patterns, and development standards"
date: "2026-02-22"
published: true
author: "Development Team"
tags: ["structure", "conventions", "routing", "file-organization"]
---

# Project Structure and Conventions

## File Organization

### Root Level

| File/Folder              | Purpose                                                  |
| ------------------------ | -------------------------------------------------------- |
| `app/`                   | Application source code (routes, components, middleware) |
| `packages/`              | Workspace packages for features and libraries            |
| `workers/`               | Cloudflare Worker backend implementation                 |
| `database/`              | Database schema and migration contracts                  |
| `drizzle/`               | Generated migration files                                |
| `build/`                 | Build output (client and server bundles)                 |
| `public/`                | Static assets (robots.txt, fonts, images)                |
| `vite.config.ts`         | Vite build configuration                                 |
| `react-router.config.ts` | React Router SSR configuration                           |
| `drizzle.config.ts`      | Database migration configuration                         |
| `tsconfig.json`          | TypeScript configuration                                 |
| `package.json`           | Workspace root dependencies                              |
| `wrangler.jsonc`         | Cloudflare Worker configuration                          |

### App Directory Structure

```
app/
├── entry.server.tsx          # Server-side rendering entry point
├── root.tsx                  # Root layout component
├── app.css                   # Global styles
├── routes.ts                 # Route configuration metadata
│
├── routes/                   # React Router file-based routes
│   ├── ($lang)._index.tsx             # Home page: /
│   ├── ($lang).dashboard._index.tsx   # Dashboard: /dashboard
│   ├── ($lang).blog._index.tsx        # Blog list: /blog
│   ├── ($lang).blog.$.tsx             # Blog post: /blog/:slug
│   ├── action.login.ts                # Login action handler
│   └── ... more routes
│
├── features/                 # Feature-specific components and logic
│   ├── landing-page/         # Landing page components
│   ├── dashboard/            # Dashboard feature
│   ├── blog/                 # Blog feature
│   ├── calendar/             # Calendar feature
│   ├── admin/                # Admin panel
│   └── shared/               # Shared components across features
│
├── hooks/                    # Custom React hooks
│   ├── use-theme-mode.ts     # Theme switching hook
│   ├── use-lazy-import.ts    # Lazy loading hook
│   └── ... more hooks
│
├── lib/                      # Shared libraries and utilities
│   ├── authentication/       # Auth logic (server and client)
│   ├── i18n/                 # Internationalization setup
│   ├── theme/                # Theme configuration
│   └── ... more utilities
│
├── middleware/               # Request/response middleware
│   ├── auth.ts               # Authentication context
│   ├── i18n.ts               # Language detection
│   ├── theme.ts              # Theme application
│   └── information.ts        # Request metadata
│
├── styles/                   # Global and component styles
│   ├── custom.css            # Custom CSS definitions
│   └── ... more stylesheets
│
└── vault/                    # Documentation and blog content
    ├── _template-post-md.md          # Markdown template
    ├── _template-post-mdx.mdx        # MDX (React) template
    ├── example-post-md.md            # Example markdown post
    ├── example-post-mdx.mdx          # Example MDX post
    └── ... documentation files
```

### Packages Structure

Each package in `packages/` follows a standard structure:

```
packages/[package-name]/
├── src/
│   ├── index.ts              # Main export file
│   ├── components/           # React components (if UI package)
│   │   └── ... component files
│   ├── hooks/                # Custom hooks (if applicable)
│   ├── utils/                # Utility functions
│   ├── types/                # TypeScript type definitions
│   ├── styles/               # Component or package styles
│   └── ... feature folders
├── package.json              # Package metadata
└── tsconfig.json             # Package-specific TS config
```

### Specific Package Details

**@kotonosora/ui**

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── ui/               # 40+ UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ... more
│   │   └── icons/
│   ├── styles/
│   │   └── components.css
│   └── index.ts              # Named exports for all components
└── package.json              # Granular exports per component
```

**@kotonosora/blog**

```
packages/blog/
├── src/
│   ├── components/           # Blog rendering components
│   ├── hooks/                # Blog-specific hooks
│   ├── utils/                # Blog utilities
│   ├── styles/
│   │   └── custom.css
│   └── index.ts
└── package.json
```

**@kotonosora/i18n**

```
packages/i18n/
├── src/
│   ├── index.ts              # Core i18n configuration
│   ├── types.ts              # Translation type definitions
│   └── locales/              # Locale data (shared with i18n-locales)
└── package.json
```

### Database Structure

```
database/
├── schema.ts                 # Drizzle ORM table definitions
├── contracts/                # Database type contracts
│   ├── user.contract.ts
│   └── ... more contracts
└── schema/                   # Schema documentation
    ├── tables.md
    └── ... schema docs

drizzle/
├── 0000_nervous_greymalkin.sql  # Migration files (auto-generated)
└── meta/                        # Migration metadata

workers/
├── app.ts                    # Hono app initialization
├── routes.ts                 # API route mounting
├── api/                      # API endpoint implementations
│   ├── users.ts
│   ├── auth.ts
│   └── ... more endpoints
└── middleware/               # Worker-level middleware
```

## Naming Conventions

### File Naming

| Type             | Convention                      | Examples                        |
| ---------------- | ------------------------------- | ------------------------------- |
| React Components | PascalCase `.tsx`               | `Dashboard.tsx`, `UserCard.tsx` |
| Hooks            | camelCase with `use` prefix     | `useThemeMode.ts`, `useAuth.ts` |
| Utilities        | camelCase `.ts`                 | `formatDate.ts`, `parseUrl.ts`  |
| Middleware       | camelCase `.ts`                 | `auth.ts`, `i18n.ts`            |
| Database Schema  | camelCase `.ts`                 | `schema.ts`, `contracts.ts`     |
| Types/Interfaces | PascalCase `.ts` or `.d.ts`     | `User.ts`, `Database.types.ts`  |
| Constants        | UPPER_SNAKE_CASE                | `API_ENDPOINTS.ts`, `CONFIG.ts` |
| Tests            | `.test.ts` or `.spec.ts` suffix | `auth.test.ts`                  |

### Route File Naming

React Router uses file system routing with special conventions:

| Pattern                 | URL                | Notes                            |
| ----------------------- | ------------------ | -------------------------------- |
| `index.tsx`             | `/`                | Root route                       |
| `dashboard.tsx`         | `/dashboard`       | Simple route                     |
| `($lang).dashboard.tsx` | `/:lang/dashboard` | Path parameter                   |
| `blog.$.tsx`            | `/blog/*`          | Catch-all/splat route            |
| `_layout.tsx`           | _(no URL)_         | Layout route (underscore prefix) |
| `action.login.ts`       | POST `/login`      | Form action handler              |
| `loader.data.ts`        | GET on route       | Data loader                      |

### Action/Loader Naming

```
action.[feature].ts          # Action for specific feature
action.[feature].[operation].ts  # Specific operation
loader.[feature].ts          # Data loader for feature
```

Examples:

- `action.logout.ts` → Logout action
- `action.showcase.publish.ts` → Publish showcase action
- `loader.dashboard.ts` → Load dashboard data

## Component Organization

### Feature-Based Structure

Each feature in `app/features/` is self-contained:

```
app/features/dashboard/
├── components/
│   ├── DashboardLayout.tsx
│   ├── StatsCard.tsx
│   └── ActivityChart.tsx
├── hooks/
│   └── useDashboardData.ts
├── types/
│   └── dashboard.types.ts
├── utils/
│   └── calculateStats.ts
├── styles/
│   └── dashboard.css
└── index.ts               # Barrel export
```

### Shared Components

Components used across multiple features go in `app/features/shared/`:

```
app/features/shared/
├── Layout/
│   ├── MainLayout.tsx
│   ├── Sidebar.tsx
│   └── Header.tsx
├── Dialogs/
│   ├── ConfirmDialog.tsx
│   └── FormDialog.tsx
├── Cards/
│   ├── DataCard.tsx
│   └── StatsCard.tsx
└── index.ts
```

## Import Path Conventions

### Path Aliases (via tsconfig.json)

```json
{
  "compilerOptions": {
    "paths": {
      "~/*": ["./app/*"],
      "@/*": ["./packages/*"],
      "@kotonosora/*": ["./packages/*/src/*"]
    }
  }
}
```

### Import Examples

```typescript
// Feature components
import { useI18n } from "@kotonosora/i18n-react";
// Packages
import { Button } from "@kotonosora/ui/components/ui/button";
import { formatCurrency } from "@kotonosora/utils";

import { DashboardLayout } from "~/features/dashboard";
import { MainLayout } from "~/features/shared";
import { useThemeMode } from "~/hooks/use-theme-mode";
// App utilities
import { authMiddleware } from "~/middleware/auth";

// Relative imports (less preferred)
import { calculateStats } from "../utils/calculateStats";
```

## Middleware Chains

Middleware processes requests in order. In `root.tsx`:

```typescript
import { authMiddleware } from "~/middleware/auth";
import { i18nMiddleware } from "~/middleware/i18n";
import { infoMiddleware } from "~/middleware/information";
import { themeMiddleware } from "~/middleware/theme";

// Applied in sequence
export const middleware = [
  infoMiddleware, // 1. Request metadata
  i18nMiddleware, // 2. Language detection
  themeMiddleware, // 3. Theme application
  authMiddleware, // 4. User authentication (last so context is complete)
];
```

## Database Conventions

### Schema Naming

```typescript
// tables/schemas are lowercase_snake_case
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  createdAt: integer("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Relations use camelCase in TypeScript
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));
```

### Type Exports

```typescript
// From database/schema.ts
export type User = typeof users.$inferSelect; // For reading
export type NewUser = typeof users.$inferInsert; // For creating
```

## Environment Configuration

### Configuration Files

| File                | Purpose                     |
| ------------------- | --------------------------- |
| `.env.local`        | Local secrets (git-ignored) |
| `wrangler.jsonc`    | Worker configuration        |
| `vite.config.ts`    | Build configuration         |
| `tsconfig.json`     | TypeScript configuration    |
| `drizzle.config.ts` | Database configuration      |

### Environment Variables

```bash
# .env.local
NODE_ENV=development
CLOUDFLARE_ACCOUNT_ID=abc123
CLOUDFLARE_API_TOKEN=xyz789
CLOUDFLARE_D1_DATABASE_ID=db-id
```

Accessed in code:

```typescript
// On server
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

// On client (public only)
const apiUrl = import.meta.env.VITE_API_URL;
```

## Code Organization Best Practices

### Keep Components Focused

- One primary component per file
- Related types/interfaces in same file
- Styles co-located or in adjacent CSS module

### Export Patterns

```typescript
// Feature barrel export (index.ts)
export { DashboardLayout } from "./components/DashboardLayout";
export { StatsCard } from "./components/StatsCard";
export { useDashboardData } from "./hooks/useDashboardData";
export * as DashboardTypes from "./types";
```

### Avoid Circular Dependencies

- Use explicit imports
- Organize by layer (middleware → hooks → components)
- Use barrel exports at feature boundaries

### API Route Organization

In `workers/api/`:

```typescript
// Each domain gets a file
// api/users.ts
export const router = new Hono();

router.post("/", validateRequest, createUser);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
```

---

Following these conventions ensures consistent code organization, makes navigation easier for developers and AI systems, and scales well as the project grows.
