# OpenBlog — Open Source CMS for Blogs

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/kostja94/openblog)](https://github.com/kostja94/openblog/stargazers)
[![skills.sh](https://skills.sh/b/kostja94/openblog)](https://skills.sh/kostja94/openblog)

**OpenBlog** is an **open-source, Git-based CMS for blogs** — an **agent-native blog module** you mount on product websites (typically at `/blog`). Markdown in Git is the source of truth. A Next.js template renders list pages, post pages, RSS, sitemap, and JSON-LD. Coding agents follow `AGENTS.md` and Skills to maintain the module through Pull Requests.

> **Git is the CMS. Your coding agent is the admin.**

**By [kostja](https://github.com/kostja94)** · [INTEGRATION](./INTEGRATION.md) · [AGENTS](./AGENTS.md) · [Skills](./skills/README.md) · [Docs](./docs/README.md) · [How to build a blog without a CMS](https://alignify.co/blog/how-to-build-a-blog-without-a-cms-using-ai)

---

## Quick Start

### ★ Integrate on your product site (recommended)

**Already have a homepage, docs, or SaaS site?** → **[INTEGRATION.md](./INTEGRATION.md)**

```bash
# After wiring openblog.config.ts + chrome (see INTEGRATION.md):
npm install
npm run dev
# → http://localhost:3000/blog
```

Optional: `npm run integrate -- --site https://yourproduct.com` · skill: `integrate-product-site`

### Greenfield demo

```bash
# When create-openblog is on npm:
npx create-openblog my-blog
cd my-blog && npm install && npm run dev

# From this monorepo (before npm publish):
npm run create-openblog -- my-blog
cd my-blog && npm install && npm run dev
```

Options: `--dir`, `--preset vercel-geist`, `--no-install`. Skill: `setup-blog-module`. See [create-openblog](./packages/create-openblog/README.md).

### Agent skills

```bash
npx skills add kostja94/openblog --skill blog-cms integrate-product-site setup-blog-module
```

Entry skill: **`blog-cms`**. Full list: [skills/README.md](./skills/README.md) · [skills.sh](https://skills.sh/kostja94/openblog)

**Note:** Demo URLs in config/examples use **`openblog.ai`** as a placeholder domain (not a live site).

---

## What is OpenBlog?

OpenBlog is a **Git-based CMS-like workflow** for a **blog module** on your product site — a CMS-free alternative to bolting WordPress onto `/blog`:

| You get | Why it matters |
|---------|----------------|
| **Git-backed Markdown / MDX** | Portable content, full version history, no database |
| **Blog routes + theme + chrome** | List, post, category — styled to match your product site |
| **SEO primitives built in** | Sitemap, RSS, robots, canonical URLs, JSON-LD, crawlable static pages |
| **Agent Skills + `AGENTS.md`** | Agents follow schema and publish rules (module maintenance, not a writing platform) |
| **Static output** | Fast CDN delivery, no runtime content API |

Optional content workflows (`create-post`, `publish`) exist; **the primary path is mounting the module**, not auto-generating articles.

**Not for:** whole-site CMS, AI writing platform, or site-wide SEO/GEO — see [Pair with marketing-skills](#pair-with-marketing-skills) below.

---

## Use Cases

| Scenario | Start here |
|----------|------------|
| Product site — add `/blog`, match nav/logo | [INTEGRATION.md](./INTEGRATION.md) |
| Greenfield — local demo before integrating | `create-openblog` · `setup-blog-module` |
| Agent-maintained posts | [AGENTS.md](./AGENTS.md) · `create-post` |
| Site-wide SEO / GEO (homepage, docs) | [marketing-skills](https://github.com/kostja94/marketing-skills) |

---

## Usage (Agent)

| You say | Skill |
|---------|-------|
| "Add blog to my product site" / "integrate /blog" | `integrate-product-site` |
| "Scaffold a new blog" / "create-openblog" | `setup-blog-module` |
| "Not sure which path" | `blog-cms` |
| "Add or edit a post" (you provide content) | `create-post` |
| "Validate blog SEO before deploy" | `validate-blog-seo` |
| "Publish / merge checklist" | `publish` |

---

## Pair with marketing-skills

OpenBlog delivers the **blog slice** — routes, theme, chrome, and **blog-path SEO primitives** (sitemap, RSS, robots, JSON-LD). For **homepage SEO, GEO, keyword research, and content workflows** on the wider product site, pair with **[marketing-skills](https://github.com/kostja94/marketing-skills)**. OpenBlog works standalone; the combination is stronger when you also care about homepage, docs, and growth pages.

| In scope (OpenBlog) | Out of scope (use host site / marketing-skills) |
|---------------------|---------------------------------------------------|
| Blog list and post pages | Marketing landing pages |
| Git Markdown + optional taxonomy/RSS | WYSIWYG admin (optional add-on: Tina, Decap, GitCMS) |
| Blog-path SEO primitives | Site-level SEO, `llms.txt`, GEO audits |
| Agent Skills for module maintenance | Multi-tenant SaaS, docs hub |

---

## Architecture

Layers are decoupled under `packages/`. Customize via **`openblog.config.ts`** at repo root.

```
openblog/
├── INTEGRATION.md            # ★ Existing-site integration entry
├── openblog.config.ts        # site + chrome + theme + features + content
├── packages/                 # core, content, components, themes, create-openblog
├── templates/next/           # Next.js frontend adapter
├── integrations/             # Deploy patterns + chrome examples
├── skills/                   # blog-cms + integrate + setup (+ optional content ops)
└── AGENTS.md                 # Agent contract
```

| Layer | Role |
|-------|------|
| **Template** | Blog module — list, post, category, RSS, sitemap |
| **Skills (primary)** | `setup-blog-module`, `integrate-product-site` |
| **Skills (optional)** | `create-post`, `validate-blog-seo`, `publish` |
| **Contract** | `AGENTS.md` + Zod validation |

Theming: [docs/theming.md](./docs/theming.md) · Features: [docs/features.md](./docs/features.md) · Deploy: [DEPLOY-ROUTING.md](./templates/next/docs/DEPLOY-ROUTING.md)

---

## Features

**Core:** Markdown + YAML front matter · list/post pages · drafts excluded from sitemap/RSS · CI validation (`npm run validate:posts`)

**Optional (on by default, toggle in config):** categories, tags, author archives, RSS — [docs/features.md](./docs/features.md)

**SEO:** per-post title/description/canonical (no trailing slash) · sitemap · RSS · robots · JSON-LD (`BlogPosting`, `BreadcrumbList`)

**Deploy modes** — set `DEPLOY_MODE` in `.env.local`:

| Mode | Public URL example | Use case |
|------|-------------------|----------|
| **subdirectory** | `yourproduct.com/blog/post-slug` | Blog module on a product site |
| **subdomain** | `blog.yourproduct.com/post-slug` | Dedicated blog subdomain |
| **standalone** | `openblog.ai/blog/post-slug` | Template demo (placeholder domain) |

Subdirectory behind reverse proxy: set `ASSET_PREFIX=/blog` if `/_next/static` 404s.

---

## Content model

```yaml
---
title: "Your post title"
description: "SEO meta description and list excerpt (80–320 characters)"
slug: "your-post-slug"
date: "2026-08-29"
updated: "2026-08-29"
category: "engineering"
tags: ["open-source", "blog"]
author: "your-slug"
draft: false
---

Write the body in Markdown. Agents edit this file; you review the diff in a PR.
```

**Rules** (`AGENTS.md` + CI): kebab-case `slug`, `description` 80–320 chars, root-relative internal links (`/blog/other-post`).

---

## Production usage

| Site | Pattern |
|------|---------|
| **[Alignify](https://alignify.co)** | Product-site content hub — Git-backed, agent-maintained |
| **100+ AI / SaaS teams** | Subdirectory/subdomain blogs on existing sites — [Customer Stories](https://alignify.co/customer-stories) |

OpenBlog packages the **repeatable blog-module layer** from production AI product sites. Walkthrough: [How to build a blog without a CMS, using AI](https://alignify.co/blog/how-to-build-a-blog-without-a-cms-using-ai)

---

## Compare

| | OpenBlog | WordPress | Headless CMS | Skills-only |
|--|----------|-----------|--------------|-------------|
| Open source | Yes | Partial | Varies | Varies |
| Blog module (not full CMS) | Yes | No | Varies | N/A |
| Git-native content | Yes | No | Sometimes | Yes |
| Agent-ready template | Yes | No | Rare | No |
| Blog SEO primitives | Yes | Plugins | Varies | DIY |
| Time to `/blog` on product site | Low | Medium | Medium | High |

**Stack:** Next.js (App Router) · Markdown + gray-matter · Zod · Tailwind · Vercel / Cloudflare / static CDN

---

## Roadmap

- [x] Agent-native blog template + decoupled `packages/*` layers
- [x] `openblog.config.ts`, three deploy modes, `integrate` + `theme:infer` + `create-openblog` CLIs
- [x] `AGENTS.md` + Skills · CI frontmatter validation
- [ ] Optional: MCP tools for agent integration

---

## Contributing

OpenBlog is **MIT — use and fork freely** on your own sites. **Upstream PRs to this repo are enterprise-only** (design-token or platform partners). Details: [CONTRIBUTING.md](./CONTRIBUTING.md). Bug reports: GitHub Issues / Discussions. Maintainers: [docs/releasing.md](./docs/releasing.md).

---

## License

[MIT](LICENSE)

**Further reading:** [docs/README.md](./docs/README.md) · Lee Robinson — [Content is just code](https://leerob.com/agents)
