# Contributing to the NARA project

Thank you for considering contributing! We welcome all kinds of contributions including bug reports, feature requests, documentation improvements, and code contributions.

## Commit Message Convention

We use [Commitlint](https://github.com/conventional-changelog/commitlint) with the [`@commitlint/config-conventional`](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional) ruleset to ensure consistent and readable commit messages.

### Why Commitlint?

- **Better readability**: Clear commit messages help everyone understand the project's history at a glance.
- **Automated changelogs**: Conventional commits can be used to automatically generate changelogs.
- **Easier collaboration**: Consistent format makes it easier for contributors and maintainers to review and manage commits.

### Format Example

```text
feat: add user login API
fix: resolve crash on startup
docs: update README with new instructions
```

Refer to the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) documentation for more details.

## Recommended CLI: `git-cz`

To simplify writing commit messages that follow the required convention, we recommend using [`git-cz`](https://github.com/streamich/git-cz).

### Setup

You can install `git-cz` globally:

```bash
npm install -g git-cz
```

Then, instead of running `git commit`, use:

```bash
git cz
```

This will launch an interactive prompt to help you write a properly formatted commit message.

## Getting Started

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Use `git cz` or follow the commit format manually
5. Submit a pull request

Thank you for helping make this project better!

## Dependency Management Workflow

This repository uses Bun workspaces and a catalog-first dependency strategy.

### Core Commands

```bash
bun run deps:audit
bun run deps:audit:strict
bun run deps:outdated
bun run deps:upgrade
bun run deps:upgrade:apply -- --target react@19.2.4 --scope root
bun run deps:validate
```

### Rules

1. Use `catalog:` for shared dependencies.
2. Keep internal package links as `workspace:*`.
3. Run strict audit before release PRs.

## UI Component Maintenance (packages/ui)

The `packages/ui` workspace keeps the custom `radix-vega` style and uses helper scripts.

```bash
bun run ui:sync-exports
bun run ui:add -- stats-card
```

`ui:add` creates a component scaffold and updates exports and metadata automatically.

---

Built with ❤️ by KotonoSora — to help you ship faster and with confidence.
