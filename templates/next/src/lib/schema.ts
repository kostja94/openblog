import type { Post, PostMeta } from "@openblog/core";
import {
  buildBlogPostingJsonLd,
  buildBreadcrumbJsonLd,
  getArticleBreadcrumbItems,
  getCategoryBreadcrumbItems,
} from "@openblog/core";

import { siteHelpers } from "@/lib/openblog-config";

export function buildBlogPostingJsonLdForPost(post: Post | PostMeta) {
  return buildBlogPostingJsonLd(post, siteHelpers);
}

export function buildBreadcrumbJsonLdForItems(items: { name: string; path: string }[]) {
  return buildBreadcrumbJsonLd(items, siteHelpers);
}

export function getArticleBreadcrumbItemsForPost(
  postTitle: string,
  slug: string,
  categoryName?: string,
  categorySlug?: string,
) {
  return getArticleBreadcrumbItems(
    postTitle,
    slug,
    categoryName,
    categorySlug,
    siteHelpers,
  );
}

export function getCategoryBreadcrumbItemsForCategory(
  categoryName: string,
  categorySlug: string,
) {
  return getCategoryBreadcrumbItems(categoryName, categorySlug, siteHelpers);
}

export {
  buildBlogPostingJsonLdForPost as buildBlogPostingJsonLd,
  buildBreadcrumbJsonLdForItems as buildBreadcrumbJsonLd,
  getArticleBreadcrumbItemsForPost as getArticleBreadcrumbItems,
  getCategoryBreadcrumbItemsForCategory as getCategoryBreadcrumbItems,
};
