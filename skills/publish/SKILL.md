---
name: publish
description: Publish checklist for OpenBlog content via Git PR workflow. Use when a post is ready to merge and deploy.
---

# Publish

OpenBlog publishes through **Git merge → CI build → CDN**. There is no CMS Publish button.

## Checklist

1. `npm run validate:posts` — green
2. `npm run build` — green
3. Preview deploy reviewed (metadata, OG, mobile layout)
4. PR description lists new/changed slugs
5. Merge to main

## After merge

- Static HTML regenerates for all slugs
- Sitemap and RSS update at `/blog/sitemap.xml` and `/blog/rss.xml`
- Draft posts stay excluded until `draft: false`

## Host-site handoff (optional)

Search indexing for the **main product site** (Google Search Console, IndexNow, Bing Webmaster) is the **host site's** responsibility — not OpenBlog's publish workflow. After deploy, the product team may submit changed blog URLs through their existing search-console or IndexNow integration if they maintain one.
