# PROJECT OVERVIEW

## PROJECT: Nara Vite React Boilerplate - A modern React Router v7 full-stack application template

A production-ready boilerplate for building full-stack React applications using React Router v7, featuring server-side rendering, Cloudflare deployment, and modern development tools.

## STACK:

- **Frontend**: React 19, React Router v7, TypeScript
- **Styling**: TailwindCSS v4, Radix UI components, Lucide icons
- **Backend**: Hono API, Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite), Drizzle ORM
- **Build Tools**: Vite, Bun runtime
- **Deployment**: Cloudflare Workers & Pages
- **Testing**: Vitest, Cloudflare Workers testing

## QUICK START:

```bash
# Clone and install dependencies
bun install

# Set up database
bun run db:migrate

# Start development server
bun run dev
# App available at http://localhost:5173

# Deploy to Cloudflare
bun run deploy
```

## FEATURES:

- 🚀 Server-side rendering (SSR) with React Router v7
- ⚡️ Hot Module Replacement (HMR) for fast development
- 📦 Asset bundling and optimization via Vite
- 🔄 Full-stack data loading and mutations
- 🔒 TypeScript-first development
- 🎨 Modern UI with TailwindCSS v4 and shadcn/ui components
- 🌓 Dark/light theme support with persistence
- 📱 Responsive design with mobile-first approach
- 🗄️ Database integration with Cloudflare D1 and Drizzle ORM
- 🔌 RESTful API with Hono framework
- ☁️ Cloudflare Workers deployment-ready
- 🧪 Testing setup with Vitest and Workers testing
- 📝 Type-safe forms with validation
- 🔔 Toast notifications with Sonner
- 🎯 SEO-friendly with meta tag management

## STRUCTURE:

```
/app                    - React Router application
  /components          - Reusable UI components
    /ui               - shadcn/ui component library
  /routes             - File-based routing
  /hooks              - Custom React hooks
  /lib                - Utility functions
  root.tsx            - App shell and layout
  entry.server.tsx    - Server entry point
  sessions.server.tsx - Session management

/workers              - Cloudflare Workers API
  /api               - API route handlers
  app.ts             - Main worker entry

/database             - Database schema and migrations
  schema.ts          - Drizzle schema definitions

/drizzle              - Database migrations
/public               - Static assets
/docs                 - Documentation
```

## DEVELOPMENT:

**Setup**:

```bash
bun install                    # Install dependencies
bun run db:migrate            # Set up local database
bun run dev                   # Start dev server with HMR
```

**Testing**:

```bash
bun run test                  # Run unit tests
bun run coverage             # Generate coverage report
bun run typecheck           # Type checking
```

**Build**:

```bash
bun run build               # Production build
bun run start               # Preview production build locally
```

## CONTRIBUTING:

- **Code style**: TypeScript strict mode, ESLint + Prettier configured
- **Process**:
  1. Fork the repository
  2. Create feature branch from `main`
  3. Make changes with proper TypeScript types
  4. Add tests for new functionality
  5. Run `bun run lint` and `bun run test`
  6. Submit pull request with clear description
- **Help needed**:
  - Additional UI component examples
  - Advanced authentication patterns
  - Performance optimization guides
  - Mobile app integration examples

## TEMPLATE GUIDE:

**Customize**:

- Update `package.json` name, description, and repository
- Modify `wrangler.jsonc` worker name and database config
- Replace logos in `/public/assets/`
- Update brand colors in `app.css` and component themes
- Configure `drizzle.config.ts` with your database credentials

**Extend**:

- Add new routes in `/app/routes/` (file-based routing)
- Create API endpoints in `/workers/api/`
- Define database schemas in `/database/schema.ts`
- Add UI components in `/app/components/`
- Implement custom hooks in `/app/hooks/`

**Tips**:

- Use the shadcn/ui CLI to add new components: `npx shadcn-ui@latest add [component]`
- Database migrations are automatically generated: `bun run db:generate`
- Environment variables go in `.dev.vars` for local and Cloudflare dashboard for production
- Follow the existing file structure for consistency
- Leverage React Router v7's data loading patterns for optimal performance
- Use Drizzle's type-safe queries for database operations
- Take advantage of Cloudflare's edge computing capabilities

**Architecture Patterns**:

- **File-based routing**: Routes automatically created from `/app/routes/` structure
- **Server-side rendering**: Pages render on the server for better SEO and performance
- **Progressive enhancement**: Forms work without JavaScript, enhanced with client-side interactions
- **Type safety**: End-to-end TypeScript from database to UI components
- **Edge-first**: Designed to run on Cloudflare's global edge network

This template provides a solid foundation for building modern, scalable web applications with React Router v7 and Cloudflare's infrastructure.
