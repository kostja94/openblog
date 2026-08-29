---
name: validate-blog-seo
description: Blog module SEO validation only — frontmatter, canonical URLs, internal links, build gates. Use before merge/deploy or when reviewing blog posts. NOT site-wide SEO audit.
---

# Validate Blog SEO

**Scope:** blog module SEO validation only (frontmatter, canonical, build) — **NOT** site-wide SEO audit. For GEO, keyword research, or content strategy use **[marketing-skills](https://github.com/kostja94/marketing-skills)**.

## Pre-publish checklist

- [ ] `description` is 80–320 characters
- [ ] `slug` is kebab-case and matches filename
- [ ] `draft: false` for publish-ready posts
- [ ] Canonical URL has **no trailing slash**
- [ ] Internal links resolve to existing slugs
- [ ] Title is unique among published posts
- [ ] `npm run validate:posts` passes
- [ ] `npm run build` succeeds

## Canonical format

- Standalone / subdirectory: `https://{SITE_URL}/blog/{slug}`
- Subdomain: `https://{SITE_URL}/{slug}`

## Commands

Run from the repo root:

```bash
npm run validate:posts
npm run build
```

## Out of scope

- Site-wide SEO (homepage, product pages, llms.txt, GSC)
- Keyword research, content optimization, or GEO strategy → **[marketing-skills](https://github.com/kostja94/marketing-skills)**
- Marketing landing pages or non-blog routes
