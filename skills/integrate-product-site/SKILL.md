---
name: integrate-product-site
description: Mount OpenBlog on an existing product website — chrome, deploy patterns, brand import. PRIMARY path. Use when the user already has a main site and wants /blog or blog subdomain. Ask the user to confirm before suggesting create-openblog.
---

# Integrate Product Site

OpenBlog is a **blog module**, not a full site builder. This skill wires the blog into an existing product domain so header/footer/logo match the main site.

**This is the recommended default** when the user mentions a product URL, marketing site, existing nav/footer, or “add blog to my site”.

## Agent: confirm with the user

Before scaffolding, ask:

> Do you already have a product site? If yes, start from **[INTEGRATION.md](../../INTEGRATION.md)** (subdirectory / subdomain / monorepo). Use `create-openblog` only for a greenfield demo.

If they have a site URL → proceed below. If greenfield only → hand off to `setup-blog-module`.

**Start by reading [INTEGRATION.md](../../INTEGRATION.md)** — it is the single entry point.

## When to use

- User has a product site and wants `/blog`, a subdomain, or monorepo merge
- User needs navbar/footer/logo aligned with the main site
- User asks to run `npm run integrate` or configure `chrome.mode`

## Three layers (do not confuse)

| Layer | Where | You replace? |
|-------|-------|--------------|
| **Site Chrome** | `templates/next/src/chrome/` | **Yes** — match main site |
| **Blog Chrome** | `packages/components` + config | Toggle via `components.optional` |
| **Brand assets** | `public/brand/` or CDN in config | **Yes** |

## Choose integration pattern

| Pattern | URL example | Doc |
|---------|-------------|-----|
| **Subdirectory** (recommended) | `yourproduct.com/blog/post` | `integrations/patterns/subdirectory.md` |
| **Monorepo merge** | Same deploy as main Next app | `integrations/patterns/monorepo.md` |
| **Subdomain** | `blog.yourproduct.com/post` | `integrations/patterns/subdomain.md` |

Reverse proxy / broken CSS → `integrations/patterns/reverse-proxy.md`

## Checklist

### 1. `openblog.config.ts` → `chrome`

```typescript
chrome: {
  mode: "custom",              // openblog-default | custom | inherit-monorepo
  siteUrl: "https://yourproduct.com",
  homeUrl: "https://yourproduct.com",
  logo: "/brand/logo.svg",
  logoAlt: "Your Product",
  nav: [ /* header links */ ],
  footer: { /* optional columns */ },
}
```

- `inherit-monorepo` — reuse Header/Footer from main app; wire overrides in `templates/next/src/chrome/overrides/`
- See `integrations/chrome/brand.manifest.example.json`

### 2. Edit `site-chrome.ts`

**`templates/next/src/chrome/site-chrome.ts`** — defaults when `chrome.nav` / `chrome.footer` are not set in config. Align link labels and URLs with the product site manually.

### 3. Brand import (partial automation)

```bash
npm run integrate -- --site https://yourproduct.com
# → integrations/chrome/.generated/brand.manifest.json
```

Extracts title, theme-color, og:image, favicon — **draft only**. Copy hints into config or compare with the example manifest. Nav labels from HTML parse are fragile — **review manually**.

### 4. Environment

```env
SITE_URL=https://yourproduct.com
DEPLOY_MODE=subdirectory
BLOG_BASE_PATH=/blog
```

### 5. Validate

```bash
npm run validate:posts
npm run build
```

## SEO scope

OpenBlog covers **blog module SEO** — sitemap, RSS, robots for blog paths, JSON-LD per post. Site-level items (marketing pages, product homepage meta, `llms.txt`) belong to the **host site**, not this skill.

## Related skills

- **Not sure which path?** Start with `blog-cms`.
- **Greenfield (no existing site)?** Use `setup-blog-module`.
- **Blog post SEO checks?** Use `validate-blog-seo` (frontmatter, canonical, build — not site-wide audit).

## Out of scope

Do **not** use this skill for:

- Scraping or reverse-engineering full product navbar/footer as React components → copy from main repo or use `inherit-monorepo`
- Product homepage SEO, docs SEO, or marketing page optimization
- Google Search Console setup or indexing submission → host site handoff (see `publish` skill)
