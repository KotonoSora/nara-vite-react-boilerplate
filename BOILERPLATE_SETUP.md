# NARA Boilerplate Setup Guide

This guide explains how to use the NARA boilerplate to create new projects with optimal file selection and automatic configuration.

## 🚀 Quick Setup (Recommended)

The fastest way to create a new project:

```bash
npx degit KotonoSora/nara-vite-react-boilerplate#main my-new-project
cd my-new-project
node setup.mjs
```

### What the setup script does:
- ✅ Prompts for project name, description, author, and repository URL
- ✅ Updates `package.json` with your project details
- ✅ Creates a customized `README.md` for your project
- ✅ Removes template files (keeps your repo clean)

## 📁 What Gets Excluded

The `.degitrc` configuration automatically excludes these boilerplate-specific files:

### Documentation & Meta Files
- `docs/` - Boilerplate documentation
- `CHANGELOG.md` - Boilerplate version history  
- `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md`
- Original `README.md` (replaced with template)

### CI/CD & Workflows
- `.github/workflows/` - Boilerplate-specific GitHub Actions

### Lock Files & Dependencies
- `bun.lock`, `package-lock.json` - Should be regenerated
- `node_modules/` - Will be installed fresh

### Build Artifacts  
- `.react-router/` - Build cache
- `*.tsbuildinfo` - TypeScript build info

## 📦 What Gets Included

Your new project will contain:

### Core Application
- `app/` - Main React Router v7 application
- `workers/` - Cloudflare Workers API code
- `public/` - Static assets
- `database/` & `drizzle/` - Database schema and migrations

### Configuration
- `vite.config.ts`, `tsconfig.json`, `wrangler.jsonc`
- `components.json` - shadcn/ui configuration
- `react-router.config.ts` - Router configuration

### Development Tools
- `.husky/` - Git hooks
- `.prettierrc`, `.prettierignore` - Code formatting
- `.vscode/` - VS Code settings
- `.github/copilot-instructions.md` - AI coding guidelines
- `.github/instructions/` - Framework-specific guides

### Templates
- `package.template.json` - Template package.json
- `README.template.md` - Template README  
- `setup.mjs` - Interactive setup script
- `.env.example` - Environment variables template

## 🛠️ Manual Setup (Alternative)

If you prefer to configure manually:

```bash
npx degit KotonoSora/nara-vite-react-boilerplate#main my-new-project
cd my-new-project

# Copy templates
cp package.template.json package.json
cp README.template.md README.md
cp .env.example .env.local

# Edit files manually
# - Update package.json with your project details
# - Customize README.md  
# - Configure .env.local

# Clean up templates
rm package.template.json README.template.md setup.mjs
```

## 🔧 Post-Setup Steps

After either setup method:

1. **Install dependencies:**
   ```bash
   npm install
   # or bun install
   ```

2. **Configure environment:**
   ```bash
   # Edit .env.local with your configuration
   nano .env.local
   ```

3. **Initialize database:**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Start development:**
   ```bash
   npm run dev
   ```

5. **Initialize git repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

## 🎯 Benefits of This Approach

### ✅ Advantages
- **Clean start**: No boilerplate-specific files in your project
- **Automatic setup**: Interactive configuration reduces manual work
- **Type-safe**: All the type safety and tooling of the original boilerplate
- **Up-to-date**: Always gets the latest boilerplate version
- **Flexible**: Can be customized for your specific needs

### 🔄 Compared to Fork/Clone
- **No git history**: Clean repository without boilerplate commits
- **No merge conflicts**: Updates don't interfere with your changes  
- **Smaller size**: Only includes necessary files
- **Better organization**: Clear separation between boilerplate and project code

## 📚 Next Steps

Check out the guides in `.github/instructions/` for detailed information on:
- React Router v7 file-based routing
- Cloudflare D1 database setup  
- Drizzle ORM usage
- Hono.js API development
- Tailwind CSS + shadcn/ui components

Happy coding with NARA! 🚀