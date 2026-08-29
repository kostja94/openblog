# Integrating OpenBlog into an existing website

This folder holds **copy-paste integration artifacts** — deployment patterns, chrome examples, and CLI `.generated` output. It is **not** the home for theme design docs (those live under [`docs/theme-axes/`](../docs/theme-axes/)).

For the full decision tree and step-by-step guide, start at **[INTEGRATION.md](../INTEGRATION.md)** at the repo root.

## Scope

| In this folder | Elsewhere |
|----------------|-----------|
| [patterns/](./patterns/) — subdirectory, monorepo, subdomain, reverse proxy | [docs/theming.md](../docs/theming.md) — presets and `theme:sync` |
| [chrome/](./chrome/) — brand manifest + `site-chrome` examples | [docs/theme-axes/](../docs/theme-axes/) — six design-axis references |
| [chrome/.generated/](./chrome/.generated/) — `integrate` CLI output (gitignored) | [integrations/theme/.generated/](./theme/.generated/) — `theme:infer` output (gitignored) |

## Contents

| Path | Purpose |
|------|---------|
| [patterns/](./patterns/) | Integration mode write-ups (subdirectory, monorepo, subdomain, reverse proxy) |
| [chrome/](./chrome/) | Brand manifest + `site-chrome` examples |
| [chrome/.generated/](./chrome/.generated/) | `npm run integrate` output (gitignored) |
| [theme/.generated/](./theme/.generated/) | `npm run theme:infer` inference JSON (gitignored) |

## Quick map

```
Your existing site                    OpenBlog
─────────────────                    ────────
Product homepage          ←── homeUrl ── Logo in SiteHeader
Navbar / Footer         ←── override ─ templates/next/src/chrome/
Blog routes only        ←── packages/components (breadcrumbs, articles…)
Markdown in Git         ←── templates/next/content/blog/
```

## What you edit (in order)

1. **`openblog.config.ts`** — `site.url`, `chrome.siteUrl`, `chrome.logo`, `chrome.nav`
2. **`templates/next/public/brand/`** — logo files (or use CDN URLs in config)
3. **`templates/next/src/chrome/site-chrome.ts`** — nav/footer links to match main site
4. **`templates/next/src/chrome/overrides/`** — optional: drop in your main site's Header/Footer
5. **`.env.local`** — `DEPLOY_MODE`, `SITE_URL`, `ASSET_PREFIX` (subdirectory mounts)

## URL scrape CLI

`npm run integrate -- --site https://yourproduct.com` writes:

- `integrations/chrome/.generated/brand.manifest.json` (logo, favicon, og:image, theme-color)
- A draft `site-chrome.ts` snippet (nav links are best-effort only)

Navbar/Footer **components** cannot be reliably imported from arbitrary URLs — override or monorepo share instead.

## Theme inference output

`npm run theme:infer -- --url https://yourproduct.com/blog` writes:

- `integrations/theme/.generated/inference.json` — matched preset and confidence (gitignored)

See [docs/theming.md](../docs/theming.md) for preset selection and `theme:sync`.
