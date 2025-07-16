# NARA (Non‑Abstract Reusable App) boilerplate

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![CI – PR Quality Checks](https://github.com/KotonoSora/nara-vite-react-boilerplate/actions/workflows/ci-pr-check.yml/badge.svg)](https://github.com/KotonoSora/nara-vite-react-boilerplate/actions/workflows/ci-pr-check.yml)
[![Manual Deploy](https://github.com/KotonoSora/nara-vite-react-boilerplate/actions/workflows/manual-deploy-cloudflare.yml/badge.svg)](https://github.com/KotonoSora/nara-vite-react-boilerplate/actions/workflows/manual-deploy-cloudflare.yml)

---

## 📘 Overview

A fast, opinionated starter for building **full-stack React apps** with **modern tooling** and **Cloudflare Workers deployment**. Designed with focus on **type safety**, **performance**, and **developer ergonomics**.

📖 See [Project Overview](docs/PROJECT_OVERVIEW.md) for more on project structure.

## 🚀 Getting Started

### Method 1: Quick Setup (Recommended)

Create a new project with automatic setup:

```bash
npx degit KotonoSora/nara-vite-react-boilerplate#main my-new-project
cd my-new-project
node setup.mjs
```

The setup script will:
- Configure your `package.json` with project details
- Create a project-specific `README.md`
- Prompt for project name, description, and other details

### Method 2: Manual Setup

If you prefer manual configuration:

```bash
npx degit KotonoSora/nara-vite-react-boilerplate#main my-new-project
cd my-new-project
cp package.template.json package.json
cp README.template.md README.md
# Edit package.json and README.md manually
```

### After Setup

1. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your settings
   ```

3. **Set up database:**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Start development:**
   ```bash
   npm run dev
   ```

## 📁 What's Included

The boilerplate automatically excludes development-specific files:
- ✅ **Included:** Core app code, configurations, development tools
- ❌ **Excluded:** Docs, changelog, CI workflows, lock files
- 🔄 **Templates:** `package.template.json`, `README.template.md`, `setup.mjs`

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
