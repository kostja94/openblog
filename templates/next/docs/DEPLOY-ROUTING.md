# Deploy routing (subdomain rewrites)

OpenBlog serves blog pages under the `/blog` App Router segment internally. In **subdomain** deploy mode, public URLs omit that prefix (`blog.yourproduct.com/post-slug` instead of `blog.yourproduct.com/blog/post-slug`). Edge routing rewrites incoming requests to the internal `/blog/*` paths.

---

## What `middleware.ts` does

File: [`src/middleware.ts`](../src/middleware.ts)

When `DEPLOY_MODE=subdomain`, the middleware rewrites public paths to internal routes:

| Public request | Internal rewrite |
|----------------|------------------|
| `/` | `/blog` |
| `/{slug}` | `/blog/{slug}` |
| `/category/{slug}` | `/blog/category/{slug}` |
| `/tag/{slug}` | `/blog/tag/{slug}` |
| `/author/{slug}` | `/blog/author/{slug}` |
| `/sitemap.xml` | `/blog/sitemap.xml` |
| `/rss.xml` | `/blog/rss.xml` |

Paths that already start with `/blog`, `/_next`, or `/api`, or contain a file extension (e.g. `.ico`), pass through unchanged.

The `config.matcher` limits which requests hit this logic (static assets and favicon are excluded).

---

## No-op in other deploy modes

If `DEPLOY_MODE` is **not** `subdomain` (i.e. `subdirectory` or `standalone`), the handler returns `NextResponse.next()` immediately — no rewrites run.

Subdirectory and standalone modes keep the `/blog` prefix in public URLs; routing is handled by App Router paths and `blogPath` helpers in `@openblog/core`, not by this file.

---

## Next.js 16+: `middleware.ts` → `proxy.ts`

Starting in **Next.js 16**, the `middleware` file convention is deprecated in favor of **`proxy`**:

| Before (Next.js ≤15, still supported in 16+) | After (Next.js 16+ preferred) |
|----------------------------------------------|-------------------------------|
| `src/middleware.ts` | `src/proxy.ts` |
| `export function middleware(request)` | `export function proxy(request)` |
| `export const config` | `export const config` (unchanged) |

Next.js 16.3+ may show a build warning that the middleware convention is deprecated. The runtime behavior is the same; only the filename and export name change.

**OpenBlog keeps `middleware.ts` in the template by default** so projects on Next.js 15 or earlier continue to work without changes. Both conventions are recognized by Next.js 16+ during the transition period — you do not need both files.

---

## When to migrate to `proxy.ts`

Migrate **only after** you upgrade your project to **Next.js 16+** and want to silence the deprecation warning.

From the `templates/next` directory (or your forked copy of it):

```bash
npx @next/codemod@canary middleware-to-proxy .
```

The codemod renames `middleware.ts` → `proxy.ts` and renames the exported function. Review the diff before committing.

**Do not migrate** if you are still on Next.js 15 or earlier — those versions only support `middleware.ts`.

---

## Compatibility summary

| Next.js version | File to use | Notes |
|-----------------|-------------|-------|
| ≤15 | `middleware.ts` only | `proxy.ts` is not supported |
| 16+ | Either works | Deprecation warning with `middleware.ts`; prefer `proxy.ts` for new work |
| OpenBlog template default | `middleware.ts` | Safe for all supported Next.js versions in the ecosystem |

If you maintain a fork or downstream app, choose the file name that matches your Next.js version. No routing logic changes are required — only the filename and export name.

---

## Related docs

- Subdomain integration checklist: [`integrations/patterns/subdomain.md`](../../../integrations/patterns/subdomain.md)
- Deploy modes overview: [README — Deployment modes](../../../README.md#deployment-modes)
