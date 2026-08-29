# OpenBlog Agent Skills

Agent skills for **[OpenBlog](https://github.com/kostja94/openblog)** — Git-based blog CMS module for product sites.

[![skills.sh](https://skills.sh/b/kostja94/openblog)](https://skills.sh/kostja94/openblog)

## Quick install

```bash
# Recommended — entry + primary workflows
npx skills add kostja94/openblog --skill blog-cms integrate-product-site setup-blog-module

# Entry skill only
npx skills add kostja94/openblog --skill blog-cms

# All skills
npx skills add kostja94/openblog --skill '*'

# List available
npx skills add kostja94/openblog --list
```

Works with Cursor, Claude Code, Codex, Windsurf, and [70+ agents](https://github.com/vercel-labs/skills#supported-agents) via the [skills CLI](https://skills.sh/docs).

## Skills

| Skill | Role |
|-------|------|
| **[blog-cms](./blog-cms/SKILL.md)** | **Entry** — route integrate vs scaffold; install starting point for [skills.sh](https://skills.sh) |
| [integrate-product-site](./integrate-product-site/SKILL.md) | **Primary** — mount `/blog` on existing product site |
| [setup-blog-module](./setup-blog-module/SKILL.md) | **Primary** — greenfield `create-openblog` |
| [create-post](./create-post/SKILL.md) | Optional — add post when user provides content |
| [validate-blog-seo](./validate-blog-seo/SKILL.md) | Optional — blog-path SEO validation |
| [publish](./publish/SKILL.md) | Optional — merge/deploy checklist |
| [audit-seo](./audit-seo/SKILL.md) | Legacy → `validate-blog-seo` |

## Pair with marketing-skills

OpenBlog covers **blog module SEO primitives**. Site-wide SEO, GEO, and keyword strategy: **[marketing-skills](https://github.com/kostja94/marketing-skills)**.

## Spec

Skills follow the [Agent Skills specification](https://agentskills.io/specification): `skill-name/SKILL.md` with YAML `name` + `description` frontmatter. Discovered from repo `skills/` by `npx skills add`.
