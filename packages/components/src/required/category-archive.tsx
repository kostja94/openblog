"use client";

import type { PostMeta } from "@openblog/core";

import { useSiteHelpers } from "../provider";
import { TaxonomyArchive } from "./taxonomy-archive";

export function CategoryArchive({
  categoryName,
  categorySlug,
  posts,
  description,
}: {
  categoryName: string;
  categorySlug: string;
  posts: PostMeta[];
  description?: string;
}) {
  const site = useSiteHelpers();

  return (
    <TaxonomyArchive
      name={categoryName}
      slug={categorySlug}
      posts={posts}
      description={description}
      defaultDescription={`${posts.length} article${posts.length === 1 ? "" : "s"} in this category.`}
      resolvePath={site.categoryPath}
    />
  );
}
