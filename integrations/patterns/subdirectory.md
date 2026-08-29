# Subdirectory mount (`yourproduct.com/blog`)

**When:** Blog is a module on an existing marketing site (most common).

**Deploy mode:** `DEPLOY_MODE=subdirectory`

## Steps

1. Set in `openblog.config.ts`:
   ```typescript
   site: { url: "https://yourproduct.com" },
   chrome: {
     mode: "custom",
     siteUrl: "https://yourproduct.com",
     homeUrl: "https://yourproduct.com",
     logo: "/brand/logo.svg",
   },
   ```

2. Copy `.env.local`:
   ```env
   SITE_URL=https://yourproduct.com
   DEPLOY_MODE=subdirectory
   BLOG_BASE_PATH=/blog
   ```

3. If `/_next/static` 404s behind your main domain reverse proxy:
   ```env
   ASSET_PREFIX=/blog
   ```

4. Edit `templates/next/src/chrome/site-chrome.ts` so header links match your main site (Product, Docs, Pricing…).

5. Deploy the Next app; route `/blog/*` to this app (Vercel path, nginx location, Cloudflare worker, etc.).

## Do not

- Expect OpenBlog to render your marketing homepage — only blog routes.
- Scrape navbar HTML from your site URL — copy links manually or share React components via monorepo.

See also: [reverse-proxy.md](./reverse-proxy.md)
