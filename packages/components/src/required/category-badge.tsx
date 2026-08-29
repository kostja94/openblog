"use client";

import Link from "next/link";

import { categoryToSlug } from "@openblog/core";

import { useOpenBlog, useSiteHelpers } from "../provider";
import { obBorder, obHoverBorder, obHoverText, obText } from "../tokens";

export function CategoryBadge({ category }: { category: string }) {
  const { features } = useOpenBlog();
  const site = useSiteHelpers();

  if (!features.categories) {
    return null;
  }

  const slug = categoryToSlug(category);

  return (
    <Link
      href={site.categoryPath(slug)}
      className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${obBorder} ${obText} ${obHoverBorder} ${obHoverText}`}
    >
      {category}
    </Link>
  );
}
