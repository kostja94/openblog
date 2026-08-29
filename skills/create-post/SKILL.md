---
name: create-post
description: Add an OpenBlog Markdown post with valid frontmatter and structure when the user provides body or brief. Use when drafting or adding a blog article — not autonomous content generation.
---

# Create Post

**Guardrail:** The user provides the article body, outline, or brief. This skill ensures valid frontmatter, filename/slug alignment, and Markdown structure — it is **not** an autonomous article factory.

For content strategy, keyword targeting, GEO, or post optimization → use **marketing-skills**.

## Steps

1. Read `AGENTS.md` and inspect existing posts in `content/blog/`.
2. Confirm the user supplied content or a clear brief; do not invent long-form copy without input.
3. Choose a unique kebab-case `slug` matching the filename.
4. Write frontmatter that passes `postFrontmatterSchema` (description 80–320 chars).
5. Write Markdown body with:
   - One `#` title (optional; stripped if duplicate of frontmatter title)
   - `##` sections for structure
   - Internal links to other posts using `/blog/{slug}` paths
6. Run `npm run validate:posts` in `templates/next`.

Create the file at `templates/next/content/blog/{slug}.md`.

## Frontmatter template

```yaml
---
title: ""
description: ""
slug: ""
date: "YYYY-MM-DD"
author: "Open Blog Team"
category: ""
tags: []
draft: false
---
```

## Related skills

- **Pre-publish SEO checks?** `validate-blog-seo`
- **Ready to merge?** `publish`
