import type { MetadataRoute } from "next";

import { siteHelpers } from "@/lib/openblog-config";

export default function robots(): MetadataRoute.Robots {
  const sitemapPath = siteHelpers.isSubdomainMode()
    ? "/sitemap.xml"
    : `${siteHelpers.blogPath().replace(/\/$/, "")}/sitemap.xml`;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: siteHelpers.absoluteUrl(sitemapPath),
  };
}
