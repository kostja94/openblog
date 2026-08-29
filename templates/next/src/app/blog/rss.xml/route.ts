import { buildRssFeed, resolveFeatures } from "@openblog/core";

import { getAllPosts } from "@/lib/posts";
import { config, siteHelpers } from "@/lib/openblog-config";

const features = resolveFeatures(config);

export const dynamic = "force-static";

export async function GET() {
  if (!features.rss) {
    return new Response("Not Found", { status: 404 });
  }

  const posts = getAllPosts();
  const xml = buildRssFeed(posts, siteHelpers);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
