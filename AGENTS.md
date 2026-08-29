# AGENTS.md — OpenBlog

You are editing **OpenBlog**, an open-source, **Git-based CMS for blogs** — implemented as an **agent-native blog module** for product websites. Content lives in Git (Markdown + frontmatter); you maintain routes, theme, site chrome, and **SEO primitives** (sitemap, RSS, robots, JSON-LD) through the repo. For site-wide SEO, GEO, keyword strategy, and marketing-page optimization, use **[marketing-skills](https://github.com/kostja94/marketing-skills)** — OpenBlog only guarantees blog-path SEO primitives.

**Existing product site?** Read [INTEGRATION.md](./INTEGRATION.md) before editing chrome.

## Agent: route the user first

When someone opens this repo **without a clear task**, **ask which path applies** before editing files:

| User situation | Point them to | Skill |
|----------------|---------------|--------|
| **Has a product / marketing site** — wants `/blog`, matching nav/logo | **[INTEGRATION.md](./INTEGRATION.md)** | `blog-cms` → `integrate-product-site` |
| **Greenfield** — new blog, local demo, no existing site | Quick start → scaffold (`create-openblog`) | `blog-cms` → `setup-blog-module` |
| **Module already wired** — add or edit a post | Content model in this file | `create-post` (optional) |
| **Pre-merge / deploy checks** on blog posts | Validate + build | `validate-blog-seo` |
| **Ready to merge and deploy** | Git → CI checklist | `publish` (optional) |

**Suggested prompt to show the user:**

> OpenBlog has two common paths:  
> 1. **Existing product site** → integrate `/blog` via [INTEGRATION.md](./INTEGRATION.md) (recommended)  
> 2. **Try it first** → `npm run create-openblog -- my-blog` or `npx create-openblog` (after npm publish)  
> Which applies to you? If you have a product site URL, share it.

Do **not** default to `create-openblog` if they mention an existing website, product URL, chrome, or navbar alignment.

**Contributions:** Upstream PRs to this repo are **enterprise-only** (design-token or component/platform partners). Do not encourage individual users to open PRs — point them to [INTEGRATION.md](./INTEGRATION.md), Issues, or [CONTRIBUTING.md](./CONTRIBUTING.md) for enterprise partnership inquiries.

## Architecture (v0.2)

Layers are decoupled under `packages/`. Users customize via **`openblog.config.ts`** at repo root.

| Layer | Location | Customize via |
|-------|----------|---------------|
| **Core** | `packages/core` | schema, URL, SEO — rarely fork |
| **Content** | `packages/content` | `content.adapter` + `content.options` |
| **Components** | `packages/components` | `components.optional.*` (Blog Chrome) |
| **Themes** | `packages/themes` | `theme:` + CSS import in `globals.css` |
| **Site Chrome** | `templates/next/src/chrome/` | `chrome.*` in config + `site-chrome.ts` |
| **Frontend** | `templates/next` | routes, env, overrides |

**Existing product site?** Read [INTEGRATION.md](./INTEGRATION.md) before editing chrome.

## Scope

- **In scope:** `openblog.config.ts`, `templates/next/content/blog/*.md`, `templates/next/src/chrome/`, blog routes
- **Out of scope (v0):** marketing landing pages, video posts, database CMS, scraping navbar from URLs

## Content root

- Posts: `templates/next/content/blog/{slug}.md` (default; see `content.options.dir` in config)
- Filename must match frontmatter `slug` (kebab-case)

## Frontmatter schema

Defined in `@openblog/core` (`postFrontmatterSchema`). Required fields:

```yaml
title: string
description: string   # 80–320 chars, used for SEO meta
slug: kebab-case
date: YYYY-MM-DD
author: string
category: string
tags: string[]        # optional
draft: false         # optional, default false
updated: YYYY-MM-DD  # optional
cover: /images/...   # optional, featured image for OG (not body first image)
tldr: string         # optional, 40–320 chars; else ## TL;DR section in body
```

Run validation before finishing:

```bash
npm run validate:posts
```

## URL rules

- Canonical URLs have **no trailing slash**
- Internal links in Markdown use paths from `blogPath()`:
  - **standalone / subdirectory:** `/blog/{slug}`
  - **subdomain:** `/{slug}` (public URL; files still live under `content/blog/`)

## Chrome integration

- **Site Chrome** (navbar/footer/logo): `openblog.config.ts` → `chrome`, edit `src/chrome/site-chrome.ts`
- **Blog Chrome** (breadcrumbs, article UI): `packages/components` + `components.optional.*`
- Do not put navbar/footer in `packages/components`

## Do not break

- `DEPLOY_MODE` behavior (see `openblog.config.ts` + env)
- Static generation for all published slugs
- Draft posts excluded from sitemap and RSS
- `OpenBlogProvider` in root layout (components need site context)

## Skills

Use repo skills in `skills/` (install via [skills/README.md](./skills/README.md) or `npx skills add kostja94/openblog --skill blog-cms`):

| Skill | Purpose |
|-------|---------|
| **`blog-cms`** | **Entry** — route integrate vs scaffold |
| **`integrate-product-site`** | **Primary** — mount blog on existing product site (chrome, patterns, `npm run integrate`) |
| **`setup-blog-module`** | **Primary** — greenfield scaffold, config, env, theme, features, validate/build |
| `create-post` | Optional — add post when user provides body/brief |
| `validate-blog-seo` | Optional — blog module SEO validation (not site-wide audit); see [marketing-skills](https://github.com/kostja94/marketing-skills) for GEO/growth |
| `publish` | Optional — PR merge and deploy checklist |

Legacy: `audit-seo` redirects to `validate-blog-seo`.

## X (Twitter) embeds

Optional component — not a `features` flag. Enable in **`openblog.config.ts`**:

```typescript
components: {
  optional: {
    xEmbed: true,
  },
},
```

Paste a status URL on its own line in Markdown (or as a standalone link); inline links in a sentence stay plain links:

```markdown
https://x.com/openblog/status/1234567890
```

Requires client-side load of `platform.twitter.com/widgets.js`. If the embed fails, readers get a fallback “View post on X” link.

## Optional features

Taxonomy and feeds are toggled in **`openblog.config.ts`** → `features` (all default `true`):

| Flag | Effect when `false` |
|------|---------------------|
| `categories` | No `/blog/category/[slug]` routes |
| `tags` | No tag routes; `tagsList` UI off |
| `authors` | No author routes; author UI off |
| `rss` | No `/blog/rss.xml` feed |

Core blog CMS (list + post pages, sitemap, validation) stays enabled regardless.

## Theme sync

After changing `theme` in config (or running `theme:infer`):

```bash
npm run theme:sync   # writes templates/next/src/app/theme.generated.css
```

`dev` and `build` run `theme:sync` automatically. See [docs/theming.md](./docs/theming.md).

## Commands

```bash
npm install          # from repo root (workspaces)
npm run dev          # http://localhost:3000/blog
npm run validate:posts
npm run theme:sync
npm run build
```
