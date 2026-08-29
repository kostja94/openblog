# OpenBlog — Next.js Template

Official OpenBlog template. Demo target: [openblog.ai/blog](https://openblog.ai/blog).

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000/blog](http://localhost:3000/blog).

## Deploy modes

| Mode | Example public URL | Env |
|------|-------------------|-----|
| **subdirectory** | `yourproduct.com/blog/post` | `DEPLOY_MODE=subdirectory` |
| **subdomain** | `blog.yourproduct.com/post` | `DEPLOY_MODE=subdomain` |
| **standalone** | `openblog.ai/blog/post` | `DEPLOY_MODE=standalone` |

Copy `.env.example` to `.env.local` and set `SITE_URL`.

## Canonical URLs

No trailing slash: `https://openblog.ai/blog/how-i-built-openblog-open-source-blog-module`

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development |
| `npm run validate:posts` | Zod frontmatter validation |
| `npm run build` | Production SSG build |

## Content

Posts live in `content/blog/*.md`. See `../AGENTS.md` at repo root.
