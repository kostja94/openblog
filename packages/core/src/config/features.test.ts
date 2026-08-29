import { describe, expect, it } from "vitest";

import type { OpenBlogConfig } from "./types";
import { resolveFeatures, resolveOptionalComponents } from "./types";

const minimalConfig = (): OpenBlogConfig => ({
  site: {
    name: "Test",
    description: "Test site",
    locale: "en-US",
    url: "https://example.com",
  },
  content: {
    adapter: "local-md",
    options: { dir: "content/blog" },
  },
  theme: "minimal",
});

describe("resolveFeatures", () => {
  it("defaults all feature flags to true when omitted", () => {
    expect(resolveFeatures(minimalConfig())).toEqual({
      categories: true,
      tags: true,
      authors: true,
      rss: true,
    });
  });

  it("respects explicit feature overrides", () => {
    expect(
      resolveFeatures({
        ...minimalConfig(),
        features: {
          categories: false,
          tags: false,
          authors: false,
          rss: false,
        },
      }),
    ).toEqual({
      categories: false,
      tags: false,
      authors: false,
      rss: false,
    });
  });
});

describe("resolveOptionalComponents", () => {
  it("gates tagsList when features.tags is false", () => {
    const resolved = resolveOptionalComponents({
      ...minimalConfig(),
      features: { tags: false },
      components: {
        optional: { tagsList: true },
      },
    });

    expect(resolved.tagsList).toBe(false);
  });

  it("gates authorBox when features.authors is false", () => {
    const resolved = resolveOptionalComponents({
      ...minimalConfig(),
      features: { authors: false },
      components: {
        optional: { authorBox: true },
      },
    });

    expect(resolved.authorBox).toBe(false);
  });

  it("allows tagsList and authorBox when features are enabled", () => {
    const resolved = resolveOptionalComponents({
      ...minimalConfig(),
      features: { tags: true, authors: true },
      components: {
        optional: { tagsList: true, authorBox: true },
      },
    });

    expect(resolved.tagsList).toBe(true);
    expect(resolved.authorBox).toBe(true);
  });
});
