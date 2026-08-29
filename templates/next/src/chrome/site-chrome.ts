import type { OpenBlogChromeNavLink } from "@openblog/core";

import { config } from "@/lib/openblog-config";
import { blogPath, site } from "@/config/site";

export type SiteNavLink = OpenBlogChromeNavLink;

export type SiteFooterColumn = {
  title: string;
  links: SiteNavLink[];
};

export { resolveChromeBrand } from "@openblog/core";
export { config as openblogConfig };

const DEFAULT_PRODUCT_HOME = "https://openblog.ai";

function getProductHome(): string {
  return config.chrome?.siteUrl ?? config.chrome?.homeUrl ?? DEFAULT_PRODUCT_HOME;
}

function defaultHeaderLinks(): SiteNavLink[] {
  const productHome = getProductHome();
  return [
    { label: "Product", href: productHome, external: true },
    { label: "Docs", href: `${site.github}#readme`, external: true },
    { label: "Blog", href: blogPath(), match: "blog" },
    { label: "GitHub", href: site.github, external: true },
  ];
}

function defaultFooterColumns(): SiteFooterColumn[] {
  return [
    {
      title: "OpenBlog",
      links: [
        { label: "Blog", href: blogPath(), match: "blog" },
        {
          label: "Origin story",
          href: blogPath("how-i-built-openblog-open-source-blog-module"),
          match: "exact",
        },
        { label: "GitHub", href: site.github, external: true },
      ],
    },
  ];
}

function defaultFooterLegalLinks(): SiteNavLink[] {
  return [
    {
      label: "MIT License",
      href: `${site.github}/blob/main/LICENSE`,
      external: true,
    },
  ];
}

/** Header nav — config.chrome.nav overrides defaults */
export const headerLinks: SiteNavLink[] =
  config.chrome?.nav ?? defaultHeaderLinks();

/** Footer columns — config.chrome.footer.columns overrides defaults */
export const footerColumns: SiteFooterColumn[] =
  config.chrome?.footer?.columns ?? defaultFooterColumns();

/** Footer legal links — config.chrome.footer.legal overrides defaults */
export const footerLegalLinks: SiteNavLink[] =
  config.chrome?.footer?.legal ?? defaultFooterLegalLinks();

/** @deprecated Use config.chrome.siteUrl */
export const PRODUCT_HOME = getProductHome();
