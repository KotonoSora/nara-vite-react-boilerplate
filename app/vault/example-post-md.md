---
title: "Public Markdown Document"
description: "This is a simple markdown file available for AI/LLM context"
date: "2026-02-21"
published: true
---

# App Vault Markdown Document

This file is located in the `/app/vault/` folder and is bundled with the blog content.

## Purpose

Files in the app vault folder are:

- Bundled with the app for the blog feature
- Support frontmatter metadata
- Can be `.md` or `.mdx`

## When to Use Markdown vs MDX

**Use `/app/vault/*.md` for:**

- Simple markdown posts without React components
- Lightweight content that does not need custom components

**Use `/app/vault/*.mdx` for:**

- Blog posts with interactive React components
- Content that uses custom components or styling

## Example Content

This is regular markdown content that can include:

- Lists and tables
- Code blocks
- Images and links
- All standard markdown features

But **NOT** React components (use `.mdx` in `/app/vault` for that).
