export function formatSiteName(dirName: string): string {
  return dirName
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function generateOpenBlogConfig(options: {
  siteName: string;
  preset: string;
}): string {
  const { siteName, preset } = options;

  return `import { defineConfig } from "@openblog/core";

const config = defineConfig({
  site: {
    name: ${JSON.stringify(siteName)},
    tagline: "A Git-based blog powered by OpenBlog",
    description:
      "An open-source blog built with OpenBlog — Markdown in Git, SEO built in, and agent-ready.",
    locale: "en-US",
    url: "http://localhost:3000",
  },

  chrome: {
    mode: "openblog-default",
    siteUrl: "http://localhost:3000",
    homeUrl: "http://localhost:3000",
    logoAlt: ${JSON.stringify(siteName)},
  },

  theme: {
    preset: ${JSON.stringify(preset)},
    colorMode: "system",
    strategy: "hybrid",
  },

  content: {
    adapter: "local-md",
    options: {
      dir: "content/blog",
    },
  },

  features: {
    categories: true,
    tags: true,
    authors: true,
    rss: true,
  },

  components: {
    required: [
      "breadcrumbs",
      "post-title",
      "post-meta",
      "post-dek",
      "featured-image",
      "markdown",
    ],
    optional: {
      toc: false,
      relatedPosts: true,
      shareBar: true,
      tagsList: true,
      tldr: true,
      xEmbed: false,
      authorBox: false,
      prevNext: false,
    },
  },
});

export default config;
`;
}
