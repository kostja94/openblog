"use client";

import type { PostMeta } from "@openblog/core";

import { useSiteHelpers } from "../provider";
import { TaxonomyArchive } from "./taxonomy-archive";

export function TagArchive({
  tagName,
  tagSlug,
  posts,
  description,
}: {
  tagName: string;
  tagSlug: string;
  posts: PostMeta[];
  description?: string;
}) {
  const site = useSiteHelpers();

  return (
    <TaxonomyArchive
      name={tagName}
      slug={tagSlug}
      posts={posts}
      description={description}
      defaultDescription={`${posts.length} article${posts.length === 1 ? "" : "s"} tagged with ${tagName}.`}
      resolvePath={site.tagPath}
    />
  );
}
