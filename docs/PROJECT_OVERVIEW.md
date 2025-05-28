# Nara Vite React Boilerplate: Cloudflare-First Full-Stack Starter

A modern, production-ready React boilerplate for building globally distributed, lightning-fast applications on Cloudflare Workers with Hono.js. Enjoy best-in-class developer experience, edge-first performance, and a robust, scalable architecture.

---

## ✨ Features at a Glance

- **Cloudflare-First**: Deploy instantly to 300+ edge locations for sub-100ms response times.
- **Hono.js**: Ultra-light, Express-like API framework optimized for edge environments.
- **React 19 + SSR**: Latest React features, server-side rendering, and file-based routing.
- **TypeScript Everywhere**: End-to-end type safety for frontend, backend, and database.
- **Cloudflare D1 + Drizzle ORM**: Serverless, distributed SQLite with type-safe queries.
- **Tailwind CSS v4 + shadcn/ui**: Rapid, utility-first styling and beautiful, accessible components.
- **Production-Ready**: Built-in testing, analytics, and best practices for SaaS, e-commerce, and content platforms.

---

## 👤 Who is this for?

- Developers building modern SaaS, e-commerce, or content platforms.
- Teams seeking edge performance, scalability, and type safety.
- Anyone who wants a full-stack, batteries-included React starter optimized for Cloudflare.

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

| Directory         | Purpose                                                          |
| ----------------- | ---------------------------------------------------------------- |
| `app/routes/`     | Add new pages (file-based routing, processed by `app/routes.ts`) |
| `app/components/` | Reusable UI components                                           |
| `workers/api/`    | Backend API endpoints (Hono.js)                                  |
| `database/`       | Database schema (Drizzle ORM)                                    |
| `public/`         | Static files (images, icons)                                     |

---

## ⚡ Quick Start

### Prerequisites

- [Bun](https://bun.sh/) v1.2.14
- [Node.js](https://nodejs.org/) v22.16.0
- [Git](https://git-scm.com/) v2.49.0

### 1. Clone & Install

```bash
git clone https://github.com/KotonoSora/nara-vite-react-boilerplate.git
cd nara-vite-react-boilerplate
bun install
```

Alternatively, use `degit` to quickly bootstrap the project into a **new** directory named `your-project-name`:

```bash
npx degit KotonoSora/nara-vite-react-boilerplate your-project-name
cd your-project-name
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

1. **Pull Latest Changes**: `git pull origin main`
2. **Install/Update Dependencies**: `bun install` (ensures your dependencies match `bun.lockb`)
3. **Apply Database Migrations**: `bun run db:migrate` (apply pending schema changes, especially after pulling or changing `database/schema.ts`)
4. **Start Development Server**: `bun run dev`
5. **Run Tests**: `bun run test`
6. **Check Types**: `bun run typecheck`
7. **Build for Production**: `bun run build`

---

## 🧪 Testing

- **Unit & Integration**: Vitest for components, APIs, and DB
- **API Example**: Refer to `workers/tests/book.test.ts` for examples of how API endpoints are tested using Vitest and Hono's testing utilities.
- **Run all tests**: `bun run test`
- **Coverage**: `bun run coverage`

---

## 🖌️ Styling & UI

- **Tailwind v4**: CSS-based config in [`app/app.css`](../app/app.css) (`@theme` block)
- **shadcn/ui**: Pre-built, accessible components in [`app/components/ui/`](../app/components/ui/)
- **Dark mode**: `ModeSwitcher` component, auto system detection
- **Style guidelines**:
  - Use Tailwind utilities first
  - Follow design tokens in `app/app.css`
  - Test both light/dark themes
  - Mobile-first, accessible, performant

---

## ⚙️ Environment & Deployment

- **Cloudflare credentials**: Set `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` (ensure your token has appropriate D1 permissions) in a `.env` file at the project root. This file is used by scripts that interact with Cloudflare, like Drizzle Kit for migration generation.
- **D1 DB**: Created via Wrangler CLI (e.g., `wrangler d1 create <YOUR_DB_NAME>`). Ensure the `database_name` and `database_id` in `wrangler.jsonc` are updated accordingly.
- **Production migration**:
  1. Generate migration SQL files based on your schema changes: `bun run db:generate`
  2. Apply these migrations to your production D1 database using Wrangler (replace `DB` with your D1 binding name if different): `wrangler d1 migrations apply DB --remote`
- **Deploy**: `bun run deploy` (this typically deploys to the default environment specified in `wrangler.jsonc`).
- **Working with Environments**: For staging or multiple deployment targets, configure [Wrangler environments](https://developers.cloudflare.com/workers/wrangler/environments/). Deploy to a specific environment using `wrangler deploy -e <your-env-name>`. For local development that mirrors the Cloudflare environment more closely, use `wrangler dev --remote`.

---

## 🤝 Contributing

- Fork, clone, `bun install`, `bun run dev`
- Follow TypeScript, component, and commit standards
- Write tests for new features
- Use [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat: add user profile`)
- Ensure your contributions align with the guidelines and standards outlined in this document.

---

## 🛠️ Common Issues & Solutions (FAQ)

- **DB not found**: Run `bun run db:migrate` to initialize the local database.
- **Type errors**: Run `bun run typecheck` to check and fix type issues.
- **Dev server issues**: Restart with `bun run dev`.
- **Port in use (e.g., 5173)**:
  - **macOS/Linux**: `lsof -ti:5173 | xargs kill -9`
  - **Windows**: Use `netstat -ano | findstr :5173` to find the Process ID (PID), then `taskkill /PID <PID> /F` to terminate it.
  - Alternatively, configure the development server to use a different port if 5173 is consistently occupied (check Vite configuration).
- **Wrangler auth**: Run `wrangler login` to authenticate with your Cloudflare account.

---

## 📚 Resources

- [Hono.js Docs](https://hono.dev/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Router](https://reactrouter.com/)

---

For a deep dive into architecture, patterns, and advanced usage, see the code comments and this Project Overview.
