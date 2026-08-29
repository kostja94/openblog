# Monorepo merge (blog routes inside existing Next.js app)

**When:** Your product is already Next.js App Router and you want one deploy artifact.

**Deploy mode:** Usually `subdirectory` or `standalone` depending on routing.

## Steps

1. Copy into your repo:
   - `packages/core`, `packages/content`, `packages/components`, `packages/themes`
   - `templates/next/content/blog/` → your `content/blog/`
   - Blog routes from `templates/next/src/app/blog/` → your `app/blog/`

2. Merge `openblog.config.ts` into your repo root (or import from a shared config package).

3. Set `chrome.mode: "inherit-monorepo"` and replace chrome:
   ```typescript
   // app/blog/layout.tsx
   import { SiteHeader, SiteFooter } from "@/components/marketing/layout";
   ```

4. Keep `@openblog/components` for article/list UI; **do not** duplicate blog chrome from packages.

5. Add workspace deps and `transpilePackages` in your existing `next.config.ts`.

## Do not

- Import OpenBlog's demo `SiteHeader` — use your product header so nav stays identical.

See: `templates/next/src/chrome/overrides/README.md`
