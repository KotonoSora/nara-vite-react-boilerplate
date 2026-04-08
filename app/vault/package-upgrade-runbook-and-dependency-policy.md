---
title: "Package Upgrade Runbook and Dependency Policy"
description: "Operational guide for dependency audits, targeted upgrades, and UI refresh workflows in the monorepo"
date: "2026-03-29"
published: true
author: "Development Team"
tags: ["upgrade", "dependencies", "bun", "workspace", "ui", "tooling"]
---

# Package Upgrade Runbook and Dependency Policy

This repository uses Bun workspaces with a catalog-first dependency policy.

## Quick Commands

Use these commands for day-to-day dependency maintenance:

```bash
# Audit dependency consistency
bun run deps:audit

# Strict audit (fails on drift)
bun run deps:audit:strict

# Check outdated packages
bun run deps:outdated

# Guided check mode for upgrades
bun run deps:upgrade

# Enforce dependency policy (check only)
bun run deps:policy:check

# Enforce dependency policy (auto-fix safe cases)
bun run deps:policy:fix

# Full validation after upgrades
bun run deps:validate
```

Targeted upgrade examples:

```bash
bun run deps:upgrade:apply -- --target react@19.2.4 --scope root
bun run deps:upgrade:apply -- --target date-fns@4.1.0 --scope all-using
bun run deps:upgrade:apply -- --target @types/node@24.10.9 --scope workspace:@kotonosora/ui
```

## Dependency Policy

1. Use catalog when a dependency is shared by multiple packages.
2. Keep internal package references as workspace wildcard.
3. Use strict audit in CI or pre-release checks.
4. Prefer targeted upgrades over broad lockfile churn.
5. Use static versions only. Caret ranges are not allowed.

## UI Component Workflow for packages/ui

This project keeps the radix-vega style and uses internal scripts for repeatable updates.

```bash
# Full shadcn refresh
bun run ui:shadcn:refresh

# Preview refresh commands without changing files
bun run ui:shadcn:refresh:dry-run

# Include init step explicitly when needed
bun run ui:shadcn:refresh -- --with-init

# Sync exports and files map
bun run ui:sync-exports

# Add a new component scaffold
bun run ui:add -- stats-card
```

Adding a component updates:

1. packages/ui/src/components/ui/<name>.tsx
2. packages/ui/.component-metadata.json
3. packages/ui/package.json exports and files

Notes:

1. Init is skipped by default for workspace package contexts, where framework detection is commonly unavailable.
2. Use with-init to force running init before add all.
3. Add all is the authoritative step for component refresh in packages/ui.
4. Refresh now resolves paths from packages/ui/scripts/shadcn-refresh.mjs, not caller cwd.
5. Real runs enforce next-themes cleanup in packages/ui/package.json.
6. If next-themes still exists after a real run, the script exits non-zero immediately.
7. Dry-run is simulation-only. Commands and cleanup are previewed, and no files are modified.
8. Real refresh now runs dependency policy auto-fix for @kotonosora/ui after sync.

## Troubleshooting

### next-themes still appears in packages/ui/package.json

1. Confirm you ran a real refresh, not dry-run.
2. Confirm no skip flag was used.
3. Re-check the manifest.
4. If the command exits non-zero, treat it as a cleanup failure and inspect logs from shadcn-refresh.mjs.

Verification command:

```bash
rg '"next-themes"' packages/ui/package.json
```

### Understand dry-run output

1. A dry-run bun remove message means the command would run in real mode.
2. A dry-run removal message means simulated manifest cleanup only.
3. Dry-run never persists file edits by design.

## Recommended Review Checklist

1. Run strict dependency audit before opening a PR.
2. Run typecheck, build, and test.
3. For UI changes, review generated exports and metadata.
4. Add a changelog entry when process or tooling changes affect contributors.
