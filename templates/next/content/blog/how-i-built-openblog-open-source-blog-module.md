---
title: "How I Built OpenBlog — An Open Source Blog Module for Product Sites"
description: "The story behind OpenBlog: why we wanted a Git-native blog module for product sites, how Skills and a Next.js template became one open repo, and what clean URLs and three deploy modes mean for your brand."
slug: "how-i-built-openblog-open-source-blog-module"
date: "2026-08-29"
updated: "2026-08-29"
author: "Open Blog Team"
category: "Announcements"
tags: ["open-source", "blog-cms", "agent-first", "nextjs", "content-as-code"]
draft: false
cover: "/images/openblog-cover.svg"
tldr: "OpenBlog ships Skills plus a Next.js template so product teams can publish a branded blog module from Git—clean URLs, three deploy modes, and an agent contract that keeps Markdown edits safe."
---

# How I Built OpenBlog — An Open Source Blog Module for Product Sites

Every product team eventually faces the same tension: the **homepage sells the vision**, the **docs explain the system**, and the **blog earns trust over time** — yet all three rarely belong in one bloated CMS. I started OpenBlog to give that middle layer a home: a blog module you can fork, brand, and ship without surrendering content to a database or a dashboard nobody wants to maintain.

This is the story of how that repo came together.

## TL;DR

- **The itch:** AI can write posts, but most stacks still leave you to invent routes, SEO, and deploy wiring from scratch.
- **The bet:** Ship **Skills + a template** in one repo — clone, run, publish Markdown from Git.
- **The shape:** A **blog module** on your product domain, not a whole-site replacement.
- **The polish:** Clean canonical URLs, three deploy modes, and an agent contract that keeps edits safe.
- **The line we repeat:** Git is the CMS. Your coding agent is the admin.

## 1. The moment it clicked

I was tired of watching teams choose between two bad options.

Option A: a **traditional CMS** — fast for non-technical editors, slow for anyone who thinks in diffs and pull requests. Content drifts from code. Agents cannot grep the truth.

Option B: **AI writing tools** — great for drafts, but the site itself still lives somewhere else. You get copy without architecture.

What I wanted was smaller and sharper: **a blog that behaves like code** inside a product’s world. Homepage and pricing stay where they are. Docs stay where they are. The blog mounts at `/blog`, earns search traffic, and updates through the same Git rhythm engineers already trust.

That is the brand promise behind Open Blog: **publish with clarity, own your words, let agents help without breaking the guardrails.**

## 2. Why “Skills only” or “template only” was not enough

Open source audiences do not want a treasure map. They want a **working ship**.

| What we refused | What we shipped instead |
|-----------------|-------------------------|
| Rules without a runnable site | A Next.js template you can `npm run dev` today |
| A pretty starter without agent norms | Skills + `AGENTS.md` so edits stay consistent |
| A full CMS in disguise | A **blog slice** — list, article, category, RSS, sitemap |

The insight came from shipping blog modules on real product sites: the winning pattern was never “install a plugin.” It was **Markdown in Git, static HTML out, humans review the PR**.

Skills alone ask you to rebuild the hull. Templates alone invite the first agent edit to corrupt a slug. **Together**, they shorten time-to-first-post *and* time-to-second-post without fear.

## 3. Learning from production — without naming names

We had already run blogs as **separate deployments** glued to product domains — blog at `/blog`, product elsewhere, shared header that points home. That architecture felt right: the blog is a **chapter**, not the whole book.

From those runs we kept the habits that aged well:

- One Markdown file per post, one frontmatter block per truth
- Static pages crawlers can read in full on first byte
- Site chrome that reminds readers they are still in *your* product universe
- Environment variables for “where does this blog think it lives?”

We also fixed what repeatedly hurt SEO and agent workflows:

- **Canonical URLs without trailing slashes** — one clear link per article
- **No duplicate meta registries** — if it is not in the Markdown frontmatter, it does not exist
- **Validation before build** — broken schema fails in CI, not in production
- **No video pipeline in v0** — scope discipline as a brand choice: ship the editorial core first

The story is not “we forked X.” The story is **we distilled what survived contact with production.**

## 4. Three ways to wear the same module

Your brand’s infrastructure will differ. The module should not fight you.

| Mode | Feels like | Best when |
|------|------------|-----------|
| **Subdirectory** | `yourproduct.com/blog/story` | Blog sits beside an existing app |
| **Subdomain** | `blog.yourproduct.com/story` | Editorial has its own front door |
| **Standalone** | `openblog.ai/blog/story` | The site *is* the blog for now |

All three share the same content folder and the same agent rules. You change **`SITE_URL`** and **`DEPLOY_MODE`**, not your writing habit.

For subdirectory mounts behind a reverse proxy, we document **`ASSET_PREFIX`** — a small config line that prevents the silent “CSS vanished” failure teams remember forever.

## 5. What we put in the box

OpenBlog is intentionally legible. Fork it and you see a story in the tree:

```
openblog/
├── templates/next/     # The site you run
├── content/blog/       # The words you own
├── skills/             # How agents should behave
├── AGENTS.md           # The contract
└── README.md           # The invitation
```

Each post is a file. Each file carries its own SEO metadata. Drafts stay out of the sitemap until you are ready to stand behind them publicly.

That simplicity *is* the branding: **nothing hidden behind a login, nothing locked in a vendor schema.**

## 6. How agents fit the narrative

We did not build OpenBlog so AI could replace authors. We built it so **authors and agents share a workspace**.

The loop we want every team to feel:

1. You describe intent in plain language.
2. The agent drafts Markdown that already matches schema.
3. A skill pass catches SEO footguns before humans do.
4. You review a preview like any other code change.
5. Merge publishes static HTML to your CDN.

The repo Skills (`setup-blog-module`, `integrate-product-site` for the module; optional `create-post`, `validate-blog-seo`, `publish` for content ops) are the **editorial choreography**. They turn “please write a blog post” into a repeatable production line — without pretending publishing is magic.

## 7. What v0.1 is — and what it refuses to be

**OpenBlog v0.1 is:**

- A blog index, article pages, and category archives
- RSS, sitemap, and structured data for search
- Seed stories that explain the module itself
- Build-time validation you can trust in CI

**OpenBlog v0.1 is not:**

- A landing-page builder
- A video hub
- A visual admin for non-technical editors — though you can add a Git-based editor later without moving the source of truth

That refusal is part of the brand. **Do one job beautifully.** Let the blog be the blog.

## Conclusion

OpenBlog began as a practical problem — *where should product blogs live in the agent era?* — and became a brand stance: **your words belong in your repository, your URLs should look intentional, your agents should work inside rules you wrote.**

If you are building a product and the blog still feels like an afterthought, fork OpenBlog, set your domain, pick a deploy mode, and write the story only you can tell. The first post can be the origin story. This one is ours.

## Frequently asked questions

**Is OpenBlog a full website platform?**

No. It is a **blog module** — the editorial engine, not the entire product surface. Your homepage, pricing, and docs can live elsewhere.

**Who is OpenBlog for?**

Teams that publish in Git, care about SEO, and want coding agents to help **maintain** content — not teams looking for a click-to-publish CMS for a large non-technical newsroom.

**Why avoid trailing slashes in canonical URLs?**

One URL per article reads cleaner in analytics, shares, and search consoles. We standardize on that shape across deploy modes.

**Can the blog live at `/blog` on my main domain?**

Yes. Subdirectory mode is the default mental model for product sites. Configure your proxy, set `SITE_URL` to the main domain, and validate assets if your platform requires it.

**Where should agents start?**

Read `AGENTS.md`, install the Skills from `skills/`, and run `npm run validate:posts` before you ask for review. The contract is the brand guardrail.
