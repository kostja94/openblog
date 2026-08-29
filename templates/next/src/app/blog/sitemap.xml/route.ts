import { buildSitemapXml } from "@openblog/core";

import { getAllPosts } from "@/lib/posts";
import { siteHelpers } from "@/lib/openblog-config";

export async function GET() {
  const posts = getAllPosts();
  const xml = buildSitemapXml(posts, siteHelpers);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
