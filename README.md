# OpenBlog: Git-Based Blog CMS for Product Websites

[![CI](https://github.com/kostja94/openblog/actions/workflows/ci.yml/badge.svg)](https://github.com/kostja94/openblog/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/kostja94/openblog)](https://github.com/kostja94/openblog/stargazers)

**OpenBlog** is an open-source, agent-native blog CMS for product websites. Mount it at `/blog`, keep Markdown in Git as the content source of truth, and let coding agents maintain content, routes, theme, site chrome, and blog SEO through reviewable pull requests.

The Next.js implementation ships blog list and article pages, taxonomy, RSS, sitemap, robots, canonical URLs, and JSON-LD without adding a CMS database or separate editorial backend.

> **Git is the CMS. Your coding agent is the admin.**

**[Integrate OpenBlog into an existing product site →](./INTEGRATION.md)**

Or try the standalone scaffold below.

---

## Quick start

### Add `/blog` to an existing product site

Use this path when you already have a homepage, SaaS product, or documentation site and want the blog to share its domain, navigation, logo, and visual system.

```bash
git clone https://github.com/kostja94/openblog.git
cd openblog
npm install
npm run dev
# http://localhost:3000/blog
```

Then follow [INTEGRATION.md](./INTEGRATION.md) to choose a subdirectory, monorepo, or subdomain pattern and connect `openblog.config.ts`, site chrome, theme, and deployment variables.

Optional brand draft:

```bash
npm run integrate -- --site https://yourproduct.com
```

### Create a standalone blog

```bash
git clone https://github.com/kostja94/openblog.git
cd openblog
npm run create-openblog -- my-blog
cd my-blog
npm install
npm run dev
# http://localhost:3000/blog
```

Scaffold options and output structure are documented in [packages/create-openblog](./packages/create-openblog/README.md). Demo configuration uses `openblog.ai` as a placeholder domain, not a live service.

### Install the Agent Skills

```bash
npx skills add kostja94/openblog --skill blog-cms integrate-product-site setup-blog-module
```

Start with `blog-cms` when the correct path is unclear. The complete skill catalog covers integration, setup, post maintenance, validation, and publishing: [skills/README.md](./skills/README.md).

## Why OpenBlog

Most product teams already review website code and deployments in Git. OpenBlog extends that workflow to the blog instead of introducing another application, database, and disconnected design system.

| OpenBlog provides | Why it matters |
|---|---|
| Markdown + YAML frontmatter in Git | Portable content, version history, searchable files, and reviewable diffs |
| Product-site integration | Mount at `/blog` and reuse the host site's domain, navigation, logo, and design language |
| Static blog routes | Crawlable list, article, category, tag, and author pages without a runtime content API |
| Blog SEO primitives | Canonical URLs, sitemap, RSS, robots, metadata, and structured data are part of the module |
| Agent contracts | `AGENTS.md`, Skills, schemas, and validation tell coding agents how to change the system safely |
| Decoupled packages | Core, content, components, themes, and frontend adapters can evolve independently |

OpenBlog is not an AI article generator. Agents maintain the CMS and can edit user-supplied content; editorial strategy and approval remain with the team.

## How it works

```text
Markdown post
    ↓
Schema and link validation
    ↓
Next.js static routes + SEO metadata
    ↓
Preview and pull-request review
    ↓
Merge and deploy
```

Posts live under `templates/next/content/blog/*.md`. The filename matches the slug, drafts stay out of RSS and sitemap output, and published slugs are statically generated.

## What ships

- Blog index and article routes
- Category, tag, and author archives
- RSS, sitemap, robots, canonical metadata, and JSON-LD
- Configurable site header, footer, logo, navigation, and home URL
- Theme presets and generated CSS tokens
- Optional table of contents, author box, sharing, previous/next links, tags, TL;DR, and X embeds
- Local Markdown content adapter with schema validation
- Agent Skills for setup, integration, content operations, validation, and publishing

Categories, tags, authors, and RSS are individually configurable. See [features](./docs/features.md) and [theming](./docs/theming.md).

## Deployment patterns

| Mode | Public URL example | Best fit |
|---|---|---|
| `subdirectory` | `yourproduct.com/blog/post-slug` | Existing product site with separate blog deployment |
| `monorepo` | `yourproduct.com/blog/post-slug` | Blog routes maintained inside the product repository |
| `subdomain` | `blog.yourproduct.com/post-slug` | Independently branded or deployed publication |
| `standalone` | `example.com/blog/post-slug` | New blog without an existing product frontend |

Reverse-proxy and asset-prefix details live in [INTEGRATION.md](./INTEGRATION.md) and the [deployment routing guide](./templates/next/docs/DEPLOY-ROUTING.md).

## Production evidence

[Alignify](https://alignify.co) runs the Markdown + Git + Agent workflow in production and identifies OpenBlog as the reusable module for this path. Its public implementation walkthrough documents the evolution from WordPress and generated prototypes to an agent-maintained Git workflow: [How to build a blog without a CMS using AI](https://alignify.co/blog/how-to-build-a-blog-without-a-cms-using-ai).

OpenBlog also draws on broader product-site work documented by Alignify across **100+ AI products and partners**. That number describes Alignify's service and research experience—not 100+ verified OpenBlog installations. See the published [customer stories and partner scope](https://alignify.co/customer-stories).

Repository-level evidence is reproducible: CI installs dependencies, runs unit tests, builds a fresh scaffold, lints the Next.js template, validates posts, and completes a production build.

## Architecture comparison

The useful question is not whether one CMS category always wins; it is who maintains content and where the source of truth should live.

| Capability | OpenBlog | Traditional CMS | Headless CMS | Custom blog |
|---|---|---|---|---|
| Primary content source | Git Markdown | CMS database | Hosted content API/database | Project-specific |
| Main editing workflow | Agent or developer edits + pull requests | Visual administration UI | Visual UI + API-driven frontend | Project-specific |
| Product-site integration | Blog module, shared routes, or routed deployment | Theme or plugin integration | Custom frontend consuming an API | Fully custom |
| Separate content database | No | Usually | Yes, provider-managed | Depends |
| Blog routes included | Yes | Yes | Frontend required | Must be built |
| SEO primitives | Included for blog paths | Core features and plugins | Frontend responsibility | Must be built |
| Review model | Git diff, preview, CI, merge | CMS roles and workflow | CMS roles and workflow | Project-specific |
| Strongest fit | Agent- or developer-maintained product sites | Teams publishing mainly through a visual admin | Multi-channel and structured editorial teams | Products with unique requirements |

This table describes common architecture patterns, not every product in each category. If non-technical editors publish frequently or require complex approvals, a traditional, headless, or Git-based visual CMS may be a better fit than a pull-request-first workflow.

## Configuration and content

Users customize the module through `openblog.config.ts`; core packages should rarely need to be forked.

```text
openblog/
├── openblog.config.ts        # site, chrome, theme, features, content
├── packages/                 # core, content, components, themes, scaffold CLI
├── templates/next/           # Next.js routes, Markdown posts, chrome overrides
├── integrations/             # deployment patterns and generated integration artifacts
├── skills/                   # Agent workflows
└── AGENTS.md                 # repository and content contract
```

A post starts with validated frontmatter:

```yaml
---
title: "Your post title"
description: "A useful 80–320 character description for search and article discovery."
slug: "your-post-slug"
date: "2026-09-25"
author: "Your team"
category: "engineering"
tags: ["open-source", "blog"]
draft: false
---
```

The complete schema, URL rules, content paths, and validation requirements are maintained in [AGENTS.md](./AGENTS.md).

## Agent and ecosystem contracts

OpenBlog includes Skills for the work around the CMS:

| Request | Skill |
|---|---|
| Add `/blog` to a product site | `integrate-product-site` |
| Scaffold a standalone blog | `setup-blog-module` |
| Add or edit user-supplied content | `create-post` |
| Check blog SEO and build output | `validate-blog-seo` |
| Follow the merge and deployment checklist | `publish` |

[Pagina](https://github.com/kostja94/pagina) owns reusable page contracts, and [Bricks](https://github.com/kostja94/bricks) owns reusable component contracts. OpenBlog declares which of those contracts its runnable CMS implements without taking runtime dependencies on either project. The generated mapping is in [Agent contracts](./docs/component-model.md).

For site-wide SEO, GEO, keyword research, and growth work beyond the blog module, use [marketing-skills](https://github.com/kostja94/marketing-skills). OpenBlog only owns blog-path SEO primitives.

## Scope

| OpenBlog is designed for | Choose another path when you need |
|---|---|
| Product-site blogs maintained by agents or developers | A whole-site or multi-tenant CMS |
| Git-reviewed Markdown publishing | Daily self-service editing by a large non-technical team |
| Static public content and blog taxonomy | Real-time collaborative editing or complex approval workflows |
| A reusable `/blog` module | A marketing landing-page generator or documentation platform |
| Blog-level SEO infrastructure | Site-wide keyword strategy, GEO, or campaign operations |

Optional visual editing can be added through tools such as Tina or Decap while keeping Git as the content source of truth, but those systems are not bundled with OpenBlog.

## Development and verification

```bash
npm install
npm test
npm run lint
npm run validate:posts
npm run build
```

The repository uses Next.js App Router, TypeScript, Markdown with `gray-matter`, Zod, Tailwind CSS, Vitest, and npm workspaces.

## Roadmap

- [x] Decoupled core, content, component, theme, and frontend layers
- [x] Configurable deployment modes, chrome, themes, and optional features
- [x] Agent contracts, content validation, CI, and standalone scaffolding
- [ ] Publish `create-openblog` to npm for direct `npx create-openblog` usage
- [ ] Explore optional MCP integration without changing Git as the source of truth

## Contributing

OpenBlog is MIT licensed: use it, adapt it, and fork it for your own sites. Upstream pull requests are reserved for enterprise design-token and component/platform partners; everyone can report bugs or propose improvements through Issues and Discussions. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](LICENSE)

Maintained by [kostja](https://github.com/kostja94) · [Documentation](./docs/README.md) · [Release guide](./docs/releasing.md)
