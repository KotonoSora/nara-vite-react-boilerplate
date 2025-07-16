# Your Project Name

A modern full-stack React application built with the NARA (Non‑Abstract Reusable App) boilerplate.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Set up the database:**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## 📦 Project Structure

- `app/` - Main application code (React Router v7)
- `workers/` - Cloudflare Workers API endpoints  
- `database/` - Database schema and migrations
- `public/` - Static assets
- `components.json` - shadcn/ui components configuration

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server locally
- `npm run deploy` - Deploy to Cloudflare
- `npm run test` - Run tests
- `npm run lint` - Type checking
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Apply database migrations

## 🏗️ Tech Stack

- **Framework:** React Router v7
- **Runtime:** Cloudflare Workers
- **Database:** Cloudflare D1 with Drizzle ORM
- **Styling:** Tailwind CSS + shadcn/ui
- **API:** Hono.js
- **Testing:** Vitest
- **Type Safety:** TypeScript

## 📝 Setup Checklist

After creating your project, don't forget to:

- [ ] Update `package.json` with your project name, version, and repository
- [ ] Replace this README with your project-specific documentation
- [ ] Configure your Cloudflare account and update `wrangler.jsonc`
- [ ] Set up your environment variables
- [ ] Initialize git repository: `git init && git add . && git commit -m "Initial commit"`
- [ ] Create your GitHub repository and push: `git remote add origin <your-repo-url> && git push -u origin main`

## 📚 Documentation

Check the `.github/instructions/` folder for detailed guides on:
- React Router v7 file-based routing
- Cloudflare D1 database setup
- Drizzle ORM usage
- Hono.js API development
- Tailwind CSS configuration

---

Built with ❤️ using the NARA boilerplate by KotonoSora