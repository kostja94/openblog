# Subdomain (`blog.yourproduct.com`)

**When:** Blog is isolated on its own host but should feel like the same brand.

**Deploy mode:** `DEPLOY_MODE=subdomain`

## Steps

1. `openblog.config.ts`:
   ```typescript
   site: { url: "https://blog.yourproduct.com" },
   chrome: {
     siteUrl: "https://yourproduct.com",
     homeUrl: "https://yourproduct.com",
     logo: "https://cdn.yourproduct.com/logo.svg",
   },
   ```

2. `.env.local`:
   ```env
   SITE_URL=https://blog.yourproduct.com
   DEPLOY_MODE=subdomain
   ```

3. Public blog URLs become `https://blog.yourproduct.com/{slug}` (no `/blog` prefix).

4. Header logo links to **product home** (`homeUrl`), not blog index — readers can return to the main site.

5. Nav links to Product/Docs should use **absolute URLs** to `yourproduct.com` with `external: true`.

## Edge routing (middleware / proxy)

OpenBlog template includes subdomain URL rewrites in `templates/next/src/middleware.ts`. When `DEPLOY_MODE=subdomain`, it maps public paths like `/{slug}` to internal `/blog/{slug}` routes. In `subdirectory` or `standalone` mode the handler is a no-op.

**Next.js 16+ note:** Next.js renamed the convention from `middleware.ts` to `proxy.ts` (export `proxy` instead of `middleware`). The OpenBlog template **keeps `middleware.ts` by default** for compatibility with Next.js 15 and earlier. After upgrading to Next.js 16+, you can run `npx @next/codemod@canary middleware-to-proxy .` in your template copy to migrate — see the full routing reference:

→ **[templates/next/docs/DEPLOY-ROUTING.md](../../templates/next/docs/DEPLOY-ROUTING.md)**

Verify rewrites against your host setup (DNS, TLS, and any upstream reverse proxy).
