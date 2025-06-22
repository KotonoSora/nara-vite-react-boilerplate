# CI/CD Deployment Overview for NARA Boilerplate

This guide explains the GitHub Actions workflows used to test and deploy the NARA full-stack React application to Cloudflare.

---

## 📂 Workflows Overview

### 1. `ci-pr-check.yml` — Pull Request Quality Checks

**Trigger**: On `pull_request` targeting `main`, `develop`, or `release/**`.

**Steps**:

- Checkout repository
- Restore Bun cache
- Install dependencies with Bun
- Run:
  - TypeScript typecheck
  - ESLint linting
  - Vitest unit tests

**Purpose**: Ensures all PRs meet quality standards before merge.

---

### 2. `manual-deploy-cloudflare.yml` — Manual Deployment to Cloudflare

**Trigger**: `workflow_dispatch` with `branch` input.

**Steps**:

- Checkout selected branch
- Restore Bun cache
- Install dependencies with Bun
- Generate Wrangler types
- Inject Cloudflare D1 database config (via `wrangler.jsonc` and `drizzle.config.ts`)
- Run D1 migrations (`bun run db:migrate-production`)
- Deploy to Cloudflare Pages using Wrangler

**Secrets Required**:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `D1_DATABASE_ID`
- `D1_DATABASE_NAME`

**Environment**: `production`

---

## 🔐 Secrets Setup (Repository Settings > Secrets)

| Key                   | Description                      |
| --------------------- | -------------------------------- |
| CLOUDFLARE_API_TOKEN  | API token with write permissions |
| CLOUDFLARE_ACCOUNT_ID | Your Cloudflare account ID       |
| D1_DATABASE_ID        | Your Cloudflare D1 database ID   |
| D1_DATABASE_NAME      | Your Cloudflare D1 database name |

---

## 🛠 Notes

- Caching is based on `bun.lock` hash to speed up installs
- D1 database injection uses `sed` to replace template values
- Deployment is manual to allow controlled releases

---

## 📌 Tips

- Set up branch protection rules to ensure PRs pass CI
- Use preview deployments via `wrangler versions upload`
- Promote tested builds to production using `wrangler versions deploy`
- Use `.dev.vars` locally and Cloudflare dashboard for production envs

---

Built with ❤️ to help you ship fast and with confidence.
