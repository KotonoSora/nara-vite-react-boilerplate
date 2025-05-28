# Nara Vite React Boilerplate: Cloudflare-First Full-Stack Starter

A modern, production-ready React boilerplate designed for edge computing with Cloudflare Workers and Hono.js. Build globally distributed, lightning-fast applications with a best-in-class developer experience.

---

## 🚀 Why Choose This Boilerplate?

- **Cloudflare-First**: Deploy instantly to 300+ edge locations for sub-100ms response times.
- **Hono.js**: Ultra-light, Express-like API framework optimized for edge environments.
- **React 19 + SSR**: Latest React features, server-side rendering, and file-based routing.
- **TypeScript Everywhere**: End-to-end type safety for frontend, backend, and database.
- **Cloudflare D1 + Drizzle ORM**: Serverless, distributed SQLite with type-safe queries.
- **Tailwind CSS v4 + shadcn/ui**: Rapid, utility-first styling and beautiful, accessible components.
- **Production-Ready**: Built-in testing, analytics, and best practices for modern SaaS, e-commerce, and content platforms.

---

## 🌐 Edge Computing with Cloudflare & Hono.js

- **Global Performance**: Serve users from the nearest edge, eliminating cold starts and latency.
- **Automatic Scaling**: Handles any traffic, scales to zero when idle, pay only for what you use.
- **Enterprise Security**: DDoS protection, WAF, and bot management by default.
- **Developer Experience**: Familiar Express-like API, first-class TypeScript, and rich middleware ecosystem.

---

## 🏗️ Project Structure

```text
nara-vite-react-boilerplate/
├── app/         # Frontend React app (SSR, routes, components, hooks)
├── database/    # Drizzle ORM schema
├── drizzle/     # DB migrations
├── workers/     # Cloudflare Workers API (Hono.js endpoints, tests)
├── public/      # Static assets
├── docs/        # Documentation
├── ...config files (Vite, Wrangler, Drizzle, etc.)
```

| Directory         | Purpose                            |
| ----------------- | ---------------------------------- |
| `app/routes/`     | Add new pages (file-based routing) |
| `app/components/` | Reusable UI components             |
| `workers/api/`    | Backend API endpoints (Hono.js)    |
| `database/`       | Database schema (Drizzle ORM)      |
| `public/`         | Static files (images, icons)       |

---

## ⚡ Quick Start

### Prerequisites

- [Bun](https://bun.sh/) v1+
- Node.js v18+
- Git
- (Recommended) VS Code

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd nara-vite-react-boilerplate
bun install
```

### 2. Database Setup

```bash
bun run db:migrate
```

### 3. Start Development

```bash
bun run dev
# App: http://localhost:5173
```

### 4. Verify

- Homepage: `/`
- Welcome: `/welcome` (try guest book)
- Dashboard: `/dashboard`
- Theme toggle: switch light/dark

---

## 🚀 Production Deployment

```bash
bun run build
bun run deploy
# Live on your Cloudflare Workers domain!
```

---

## 🛠️ Key Technologies

- **React 19**: Server components, concurrent rendering
- **Hono.js**: Fast, minimal API framework for Workers
- **Cloudflare D1**: Distributed SQLite at the edge
- **Drizzle ORM**: Type-safe DB queries & migrations
- **Tailwind CSS v4**: Utility-first, CSS-based config
- **shadcn/ui**: Accessible, customizable React components
- **Vitest**: Fast, Vite-native testing
- **Bun**: Fast runtime, package manager, and test runner
- **Wrangler**: Cloudflare CLI for deployment & DB

---

## 🧑‍💻 Development Workflow

1. **Pull latest**: `git pull origin main`
2. **Install deps**: `bun install`
3. **Migrate DB**: `bun run db:migrate`
4. **Start dev**: `bun run dev`
5. **Test**: `bun run test`
6. **Typecheck**: `bun run typecheck`
7. **Build**: `bun run build`

---

## 🧪 Testing

- **Unit & Integration**: Vitest for components, APIs, and DB
- **API Example**:

  ```typescript
  // workers/tests/book.test.ts
  import { testClient } from "hono/testing";

  import app from "../api/book";

  // ...test code...
  ```

- **Run all tests**: `bun run test`
- **Coverage**: `bun run coverage`

---

## 🖌️ Styling & UI

- **Tailwind v4**: CSS-based config in `app/app.css` (`@theme` block)
- **shadcn/ui**: Pre-built, accessible components in `app/components/ui/`
- **Dark mode**: `ModeSwitcher` component, auto system detection
- **Style guidelines**:

  - Use Tailwind utilities first
  - Follow design tokens in `app/app.css`
  - Test both light/dark themes
  - Mobile-first, accessible, performant

---

## ⚙️ Environment & Deployment

- **Cloudflare credentials**: Set `CF_ACCOUNT_ID`, `CF_AUTH_TOKEN` in `.env`
- **D1 DB**: Created via Wrangler CLI
- **Production migration**: `bun run db:migrate-production`
- **Deploy**: `bun run deploy`
- **Preview**: `npx wrangler versions upload`
- **Promote**: `npx wrangler versions deploy`

---

## 🤝 Contributing

- Fork, clone, `bun install`, `bun run dev`
- Follow TypeScript, component, and commit standards
- Write tests for new features
- Use conventional commits (e.g., `feat: add user profile`)
- See [Project Overview](docs/PROJECT_OVERVIEW.md) for full guide

---

## 🛠️ Common Issues & Solutions

- **DB not found**: `bun run db:migrate`
- **Type errors**: `bun run typecheck`
- **Dev server issues**: Restart with `bun run dev`
- **Port in use**: `lsof -ti:5173 | xargs kill -9`
- **Wrangler auth**: `wrangler auth login`

---

## 📚 Resources

- [Hono.js Docs](https://hono.dev/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Router](https://reactrouter.com/)

---

For a deep dive into architecture, patterns, and advanced usage, see the full [Project Overview](docs/PROJECT_OVERVIEW.md) and code comments.
