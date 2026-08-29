# Integrating OpenBlog into an existing website

> **Agents:** If the user has a product site, **this doc is the default entry** — not `create-openblog`. Ask to confirm before scaffolding a greenfield project.

Most teams **do not** build a blog from zero — they mount OpenBlog on a product site that already has a homepage, docs, and brand assets. This guide is the single entry point for that path.

**Artifacts:** copy-paste examples live in [`integrations/`](./integrations/).  
**Code you edit:** `openblog.config.ts` + `templates/next/src/chrome/`.

---

## Three layers (do not confuse)

| Layer | What | Where | You replace? |
|-------|------|-------|--------------|
| **Site Chrome** | Navbar, footer, logo | `templates/next/src/chrome/` | **Yes** — match main site |
| **Blog Chrome** | Breadcrumbs, article layout, share, related | `packages/components` | Toggle via config |
| **Brand assets** | Logo, favicon | `public/brand/` or CDN URL in config | **Yes** |

OpenBlog **does not** ship your marketing site. It ships a **blog module** that should look like it belongs on your domain.

**SEO scope:** OpenBlog covers **blog module SEO** — sitemap, RSS, robots for blog paths, and JSON-LD. Site-level items like `llms.txt`, marketing pages, and product homepage SEO belong to the **host site**, not OpenBlog.

---

## Choose an integration mode

| Mode | URL example | Doc |
|------|-------------|-----|
| **Subdirectory** (recommended) | `yourproduct.com/blog/post` | [integrations/patterns/subdirectory.md](./integrations/patterns/subdirectory.md) |
| **Monorepo merge** | Same deploy as main Next app | [integrations/patterns/monorepo.md](./integrations/patterns/monorepo.md) |
| **Subdomain** | `blog.yourproduct.com/post` | [integrations/patterns/subdomain.md](./integrations/patterns/subdomain.md) |

Behind a reverse proxy / broken CSS → [reverse-proxy.md](./integrations/patterns/reverse-proxy.md)

---

## 5-minute checklist

### 1. Set site + chrome in `openblog.config.ts`

```typescript
import { defineConfig } from "@openblog/core";

export default defineConfig({
  site: {
    name: "Your Product",
    description: "…",
    locale: "en-US",
    url: "https://yourproduct.com",
  },
  chrome: {
    mode: "custom",
    siteUrl: "https://yourproduct.com",
    homeUrl: "https://yourproduct.com",
    logo: "/brand/logo.svg",       // or https://cdn…/logo.svg
    logoAlt: "Your Product",
    nav: [
      { label: "Product", href: "https://yourproduct.com", external: true },
      { label: "Docs", href: "https://yourproduct.com/docs", external: true },
      { label: "Blog", href: "/blog", match: "blog" },
    ],
  },
  // … content, theme, components
});
```

See [integrations/chrome/brand.manifest.example.json](./integrations/chrome/brand.manifest.example.json).

### 2. Add logo files

Place assets under `templates/next/public/brand/` or point `chrome.logo` at your CDN.

### 3. Align navbar / footer

Edit **`templates/next/src/chrome/site-chrome.ts`** — or set `chrome.nav` / `chrome.footer` in config.

For **identical** React components from your main app:

```typescript
chrome: { mode: "inherit-monorepo" }
```

Then override in `templates/next/src/chrome/overrides/` and wire in `app/blog/layout.tsx`. See [overrides README](./templates/next/src/chrome/overrides/README.md).

### 4. Environment

```env
SITE_URL=https://yourproduct.com
DEPLOY_MODE=subdirectory
BLOG_BASE_PATH=/blog
# ASSET_PREFIX=/blog   # if static assets 404 behind proxy
```

### 5. Ship content

Write posts in `templates/next/content/blog/*.md`, run `npm run validate:posts`, deploy.

**Optional capabilities:** categories, tags, authors, and RSS can be turned off per site via `features` in `openblog.config.ts`. See [docs/features.md](./docs/features.md) for defaults, frontmatter rules, and how this differs from `components.optional`.

---

## Can I paste my website URL and auto-import everything?

**Partially — and only for brand metadata, not components.**

| From URL | Automatable? | Where it goes |
|----------|--------------|---------------|
| Logo / favicon / `og:image` | Yes (`npm run integrate`) | `public/brand/`, `chrome.logo` |
| `theme-color`, site title | Yes (best-effort) | config draft |
| Nav link labels/URLs | Fragile HTML parse | draft `site-chrome.ts` — **review manually** |
| Navbar/Footer **React components** | **No** | Copy from main repo or monorepo share |

Run from the repo root:

```bash
npm run integrate -- --site https://yourproduct.com
# → integrations/chrome/.generated/brand.manifest.json
```

The CLI fetches the product homepage, extracts title, `theme-color`, `og:image`, and favicon, then writes a draft manifest. Copy hints into `openblog.config.ts` `chrome` block or compare with [brand.manifest.example.json](./integrations/chrome/brand.manifest.example.json).

Unknown ids in `components.required` fail `npm run validate:posts` (build gate). Known ids: `breadcrumbs`, `post-title`, `post-meta`, `post-dek`, `featured-image`, `markdown`.

**Why not full component import?** Main sites use different frameworks, CSS, and auth. OpenBlog gives you a **chrome slot** to plug your own Header/Footer — not a scraper that reverse-engineers them.

---

## Chrome config reference

| Field | Purpose |
|-------|---------|
| `chrome.mode` | `openblog-default` \| `custom` \| `inherit-monorepo` |
| `chrome.siteUrl` | Main product origin (integration anchor) |
| `chrome.homeUrl` | Logo click target (usually product home) |
| `chrome.logo` | `/brand/logo.svg` or absolute CDN URL |
| `chrome.logoAlt` | Accessible logo text |
| `chrome.nav` | Header links (overrides `site-chrome.ts` defaults) |
| `chrome.footer` | Footer columns + legal links |

Blog URL helpers (`blogPath`, canonical, sitemap) still come from `site.url` + `DEPLOY_MODE`.

---

## What stays in OpenBlog packages

Do **not** fork these for integration:

- `@openblog/components` — article/list UI
- `@openblog/core` — schema, SEO, URL rules
- `@openblog/content` — Markdown adapter

Only **Site Chrome** (header/footer/logo) is expected to differ per product.

---

## Related docs

- [README.md](./README.md) — quick start
- [docs/features.md](./docs/features.md) — optional categories, tags, authors, RSS
- [docs/theming.md](./docs/theming.md) — theme presets and inference
- [AGENTS.md](./AGENTS.md) — agent content contract
- [integrations/README.md](./integrations/README.md) — integration artifacts index
