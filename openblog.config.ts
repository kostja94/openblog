import { defineConfig } from "@openblog/core";

const config = defineConfig({
  site: {
    name: "Open Blog",
    tagline: "Open source CMS for blogs",
    description:
      "OpenBlog is an open-source, Git-based blog module for product websites — Markdown in Git, Agent Skills, and SEO built in.",
    github: "https://github.com/kostja94/openblog",
    locale: "en-US",
    url: "https://openblog.ai",
  },

  chrome: {
    mode: "openblog-default",
    siteUrl: "https://openblog.ai",
    homeUrl: "https://openblog.ai",
    logo: "/brand/openblog-logo.svg",
    logoAlt: "Open Blog",
  },

  /**
   * Theme preset (six-axis) or referenceUrl for inference.
   * Run: npm run theme:infer -- --url https://yourproduct.com/blog
   * Then: npm run theme:sync
   */
  theme: {
    preset: "vercel-geist",
    // referenceUrl: "https://vercel.com/blog",
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
