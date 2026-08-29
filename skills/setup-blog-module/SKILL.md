---
name: setup-blog-module
description: Greenfield OpenBlog setup — scaffold, config, deploy env, theme, features, validate/build. Use when starting from scratch or user wants to try OpenBlog locally first. NOT the default if user has an existing product site — use integrate-product-site instead.
---

# Setup Blog Module

Greenfield workflow for a **new OpenBlog instance**. Use when the user **does not** have an existing product site to integrate, or explicitly wants a local demo before INTEGRATION.

## Agent: confirm with the user

If unclear, ask:

> Do you want to mount `/blog` on an **existing product site** (→ [INTEGRATION.md](../../INTEGRATION.md)), or **run a local demo first** (→ `create-openblog`)?

Only use this skill after they choose greenfield / try-first.

## When to use

- User wants a new blog from zero (standalone, subdirectory, or subdomain)
- User needs `openblog.config.ts`, env, theme, or `features` configured
- User asks to verify the project builds before first deploy

## Steps

### 1. Scaffold

```bash
npx create-openblog my-blog
# or from monorepo root:
npm run create-openblog -- my-blog
```

Options: `--dir <name>`, `--preset vercel-geist`, `--no-install`. See `packages/create-openblog/README.md`.

### 2. Configure `openblog.config.ts`

At repo root, set:

- `site` — name, description, locale, `url`
- `content` — adapter and content dir (default `templates/next/content/blog`)
- `theme` — preset id or custom; run `theme:sync` after changes
- `features` — toggle categories, tags, authors, RSS (see `docs/features.md` in monorepo, or `FEATURES.md` in scaffolded projects)
- `components.optional` — Blog Chrome toggles (TOC, share bar, etc.)

### 3. Deploy environment

Copy `templates/next/.env.example` → `.env.local`:

```env
SITE_URL=https://yourdomain.com
DEPLOY_MODE=subdirectory   # subdirectory | subdomain | standalone
BLOG_BASE_PATH=/blog       # subdirectory only
# ASSET_PREFIX=/blog       # if static assets 404 behind reverse proxy
```

See `templates/next/docs/DEPLOY-ROUTING.md` for mode details.

### 4. Theme sync

```bash
npm run theme:sync   # writes templates/next/src/app/theme.generated.css
```

`dev` and `build` run `theme:sync` automatically. See `docs/theming.md`. Optional: `npm run theme:infer -- --url https://…` for draft palette hints.

### 5. Features

Edit `features` in `openblog.config.ts` to disable taxonomy/feeds the site does not need. Validation rules follow enabled flags — see `docs/features.md` (or `FEATURES.md` in scaffolded projects).

### 6. Validate and build

From repo root:

```bash
npm install
npm run validate:posts
npm run build
npm run dev   # → http://localhost:3000/blog
```

Fix any frontmatter or config errors before handing off to content skills.

## Related skills

- **Not sure which path?** Start with `blog-cms`.
- **Existing product site?** Use `integrate-product-site` instead.
- **Writing posts?** Use `create-post` (user provides body/brief).
- **Pre-publish checks?** Use `validate-blog-seo`.

## Out of scope

Do **not** use this skill for:

- Keyword research, content calendars, or GEO strategy → use **marketing-skills**
- Marketing landing pages, product homepage, or docs site
- Site-wide SEO audit (llms.txt, homepage meta, GSC) → host site responsibility
- Autonomous AI content generation at scale → user provides content; OpenBlog validates structure
