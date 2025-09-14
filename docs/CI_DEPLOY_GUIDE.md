# CI & Deployment Guide

This guide explains the two main GitHub Actions workflows used in this project:

- **PR Quality Checks** (`.github/workflows/ci-pr-check.yml`)
- **Manual Deploy to Cloudflare Pages** (`.github/workflows/manual-deploy-cloudflare.yml`)

---

## 1. PR Quality Checks Workflow

**Purpose:**

- Automatically checks the quality of every Pull Request (PR) to the `main`, `develop`, or any `release/**` branch.
- Ensures code is type-safe, linted, and tested before merging.

**How it works:**

1. **Trigger:** Runs on every PR to the main development branches.

2. **Duplicate Check:** Skips duplicate runs for the same PR to save resources.

3. **Quality Checks:**
   - Checks out the code.
   - Sets up Bun (the JavaScript runtime used in this project).
   - Installs dependencies using Bun.
   - Runs TypeScript type checking to catch type errors.
   - Runs ESLint to enforce code style and catch common mistakes.
   - Runs unit tests to ensure code correctness.

**What you need to know:**

- You don't need to trigger this workflow manually; it runs automatically on PRs.
- If any check fails, you must fix the issues before merging.
- Only runs for PRs in the official repository (`KotonoSora/nara-vite-react-boilerplate`).

---

## 2. Manual Deploy to Cloudflare Pages Workflow

**Purpose:**

- Allows maintainers to manually deploy any branch to Cloudflare Pages for production or preview.
- Useful for testing or urgent deployments outside the normal CI/CD flow.

**How it works:**

1. **Trigger:**
   - Manually started from the GitHub Actions tab ("workflow_dispatch").
   - You choose which branch to deploy.

2. **Secrets Validation:**
   - Checks that all required secrets (API tokens, database info) are set up in the repository.

3. **Setup:**
   - Checks out the selected branch.
   - Sets up Bun and installs dependencies.
   - Disables telemetry for privacy.
   - Injects Cloudflare and database configuration using secrets and variables.
   - Generates type definitions for Wrangler (Cloudflare tool).
   - Runs database migrations for production.

4. **Deploy:**
   - Deploys to Cloudflare Pages.
   - Uses different environments (production or development) based on the branch.

**What you need to know:**

- Only maintainers can run this workflow.
- Make sure all required secrets and variables are set in the repository settings before deploying.
- Use this workflow for manual deployments, previews, or hotfixes.

---

For more details, see the workflow files in `.github/workflows/` or ask a maintainer.
