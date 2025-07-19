# NARA Boilerplate (Non‑Abstract Reusable App)

A fast, opinionated starter template for building full-stack React apps powered by **React Router v7**, **Cloudflare Workers**, and **modern tooling**. Built with a focus on **type safety**, **performance**, and **developer ergonomics**.

---

## 🧱 Tech Stack

- **Frontend**: React 19.1.0, React Router 7.7.0, TypeScript 5.8.3
- **Styling**: TailwindCSS 4.1.11, shadcn/ui (Radix UI + Lucide icons)
- **Backend**: Hono framework on Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite) + Drizzle ORM
- **Tooling**: Bun, Vite, Vitest
- **Deployment**: Cloudflare Pages & Workers

---

## 🛠 Development System Requirements

Before starting development, ensure your environment meets the following system requirements to maintain compatibility and stability across the project.

### ⚙️ Runtime Environment

- **Bun**: `1.2.18`  
  Install from [https://bun.sh](https://bun.sh) or use your system’s package manager.

- **Node.js**: `v22.17.1`  
  Use [nvm](https://github.com/nvm-sh/nvm) or a similar version manager to install and manage Node versions.

### 🔒 Version Enforcement

> All team members and CI/CD environments **must use the exact versions** listed above.  
> Use `.nvmrc` and `.bun-version` files to help enforce version consistency.

### 📦 Package Manager

> This project **only supports [Bun](https://bun.sh)** as the package manager and script runner.  
> Other tools like `npm`, `yarn`, or `pnpm` are **not supported**.

Verify your setup:

```bash
bun --version   # should output 1.2.18
node --version  # should output v22.17.1
```

---

## 🚀 Quick Start

> **📋 Quick Reference**
>
> **One-Line Setup:** `npx degit KotonoSora/nara-vite-react-boilerplate#main my-project && cd my-project && bun install && bun run db:migrate && bun run dev`
>
> **Key URLs:**
>
> - Development: <http://localhost:5173>
> - Production Preview: <http://localhost:4173>
> - Drizzle Studio: <http://localhost:4983> (when running `bunx drizzle-kit studio`)
>
> **Quick Checks:** ✅ Node v22.17.1 ✅ Bun 1.2.18 ✅ Git installed  
> **Time to first run:** ~5 minutes | **Difficulty:** 🟢 Beginner
>
> **Need Help:** [Developer Onboarding](./docs/DEVELOPER_ONBOARDING.md) | [Troubleshooting](./docs/TROUBLESHOOTING.md) | [Project Documentation](./docs/README.md)

```bash
# Makes copies of git repositories
npx degit KotonoSora/nara-vite-react-boilerplate#main my-new-project
cd my-new-project

# Install dependencies
bun install

# Set up the local database
bun run db:generate
bun run db:migrate

# Start development server
bun run dev
# → http://localhost:5173

# Build production bundle
bun run build

# Preview production locally
bun run start
# → http://localhost:4173

# Deploy to Cloudflare
bun run deploy
```

---

## ✨ Features

- ⚡️ Server-side rendering (SSR) with React Router
- 🔄 Full-stack data loading & mutations
- 🔥 Fast HMR with Vite & Bun
- 🔒 TypeScript-first across frontend & backend
- 🎨 Pre-configured TailwindCSS, shadcn/ui (Radix UI + Lucide icons)
- 🌓 Dark mode + theme persistence
- 📱 Mobile-first responsive layout
- 🗃️ D1 database integration via Drizzle ORM
- ☁️ Cloudflare Workers deployment-ready
- 🧪 Testing with Vitest + Cloudflare Workers test utils
- 📝 Type-safe forms & validation
- 🔔 Toasts with Sonner
- 🧠 SEO metadata & progressive enhancement

---

## 📁 Project Structure

```text
/app
  /components       – Shared UI components
    /ui             – shadcn/ui system
  /features         - Features
  /routes           – File-based routes
  /hooks            – Custom React hooks
  /lib              – Utilities
  root.tsx          – App shell/layout
  entry.server.tsx  – Server entry point
  sessions.server.tsx – Session logic

/workers
  /api              – API route handlers
  app.ts            – Worker entry point

/database
  schema.ts         – Drizzle schema definitions

/drizzle            – Migrations
/public             – Static assets
/docs               – Project docs
```

---

## 🛠️ Development Tasks

```bash
# Install dependencies
bun install

# Database setup
bun run db:generate
bun run db:migrate

# Start dev server
bun run dev
```

### ✅ Testing

```bash
bun run test         # Unit tests
bun run coverage     # Coverage report
bun run typecheck    # TypeScript checks
```

### 🧱 Build

```bash
bun run build        # Production build
bun run start        # Local preview
```

### 🚢 Deploy

```bash
bun run db:migrate-production # Migrate database production
bun run deploy       # Production build and wrangler deploy to cloudflare
```

---

## 🤝 Contributing

- **Style**: TypeScript strict mode, ESLint + Prettier
- **Workflow**:
  1. Fork the repo
  2. Create a branch from `main`
  3. Make changes with types + tests
  4. Run checks: `bun run lint` + `bun run test`
  5. Submit PR with a clear description

### 🚧 Areas to contribute

- Add UI components
- Auth examples
- Performance tips
- Cloudflare Services integrations

---

## 🧰 Template Guide

### Customize

- Edit `package.json` name, description
- Update `wrangler.jsonc` (worker name, D1 config)
- Run `bun run wrangler:types` after changes
- Replace branding assets in `/public/assets`
- Edit `app.css` for theme overrides
- Configure `drizzle.config.ts` with database info

### Extend

- Add routes in `/app/routes/`
- Write APIs in `/workers/api/`
- Define schema in `/database/schema.ts`
- Build UI in `/app/components/`
- Write hooks in `/app/hooks/`

### Tips

- Use `shadcn/ui` CLI: `bunx --bun shadcn@latest add [component]`
- Local env: `.dev.vars`, production env via Cloudflare dashboard
- Stick to structure → easier scaling
- Use React Router’s data APIs + Drizzle’s type-safe queries
- Deploy fast with Cloudflare edge runtime

---

## 🧭 Architecture Patterns

| Pattern                 | Description                       |
| ----------------------- | --------------------------------- |
| File-based routing      | Pages auto-mapped from `/routes/` |
| SSR                     | Fast initial load + SEO           |
| Progressive enhancement | Forms work w/o JS                 |
| Type-safe E2E           | TS from DB to UI                  |
| Edge-first              | Global deployments via Workers    |

---

## 🚢 Deployment

📖 See [CI Deploy Guide](./CI_DEPLOY_GUIDE.md) for full setup via GitHub Actions.

---

## 📄 License

This project is licensed under the **AGPL-3.0** license.

You may use, modify, and deploy this project freely, **but**:

- If you deploy it as a public service (e.g. SaaS), **you must release your full source code**, including any modifications.
- You **may not use this in closed-source/commercial projects** without complying with AGPL-3.0 terms.

---

## 💼 Planned Commercial Edition

We are working on a commercial version of this project with extended features and a license that allows:

- ✅ Use in closed-source projects
- ✅ One-time payment per version
- ✅ No requirement to release your modifications

It will be distributed as a `.zip` file with a commercial license via Gumroad.

Follow this repository to get notified when it’s available

<!-- ---

## 💼 Commercial Edition

A commercial version with extended features and a non-AGPL license is available at:

👉 [https://gumroad.com/kotonsora/nara-boilerplate](https://gumroad.com/kotonsora/nara-boilerplate)

- ✅ Use in closed-source projects
- ✅ One-time payment per version
- ✅ No requirement to release your modifications -->

---

Built with ❤️ by KotonoSora — to help you ship faster and with confidence.
