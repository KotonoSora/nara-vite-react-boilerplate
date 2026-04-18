# Copilot Instructions for NARA Vite React Boilerplate

## Build, Test, and Lint Commands

- **Build:** `bun run build` (uses React Router build)
- **Dev server:** `bun run dev` (hot reload, local dev)
- **Test all:** `bun run test` (runs Vitest)
- **Test single file:** `bun run test path/to/file.test.ts`
- **Lint:** `bun run lint` (TypeScript strict, noEmit)
- **Typecheck:** `bun run typecheck` (React Router typegen)
- **Coverage:** `bun run coverage`
- **Dependency audit:** `bun run deps:audit` / `bun run deps:audit:strict`
- **Upgrade dependencies:** `bun run deps:upgrade:apply -- --target <name@version> --scope <scope>`
- **Database migration:** `bun run db:migrate` (local) / `bun run db:migrate-production` (prod)
- **Deploy:** `bun run deploy` (Cloudflare Workers)

## High-Level Architecture

- **Monorepo:** Uses Bun workspaces. All packages are in `packages/`.
- **App entry:** Main app code in `app/` (routes, root, entry.server.tsx).
- **Routing:** React Router v7, file-based routes in `app/routes.ts` (uses `@react-router/fs-routes`).
- **SSR:** Cloudflare Workers, configured via `wrangler.jsonc` and `worker-configuration.d.ts`.
- **Database:** Drizzle ORM with SQLite (Cloudflare D1), config in `drizzle.config.ts`.
- **UI:** Custom components in `packages/ui`, global styles in `app/app.css` and `@kotonosora/ui/styles/globals`.
- **i18n:** Provided by `@kotonosora/i18n` and related packages.
- **Middleware:** Route-level middleware in `app/root.tsx` (auth, i18n, theme, etc).
- **Environment:** Type-safe env vars via `worker-configuration.d.ts`.

## Key Conventions

- **Commit messages:** Must follow Conventional Commits (enforced by Commitlint). Use `git cz` for prompts.
- **Dependencies:** Shared deps are managed via a `catalog` in root `package.json`. Use `catalog:` and `workspace:*` for versions.
- **UI components:** Add via `bun run ui:add -- <name>` in `packages/ui`.
- **TypeScript paths:** Use `~/*` for `app/`, `~/workers/*`, `~/database/*`.
- **Theming:** Uses `remix-themes` and CSS custom properties. Font: Inter.
- **Testing:** Vitest for all tests. Place tests alongside code or in `tests/`.
- **Cloudflare:** All deployment and DB config via `wrangler.jsonc`.

---

For more details, see `README.md` and `CONTRIBUTING.md`.
