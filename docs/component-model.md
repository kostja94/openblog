# Component model

OpenBlog provides the runnable blog implementation; [Bricks](https://github.com/kostja94/bricks) provides framework-independent component guidance for AI agents. OpenBlog does not duplicate that guidance.

| OpenBlog implementation | Bricks concept |
|-------------------------|----------------|
| [`BlogIndex`](../packages/components/src/required/blog-index.tsx) | [Blog Index](https://github.com/kostja94/bricks/blob/main/skills/component-builder/references/components/blog-index.md) |
| [`ArticleLayout`](../packages/components/src/required/article-layout.tsx) | [Article Layout](https://github.com/kostja94/bricks/blob/main/skills/component-builder/references/components/article-layout.md) |
| Reusable required and optional components under [`packages/components`](../packages/components/src/) | [Bricks component catalog](https://github.com/kostja94/bricks/blob/main/catalog/components.json) |

OpenBlog currently uses Git, Markdown, and agent-assisted changes as its editing workflow. Bricks' [CMS Editor Workspace](https://github.com/kostja94/bricks/blob/main/skills/component-builder/references/components/cms-editor-workspace.md) describes a separate visual CMS pattern and is not an OpenBlog feature.
