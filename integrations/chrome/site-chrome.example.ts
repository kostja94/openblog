/**
 * Example: map integrations/chrome/brand.manifest.example.json → openblog.config.ts
 *
 * Copy relevant fields into openblog.config.ts `chrome` block.
 * Nav/footer can also live entirely in site-chrome.ts (see templates/next/src/chrome/).
 */
import type { OpenBlogChromeNavLink } from "@openblog/core";

export const exampleNav: OpenBlogChromeNavLink[] = [
  { label: "Product", href: "https://yourproduct.com", external: true },
  { label: "Docs", href: "https://yourproduct.com/docs", external: true },
  { label: "Blog", href: "/blog", match: "blog" },
];

// In openblog.config.ts:
// chrome: {
//   mode: "custom",
//   siteUrl: "https://yourproduct.com",
//   homeUrl: "https://yourproduct.com",
//   logo: "/brand/logo.svg",
//   logoAlt: "Your Product",
//   nav: exampleNav,
// }
