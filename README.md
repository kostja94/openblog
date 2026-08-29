# OpenBlog — Open Source CMS for Blogs

**OpenBlog** is an **open-source, Git-based CMS for blogs** — built as an **agent-native blog module** you mount on product websites (typically at `/blog`). Markdown in Git is the source of truth. A Next.js template renders list pages, post pages, RSS, sitemap, and JSON-LD. Coding agents follow `AGENTS.md` and Skills to maintain the module through Pull Requests.

> **Git is the CMS. Your coding agent is the admin.**

OpenBlog is **not** a WordPress/Webflow site builder and **not** a site-wide SEO platform — it delivers the **blog slice** (routes, theme, chrome, crawlability primitives). For homepage SEO, GEO, and content strategy, pair with **[marketing-skills](https://github.com/kostja94/marketing-skills)** (optional).

**→ Most teams start here: [INTEGRATION.md](./INTEGRATION.md)** — mount `/blog` on an existing product site.

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

Optional content workflows (`create-post`, `publish`) exist but **the primary path is mounting the module**, not auto-generating articles.

Demo: [Alignify](https://alignify.co) · [How to build a blog without a CMS, using AI](https://alignify.co/blog/how-to-build-a-blog-without-a-cms-using-ai)

---

## What OpenBlog is NOT

- **Not a whole-site CMS** — no visual editor for marketing pages, docs hubs, or app UI (WordPress/Webflow territory)
- **Not an AI writing platform** — agents maintain Markdown in Git; OpenBlog does not replace your content strategy
- **Not site-wide SEO / GEO** — blog-path **SEO primitives** only; pair with [marketing-skills](https://github.com/kostja94/marketing-skills) for growth workflows

Optional visual editors ([Tina](https://tina.io/), [Decap](https://decapcms.org/), [GitCMS](https://gitcms.dev/)) can sit on top — **Git remains the source of truth**.

---

## Who is this for?

- **Product teams** adding `/blog` to an existing marketing or SaaS site
- **Developers using coding agents** who want Content-as-Code instead of a dashboard
- **Indie hackers and startups** shipping a technical blog without WordPress or a headless CMS project

**Not primarily for:** standalone keyword research or GEO audits — use [marketing-skills](https://github.com/kostja94/marketing-skills) on the host site (OpenBlog works standalone; combined is stronger).

---

## What it builds

OpenBlog delivers a **`/blog` module on your product site**:

- Post list and article pages under your domain
- Site chrome (navbar, footer, logo) you align with the main product
- **SEO primitives built in** for blog paths: sitemap, RSS, robots, canonical URLs, JSON-LD, crawlable static pages

**Already have a product site?** Start here — this is the primary path:

**→ [INTEGRATION.md](./INTEGRATION.md)** — chrome, logo, deploy modes (subdirectory / subdomain / monorepo)

---

## Quick start

### ★ Primary: integrate into your product site

**Already have a homepage, docs, or SaaS marketing site?** This is the main path:

**→ [INTEGRATION.md](./INTEGRATION.md)** — subdirectory (`yourproduct.com/blog`), subdomain, monorepo, chrome/logo, deploy modes.

```bash
# After wiring config + chrome (see INTEGRATION.md):
npm install
npm run dev
# → http://localhost:3000/blog
```

Optional helpers: `npm run integrate -- --site https://yourproduct.com` (brand manifest draft), skills `integrate-product-site`.

---

### Try it first — greenfield scaffold

**No product site yet, or you want a local demo before integrating?**

```bash
# When create-openblog is on npm (recommended at public launch):
npx create-openblog my-blog
cd my-blog
npm install
npm run dev
```

**From this monorepo (works before npm publish):**

```bash
npm run create-openblog -- my-blog
cd my-blog && npm install && npm run dev
```

Options: `--dir`, `--preset vercel-geist`, `--no-install`. See [`packages/create-openblog/README.md`](./packages/create-openblog/README.md). Skill: `setup-blog-module`.

---

### Maintainers — develop this repo locally

**For project maintainers only** (not a public contribution path). Clone this monorepo and run:

```bash
npm install
npm run dev
# → http://localhost:3000/blog
```

Upstream PRs are **enterprise-only** — see [CONTRIBUTING.md](./CONTRIBUTING.md). Users integrate via [INTEGRATION.md](./INTEGRATION.md) or `create-openblog`; they do not need this step.

---

## Pair with marketing-skills

OpenBlog provides the **blog module** — routes, theme, chrome, and **SEO primitives** (sitemap, RSS, robots, JSON-LD, per-post meta).

For **SEO, GEO, keyword research, and content workflows** on the wider product site, pair it with **[marketing-skills](https://github.com/kostja94/marketing-skills)**. OpenBlog is **fully usable alone**; the combination is stronger when you also care about homepage, docs, and growth pages.

OpenBlog does not replace site-level SEO, `llms.txt`, or marketing-page audits.

---

## Architecture

Layers are decoupled under `packages/`. Customize via **`openblog.config.ts`** at repo root.

```
openblog/
├── INTEGRATION.md            # ★ Existing-site integration entry
├── docs/                     # Features, theming, theme-axis references
├── openblog.config.ts        # site + chrome + theme + components + content
├── integrations/             # Patterns + chrome examples + CLI .generated
├── packages/
│   ├── core/                 # Schema, URL helpers, SEO generators
│   ├── content/              # ContentAdapter + local-md (default)
│   ├── components/           # Blog UI + optional component registry
│   ├── create-openblog/      # create-openblog CLI
│   └── themes/               # product / minimal / editorial CSS tokens
├── templates/next/           # Next.js frontend adapter (thin glue)
├── skills/                   # setup + integrate (primary); content ops (optional)
└── AGENTS.md                 # Agent contract
```

| Layer | Role |
|-------|------|
| **Template** | Blog module — list, post, category, RSS, sitemap |
| **Skills (primary)** | `setup-blog-module`, `integrate-product-site` — mount the module |
| **Skills (optional)** | `create-post`, `validate-blog-seo`, `publish` — content ops after the module exists |
| **Contract** | `AGENTS.md` + Zod validation — one schema for humans and agents |

Full agent rules: **[AGENTS.md](./AGENTS.md)**. Optional feature flags: **[docs/features.md](./docs/features.md)**. Theming: **[docs/theming.md](./docs/theming.md)**.

---

## Features (summary)

### Core blog module

- Markdown posts with YAML front matter
- Blog list and post pages; draft mode (`draft: true` excluded from sitemap and RSS)
- Build-time validation — invalid frontmatter fails CI

### Taxonomy & feeds (optional)

Categories, tags, author archives, and RSS are **on by default**; disable via `features` in `openblog.config.ts` — see [docs/features.md](./docs/features.md).

### Blog SEO primitives

- Per-post `title`, `description`, canonical URLs (**no trailing slash**)
- **SEO primitives built in:** sitemap, RSS, canonical URLs, JSON-LD, crawlable static pages; `robots.txt` for blog paths
- JSON-LD: `BlogPosting`, `BreadcrumbList`

### Agent workflow (optional content ops)

- `AGENTS.md` documents directories, schema, and invariants
- **Install (skills.sh):** `npx skills add kostja94/openblog --skill blog-cms integrate-product-site setup-blog-module`
- **Entry skill:** `blog-cms` — routes integrate vs scaffold
- **Primary skills:** `integrate-product-site`, `setup-blog-module`
- **Optional skills:** `create-post`, `validate-blog-seo`, `publish`
- PR preview → merge → CI deploy

See [skills/README.md](./skills/README.md) · [skills.sh](https://skills.sh/kostja94/openblog)

```mermaid
flowchart LR
  SPEC[AGENTS.md + Skills] --> AGENT[Coding Agent]
  AGENT --> MD[content/blog/*.md]
  MD --> PR[Pull Request]
  PR --> PREV[Preview deploy]
  PREV --> MERGE[merge main]
  MERGE --> CI[build + deploy]
  CI --> LIVE[CDN]
```

### Deployment modes

Set `DEPLOY_MODE` in `.env.local` (copy from `templates/next/.env.example`):

| Mode | Public URL example | Use case |
|------|-------------------|----------|
| **subdirectory** | `yourproduct.com/blog/post-slug` | Blog module on a product site |
| **subdomain** | `blog.yourproduct.com/post-slug` | Dedicated blog subdomain |
| **standalone** | `openblog.ai/blog/post-slug` | Blog-focused demo site |

Subdirectory behind reverse proxy: set `ASSET_PREFIX=/blog` if `/_next/static` 404s. Routing details: [templates/next/docs/DEPLOY-ROUTING.md](./templates/next/docs/DEPLOY-ROUTING.md).

---

## Content model

Each post is a Markdown file. Front matter drives routing, SEO, and list cards.

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

**Enforced rules** (`AGENTS.md` + CI): kebab-case `slug`, `description` 80–320 chars, root-relative internal links (`/blog/other-post`), drafts excluded from sitemap and RSS.

---

## Scope boundary

| In scope | Out of scope |
|----------|--------------|
| Blog list and post pages | Marketing landing pages |
| Git-based Markdown content | WYSIWYG admin (optional add-on) |
| Optional taxonomy & RSS (`features`) | Database-backed content |
| **Blog module SEO** — sitemap, RSS, robots for blog paths, JSON-LD | **Site-level SEO** — `llms.txt`, product homepage, marketing pages |
| Agent Skills | Multi-tenant SaaS, docs hub, tools directory |

OpenBlog covers **blog module SEO primitives**. Site-level SEO, GEO, and keyword strategy belong to the **host site** — see [marketing-skills](https://github.com/kostja94/marketing-skills).

---

## Production usage

OpenBlog patterns come from **production `/blog` and guide implementations** — not a demo-only template.

| Site | Pattern |
|------|---------|
| **[Alignify](https://alignify.co)** | Product-site content hub (guides, SEO library, vibe-coding playbooks) — Git-backed, agent-maintained structure |
| **100+ AI / SaaS teams** | Subdirectory blogs, subdomain content, and Markdown-in-Git publishing on existing marketing sites — see anonymized [Customer Stories](https://alignify.co/customer-stories) |

All referenced client work is in the **AI industry** (voice, video, agent, and vertical AI products). OpenBlog packages the **repeatable blog-module layer** from that work; growth SEO and GEO workflows live in [marketing-skills](https://github.com/kostja94/marketing-skills).

---

## Origin

OpenBlog extracts repeated `/blog` delivery patterns from production **AI product sites** (including [Alignify](https://alignify.co)) into an open-source module agents can maintain in Git.

---

## Tech stack

| Component | Choice |
|-----------|--------|
| Framework | Next.js (App Router) |
| Content | Markdown + gray-matter |
| Validation | Zod |
| Styling | Tailwind CSS |
| Hosting | Vercel / Cloudflare Pages / static CDN |

---

## Compare: OpenBlog vs alternatives

| | OpenBlog | WordPress | Headless CMS | Skills-only |
|--|----------|-----------|--------------|-------------|
| Open source | Yes | Partial | Varies | Varies |
| Blog module (not full CMS) | Yes | No (general CMS) | Varies | N/A |
| Git-native content | Yes | No | Sometimes | Yes |
| Agent-ready template | Yes | No | Rare | No |
| Blog crawlability / SEO primitives | Yes | Plugins | Varies | DIY |
| Time to `/blog` on product site | Low | Medium | Medium | High |

---

## Roadmap

- [x] `templates/next` — agent-native blog module template (v0.1)
- [x] Decoupled layers: `packages/core`, `content`, `components`, `themes` (v0.2)
- [x] `openblog.config.ts` — single customization entry
- [x] Blog crawlability baseline: RSS, sitemap, JSON-LD
- [x] `AGENTS.md` + Skills: setup, integrate, create-post, validate-blog-seo, publish
- [x] Frontmatter validation in CI (`npm run validate:posts`)
- [x] Three deployment modes (subdirectory / subdomain / standalone)
- [x] `integrate` CLI — chrome/brand manifest from product site
- [x] `theme:infer` — preset inference from product blog URL
- [x] `create-openblog` CLI — one-command project scaffolding
- [x] Author archive pages (optional via `features.authors`)
- [ ] Optional: MCP tools for agent integration

---

## Contributing

OpenBlog is **MIT — use and fork freely** on your own sites.

**Upstream contributions to this repository are enterprise-only.** We do **not** accept PRs from individual contributors. Official presets and partner listings are **curated** — many OSS contributions aim at product visibility as much as code; we route that through an explicit partnership process instead of an open merge queue. See [Why this policy](./CONTRIBUTING.md#why-this-policy) in CONTRIBUTING.md.

| Accepted | Examples |
|----------|----------|
| **Design token partners** | Production product sites contributing an official theme preset + tokens |
| **Component / platform partners** | Tailwind-class, CMS, vibe-coding, Figma / 21st.dev–class vendors contributing adapters or Blog Chrome kits |

Details, proposal process, and boundaries: **[CONTRIBUTING.md](./CONTRIBUTING.md)**

Bug reports and integration questions: **GitHub Issues / Discussions** (no PR required).

**Maintainers:** [docs/releasing.md](./docs/releasing.md) for public launch + npm publish.

---

## License

MIT — see [LICENSE](./LICENSE).

---

## Further reading

- [docs/README.md](./docs/README.md) — documentation index
- [docs/features.md](./docs/features.md) — optional categories, tags, authors, RSS
- [docs/theming.md](./docs/theming.md) — theme presets and inference
- [How to build a blog without a CMS, using AI](https://alignify.co/blog/how-to-build-a-blog-without-a-cms-using-ai) — Content-as-Code and agent workflows
- Lee Robinson — [Content is just code](https://leerob.com/agents) — migrating from headless CMS to Markdown in Git
