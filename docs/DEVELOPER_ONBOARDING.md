# Developer Onboarding Guide

Welcome to the NARA (Non‑Abstract Reusable App) boilerplate! This guide will help you get up and running as a developer on this project.

---

## 🚀 Quick Setup Checklist

### Prerequisites
- [ ] **Node.js v22.17.0** (use `.nvmrc`: `nvm use`)
- [ ] **Bun 1.2.18** (install from [bun.sh](https://bun.sh))
- [ ] **Git** for version control
- [ ] **VS Code** (recommended) with suggested extensions

### Initial Setup
- [ ] Clone the repository
- [ ] Run `bun install` to install dependencies
- [ ] Set up environment variables (see [Environment Setup](#environment-setup))
- [ ] Initialize database: `bun run db:generate && bun run db:migrate`
- [ ] Start development server: `bun run dev`
- [ ] Verify setup by visiting `http://localhost:5173`

---

## 📁 Understanding the Project Structure

The NARA boilerplate follows a feature-based architecture with clear separation of concerns:

```
/app
  /components       # Shared UI components (shadcn/ui system)
  /features         # Feature-based modules (landing-page, showcases)
  /routes           # File-based routing (React Router v7)
  /hooks            # Custom React hooks
  /lib              # Utility functions and shared logic
  root.tsx          # App shell and layout
  entry.server.tsx  # Server-side rendering entry point

/workers            # Cloudflare Workers backend
  /api              # API route handlers (Hono framework)
  app.ts            # Worker entry point

/database           # Database layer
  schema.ts         # Drizzle ORM schema definitions

/docs               # Project documentation
```

### Key Concepts

**1. Feature-Based Organization**
- Each feature lives in `/app/features/[feature-name]/`
- Features contain their own components, utils, types, and context
- Features export a main `page.tsx` component

**2. File-Based Routing**
- Routes are defined by file structure in `/app/routes/`
- Use `_index.tsx` for index routes
- Use `action.*.ts` for server actions
- Route types are automatically generated

**3. Full-Stack Integration**
- Frontend (React Router v7) + Backend (Hono on Cloudflare Workers)
- Type-safe end-to-end with TypeScript
- Database integration via Drizzle ORM + Cloudflare D1

---

## 🛠 Development Workflow

### Day-to-Day Development

1. **Start Development Server**
   ```bash
   bun run dev
   # → Frontend: http://localhost:5173
   # → API: Available through React Router proxy
   ```

2. **Run Tests**
   ```bash
   bun run test          # Run tests
   bun run test --ui     # Run tests with UI
   bun run coverage      # Generate coverage report
   ```

3. **Type Checking**
   ```bash
   bun run typecheck     # TypeScript + React Router type generation
   bun run lint          # TypeScript no-emit check
   ```

4. **Database Operations**
   ```bash
   bun run db:generate   # Generate migrations from schema changes
   bun run db:migrate    # Apply migrations locally
   ```

### Code Quality Checks

The project enforces code quality through:
- **TypeScript** strict mode
- **Prettier** for code formatting
- **Commitlint** for commit message convention
- **Husky** for pre-commit hooks
- **Vitest** for testing

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add user authentication
fix: resolve database connection issue
docs: update API documentation
style: fix code formatting
refactor: restructure user components
test: add unit tests for auth flow
chore: update dependencies
```

---

## 🧩 Core Technologies Overview

### Frontend Stack
- **React 19.1.0** - UI library with latest features
- **React Router v7** - File-based routing with SSR
- **TypeScript 5.8.3** - Type safety
- **TailwindCSS 4.1.11** - Utility-first styling
- **shadcn/ui** - Component system built on Radix UI

### Backend Stack
- **Hono 4.8.5** - Lightweight web framework
- **Cloudflare Workers** - Edge runtime environment
- **Cloudflare D1** - SQLite database
- **Drizzle ORM** - Type-safe database operations

### Development Tools
- **Bun** - Fast package manager and runtime
- **Vite** - Build tool with HMR
- **Vitest** - Testing framework
- **Wrangler** - Cloudflare development CLI

---

## 🌐 Environment Setup

### Local Development

1. **Copy environment template:**
   ```bash
   cp .dev.vars.example .dev.vars
   ```

2. **Configure variables in `.dev.vars`:**
   ```bash
   # Database
   DATABASE_URL="file:./database/local.db"
   
   # Add other environment variables as needed
   ```

3. **Cloudflare Configuration:**
   - Update `wrangler.jsonc` with your settings
   - Run `bun run wrangler:types` after changes

### Production Setup

See [CI Deploy Guide](./CI_DEPLOY_GUIDE.md) for production deployment.

---

## 🎯 Common Development Tasks

### Adding a New Feature

1. **Create feature directory:**
   ```bash
   mkdir -p app/features/my-feature/{components,utils,types,context}
   ```

2. **Create main page component:**
   ```typescript
   // app/features/my-feature/page.tsx
   export default function MyFeaturePage() {
     return <div>My Feature</div>
   }
   ```

3. **Add route:**
   ```typescript
   // app/routes/my-feature._index.tsx
   import MyFeaturePage from "~/features/my-feature/page"
   
   export default MyFeaturePage
   ```

### Adding a New API Endpoint

1. **Create API handler:**
   ```typescript
   // workers/api/my-endpoint.ts
   import { Hono } from 'hono'
   
   const app = new Hono()
   
   app.get('/', async (c) => {
     return c.json({ message: 'Hello from my endpoint' })
   })
   
   export default app
   ```

2. **Register in main worker:**
   ```typescript
   // workers/app.ts
   import myEndpoint from './api/my-endpoint'
   
   app.route('/api/my-endpoint', myEndpoint)
   ```

### Database Schema Changes

1. **Update schema:**
   ```typescript
   // database/schema.ts
   export const myTable = sqliteTable('my_table', {
     id: integer('id').primaryKey(),
     name: text('name').notNull(),
     createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
   })
   ```

2. **Generate and apply migration:**
   ```bash
   bun run db:generate
   bun run db:migrate
   ```

---

## 🆘 Getting Help

### Documentation Resources
- [Project Overview](./PROJECT_OVERVIEW.md) - Architecture and tech stack
- [React Router Guide](./REACT_ROUTER_GUIDE.md) - Routing patterns
- [CI Deploy Guide](./CI_DEPLOY_GUIDE.md) - Deployment setup

### Common Issues
- See [Troubleshooting Guide](./TROUBLESHOOTING.md) for solutions to common problems
- Check GitHub Issues for known problems
- Review [Contributing Guidelines](../CONTRIBUTING.md) for development standards

### Getting Support
- Create an issue on GitHub for bugs or feature requests
- Check existing documentation before asking questions
- Follow the issue template when reporting problems

---

## 🎉 Next Steps

Once you've completed the setup:

1. **Explore the codebase** - Start with `/app/features/landing-page/` as an example
2. **Read the documentation** - Familiarize yourself with the architecture guides
3. **Make a small change** - Try adding a simple component or route
4. **Run the tests** - Ensure everything works as expected
5. **Join the development** - Start contributing to the project

Welcome to the team! 🚀

---

Built with ❤️ by KotonoSora — to help you ship faster and with confidence.