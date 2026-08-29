# OpenBlog optional features

Categories, tags, authors, and RSS are **optional** — not every blog needs them. Control everything from the `features` block in `openblog.config.ts`. Routes, validation, SEO, and UI stay in sync when you toggle a feature off.

## Configuration

```ts
features: {
  categories: true, // category archive routes + badges/links on posts and lists
  tags: true,       // tag archive routes + tagsList component enabled by default
  authors: true,    // author archive routes + author UI in post-meta / authorBox
  rss: true,        // /blog/rss.xml feed
},
```

**Defaults: all `true`**, matching legacy behavior. Omit the `features` block to enable everything.

## `features` vs `components.optional`

| Layer | Purpose | Example |
|-------|---------|---------|
| **`features`** | Site-level switches: routes, frontmatter validation, SEO, sitemap, RSS | `features.tags: false` → no `/blog/tag/[slug]`; tag URLs omitted from sitemap |
| **`components.optional`** | Post-page UI toggles (when the feature is enabled) | `optional.toc: true` → show table of contents |

**Coupling rules:**

- `features.tags === false` → `tagsList` forced off, even if `components.optional.tagsList: true`
- `features.authors === false` → `authorBox` forced off; `post-meta` hides author name

Other optional components (`toc`, `shareBar`, `relatedPosts`, etc.) are not gated by `features`.

## Behavior when a feature is disabled

### `categories: false`

- Route `/blog/category/[slug]` returns 404
- Frontmatter `category` becomes optional
- Sitemap excludes category archive URLs
- Breadcrumbs, CategoryBadge, and list-card category links hidden
- Blog home Categories section hidden

### `tags: false`

- Route `/blog/tag/[slug]` returns 404
- Sitemap excludes tag archive URLs
- TagsList never renders (regardless of optional config)

### `authors: false`

- Route `/blog/author/[slug]` returns 404
- Frontmatter `author` becomes optional
- Sitemap excludes author archive URLs
- JSON-LD / RSS omit author fields
- PostMetaRow and AuthorBox hide author

### `rss: false`

- `/blog/rss.xml` returns 404
- Sitemap and robots unchanged (still point at sitemap.xml)

## Frontmatter validation

`npm run validate:posts` reads config and calls `resolveFeatures`:

- `features.categories: true` → every post must have `category`
- `features.authors: true` → every post must have `author`
- When the feature is off, the field may be omitted

## Runtime access

`OpenBlogProvider` exposes `features: ResolvedFeatures` — use `useOpenBlog().features` in components.

`SiteRuntime.features` feeds SEO helpers (sitemap, JSON-LD, breadcrumbs).

## Minimal blog example

Posts + single-post reading only — no categories, tags, authors, or RSS:

```ts
features: {
  categories: false,
  tags: false,
  authors: false,
  rss: false,
},
```

Frontmatter can stay minimal: `title`, `description`, `slug`, `date`, etc.

## Optional components (`components.optional`)

Unlike `features`, `components.optional` only toggles post-page UI — not routes or validation.

Example — `xEmbed`: when `true`, a standalone X/Twitter status URL line in Markdown renders as an official widgets.js embed; on failure, a fallback “View post on X” link appears. Default `false`. See [AGENTS.md](../AGENTS.md#x-twitter-embeds).
