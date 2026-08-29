import { describe, expect, it } from "vitest";

import type { ResolvedFeatures } from "../config/types";
import type { PostMeta } from "../types/post";
import type { SiteHelpers } from "../site/context";
import { buildSitemapXml } from "./index";

function createMockSite(
  features: Partial<ResolvedFeatures> = {},
  baseUrl = "https://example.com",
): SiteHelpers {
  const runtime = {
    site: {
      name: "Test Blog",
      description: "Test description for the blog sitemap tests.",
      locale: "en-US",
    },
    deployMode: "standalone" as const,
    siteUrl: baseUrl,
    blogBasePath: "/blog",
    features: {
      categories: true,
      tags: true,
      authors: true,
      rss: true,
      ...features,
    },
  };

  return {
    runtime,
    blogPath: (...segments: string[]) => {
      const parts = ["/blog", ...segments].filter(Boolean);
      return parts.join("/").replace(/\/+/g, "/") || "/";
    },
    postPath: (slug: string) => `/blog/${slug}`,
    categoryPath: (slug: string) => `/blog/category/${slug}`,
    tagPath: (slug: string) => `/blog/tag/${slug}`,
    authorPath: (slug: string) => `/blog/author/${slug}`,
    absoluteUrl: (path: string) => {
      if (path === "/" || path === "") {
        return baseUrl;
      }
      const normalized = path.startsWith("/") ? path : `/${path}`;
      return `${baseUrl}${normalized}`;
    },
    blogIndexUrl: () => `${baseUrl}/blog`,
    isSubdomainMode: () => false,
    isStandaloneMode: () => true,
    isSubdirectoryMode: () => false,
  };
}

function createPost(overrides: Partial<PostMeta> = {}): PostMeta {
  return {
    slug: "hello-world",
    title: "Hello World",
    description:
      "A sample post description that is long enough to satisfy frontmatter validation requirements for SEO.",
    date: "2024-01-15",
    author: "Test Author",
    category: "Guides",
    categorySlug: "guides",
    tags: [],
    draft: false,
    readingMinutes: 3,
    ...overrides,
  };
}

describe("buildSitemapXml", () => {
  it("includes post URLs with lastmod from updated or date", () => {
    const site = createMockSite();
    const posts = [
      createPost({
        slug: "first-post",
        date: "2024-01-10",
        updated: "2024-02-01",
      }),
      createPost({
        slug: "second-post",
        date: "2024-03-20",
        categorySlug: "news",
        category: "News",
      }),
    ];

    const xml = buildSitemapXml(posts, site);

    expect(xml).toContain("<loc>https://example.com/blog/first-post</loc>");
    expect(xml).toContain("<lastmod>2024-02-01</lastmod>");
    expect(xml).toContain("<loc>https://example.com/blog/second-post</loc>");
    expect(xml).toContain("<lastmod>2024-03-20</lastmod>");
  });

  it("includes category URLs when features.categories is enabled", () => {
    const site = createMockSite({ categories: true });
    const posts = [
      createPost({ categorySlug: "guides", category: "Guides" }),
      createPost({
        slug: "release-notes",
        categorySlug: "news",
        category: "News",
      }),
    ];

    const xml = buildSitemapXml(posts, site);

    expect(xml).toContain("<loc>https://example.com/blog/category/guides</loc>");
    expect(xml).toContain("<loc>https://example.com/blog/category/news</loc>");
  });

  it("excludes category URLs when features.categories is disabled", () => {
    const site = createMockSite({ categories: false });
    const posts = [
      createPost({ categorySlug: "guides", category: "Guides" }),
      createPost({
        slug: "release-notes",
        categorySlug: "news",
        category: "News",
      }),
    ];

    const xml = buildSitemapXml(posts, site);

    expect(xml).toContain("<loc>https://example.com/blog/hello-world</loc>");
    expect(xml).not.toContain("/blog/category/");
  });
});
