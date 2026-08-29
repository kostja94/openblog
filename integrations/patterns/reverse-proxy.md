# Reverse proxy and asset prefix

**When:** Blog Next app sits behind nginx/Cloudflare/AWS ALB and static assets break.

## Symptoms

- HTML loads but unstyled (CSS 404)
- `/_next/static/...` requests hit wrong origin

## Fix

```env
SITE_URL=https://yourproduct.com
DEPLOY_MODE=subdirectory
BLOG_BASE_PATH=/blog
ASSET_PREFIX=/blog
```

`ASSET_PREFIX` is passed to `next.config.ts` → `assetPrefix`.

## nginx sketch

```nginx
location /blog {
  proxy_pass http://openblog_upstream;
  proxy_set_header Host $host;
}
```

Ensure your CDN caches `/blog/_next/static/*` with long TTL.

## Canonical URLs

OpenBlog uses **no trailing slash**. Proxy rules should not redirect `/blog/post` → `/blog/post/`.
