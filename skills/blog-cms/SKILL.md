---
name: blog-cms
description: >-
  Sets up and integrates OpenBlog — a Git-based blog CMS module for product
  sites (Markdown, Next.js, theme, chrome, sitemap/RSS). Routes agents to
  integrate on an existing site or scaffold greenfield. Use when the user
  mentions blog CMS, OpenBlog, /blog on a product site, headless blog,
  Git-backed blog, or create-openblog.
---

# Blog CMS (OpenBlog)

**OpenBlog** is an open-source, **Git-based CMS for blogs** — an **agent-native blog module** mounted on product websites (typically `/blog`). Markdown in Git is the source of truth; Next.js renders list/post pages, RSS, sitemap, and JSON-LD.

> **Git is the CMS. Your coding agent is the admin.**

This skill is the **entry point**. It routes to the right workflow, then reads the matching skill in this pack when present.

**Not in scope:** whole-site CMS, WordPress-style dashboards, site-wide SEO/GEO — pair with [marketing-skills](https://github.com/kostja94/marketing-skills) for growth workflows on the host site.

---

## Install (skills.sh)

```bash
# Entry skill only
npx skills add kostja94/openblog --skill blog-cms

# Recommended — entry + primary workflows
npx skills add kostja94/openblog --skill blog-cms integrate-product-site setup-blog-module

# Full pack (content ops included)
npx skills add kostja94/openblog --skill '*'

# List all skills in the repo
npx skills add kostja94/openblog --list
```

Repo: [github.com/kostja94/openblog](https://github.com/kostja94/openblog) · Docs: [INTEGRATION.md](https://github.com/kostja94/openblog/blob/main/INTEGRATION.md)

When working **inside the OpenBlog monorepo**, read `AGENTS.md` and skill files under `skills/` directly.

---

## Step 1 — Route the user

**Ask before editing files** if the path is unclear:

> OpenBlog has two common paths:  
> 1. **Existing product site** → integrate `/blog` via INTEGRATION.md (recommended)  
> 2. **Try it first** → `npx create-openblog my-blog`  
> Which applies to you? If you have a product site URL, share it.

| User situation | Action | Follow-up skill |
|----------------|--------|-----------------|
| **Existing product / marketing site** — wants `/blog`, matching nav/logo | Read **INTEGRATION.md** first | `integrate-product-site` |
| **Greenfield** — no site yet, local demo | Scaffold with `create-openblog` | `setup-blog-module` |
| **Module already wired** — add or edit a post | Content model + validate | `create-post` |
| **Pre-merge / deploy checks** on blog posts | Validate + build | `validate-blog-seo` |
| **Ready to merge and deploy** | Git → CI checklist | `publish` |
| **Ready to merge and deploy** | Git → CI → CDN checklist | `publish` |

**Do not** default to `create-openblog` when the user mentions an existing website, product URL, chrome, or navbar alignment.

---

## Step 2 — Execute the path

### A. Integrate on existing product site (primary)

Read **`integrate-product-site`** skill (or [INTEGRATION.md](https://github.com/kostja94/openblog/blob/main/INTEGRATION.md)).

Summary:

1. Choose pattern: **subdirectory** (`yourproduct.com/blog`) · monorepo merge · subdomain
2. Configure `openblog.config.ts` → `chrome` (logo, nav, footer, `siteUrl`)
3. Edit `templates/next/src/chrome/site-chrome.ts` if needed
4. Optional brand draft: `npm run integrate -- --site https://yourproduct.com`
5. Set env: `SITE_URL`, `DEPLOY_MODE`, `BLOG_BASE_PATH`
6. Gate: `npm run validate:posts` && `npm run build`

### B. Greenfield scaffold

Read **`setup-blog-module`** skill.

```bash
npx create-openblog my-blog
cd my-blog && npm install && npm run dev
```

From monorepo: `npm run create-openblog -- my-blog`

Configure `openblog.config.ts` (site, theme, `features`, `components.optional`). Run `npm run theme:sync` after theme changes.

### C. Content operations (optional)

| Task | Skill | Gate |
|------|-------|------|
| New post (user provides body/brief) | `create-post` | `npm run validate:posts` |
| Blog SEO checks | `validate-blog-seo` | validate + build |
| Publish via Git | `publish` | CI green |

**Guardrail:** `create-post` is not autonomous article generation — the user supplies content or a clear brief.

---

## What OpenBlog provides

| Layer | Purpose |
|-------|---------|
| **Git Markdown / MDX** | Portable content, version history, no database |
| **Blog routes + theme + chrome** | List, post, taxonomy — styled to match product site |
| **SEO primitives** | Sitemap, RSS, robots, canonical, JSON-LD, static pages |
| **Agent contract** | `AGENTS.md` + skills for schema and publish rules |

Optional `features` toggles: categories, tags, authors, RSS (see `docs/features.md` in repo).

---

## Commands (monorepo or scaffold)

```bash
npm install
npm run dev              # → http://localhost:3000/blog
npm run validate:posts
npm run theme:sync
npm run build
npm run integrate -- --site https://yourproduct.com   # brand manifest draft
```

---

## Out of scope

- Site-wide SEO audit, keyword research, GEO, content strategy → **[marketing-skills](https://github.com/kostja94/marketing-skills)**
- Marketing landing pages, docs hub, app UI
- Upstream PRs to OpenBlog (enterprise partners only) → [CONTRIBUTING.md](https://github.com/kostja94/openblog/blob/main/CONTRIBUTING.md)
- Scraping full product nav as React — copy from main repo or use `inherit-monorepo` chrome mode

---

## Skill pack index

| Skill | Role |
|-------|------|
| **`blog-cms`** | Entry + routing (this file) |
| `integrate-product-site` | Primary — existing site integration |
| `setup-blog-module` | Primary — greenfield scaffold |
| `create-post` | Optional — add Markdown post |
| `validate-blog-seo` | Optional — blog-path SEO validation |
| `publish` | Optional — merge/deploy checklist |
| `audit-seo` | Legacy redirect → `validate-blog-seo` |
