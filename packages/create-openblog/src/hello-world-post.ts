export function generateHelloWorldPost(siteName: string): string {
  const slug = "hello-world";
  const today = new Date().toISOString().slice(0, 10);

  return `---
title: "Hello, ${siteName}"
description: "Welcome to your new OpenBlog site. Edit this post in content/blog/hello-world.md, add more Markdown files, and run npm run dev to preview locally."
slug: "${slug}"
date: "${today}"
updated: "${today}"
author: "you"
category: "getting-started"
tags: ["openblog", "hello-world"]
draft: false
---

# Hello, ${siteName}

Your OpenBlog site is ready.

## Next steps

1. Edit \`openblog.config.ts\` — site name, theme preset, and optional features.
2. Add posts under \`content/blog/*.md\`.
3. Run \`npm run validate:posts\` before merge/deploy.

Happy writing.
`;
}
