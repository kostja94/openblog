---
title: OpenBlog Agent contract implementations
description: Generated index of the Pagina page contracts and Bricks component contracts implemented by OpenBlog.
type: reference
date: 2026-08-29
updated: 2026-09-25
version: 1.0.0
---

# OpenBlog Agent contract implementations

This file is generated from [`integrations/agent-contracts.json`](../integrations/agent-contracts.json). Edit the manifest and run `npm run contracts:generate`; do not maintain mappings here.

Pagina owns page responsibilities and page-to-component recommendations. Bricks owns component responsibilities. OpenBlog owns only the declaration of which contracts its runnable CMS implements.

## Pagina page contracts

| OpenBlog implementation | Contract ID | Contract owner |
|---|---|---|
| [`templates/next/src/app/blog/page.tsx`](../templates/next/src/app/blog/page.tsx) | `blog-index` | [Blog Index](https://github.com/kostja94/pagina/blob/main/catalog/pages.json) |
| [`templates/next/src/app/blog/[slug]/page.tsx`](../templates/next/src/app/blog/[slug]/page.tsx) | `article` | [Article Page](https://github.com/kostja94/pagina/blob/main/catalog/pages.json) |

## Bricks component contracts

| OpenBlog implementation | Contract ID | Contract owner |
|---|---|---|
| [`packages/components/src/required/blog-index.tsx`](../packages/components/src/required/blog-index.tsx) | `blog-index` | [Blog Index](https://github.com/kostja94/bricks/blob/main/catalog/components.json) |
| [`packages/components/src/required/article-layout.tsx`](../packages/components/src/required/article-layout.tsx) | `article-layout` | [Article Layout](https://github.com/kostja94/bricks/blob/main/catalog/components.json) |
| [`packages/components/src/required/breadcrumbs.tsx`](../packages/components/src/required/breadcrumbs.tsx) | `breadcrumb` | [Breadcrumb](https://github.com/kostja94/bricks/blob/main/catalog/components.json) |
| [`packages/components/src/optional/author-box.tsx`](../packages/components/src/optional/author-box.tsx) | `author-bio` | [Author Bio](https://github.com/kostja94/bricks/blob/main/catalog/components.json) |
| [`packages/components/src/optional/toc.tsx`](../packages/components/src/optional/toc.tsx) | `table-of-contents` | [Table of Contents](https://github.com/kostja94/bricks/blob/main/catalog/components.json) |
| [`packages/components/src/optional/share-bar.tsx`](../packages/components/src/optional/share-bar.tsx) | `social-share` | [Social Share](https://github.com/kostja94/bricks/blob/main/catalog/components.json) |

## Boundary

These are design-time Agent contracts, not runtime package dependencies. OpenBlog remains independently installable and does not duplicate Pagina or Bricks guidance. Contextus is intentionally outside this integration.
