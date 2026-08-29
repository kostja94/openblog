import {
  formatPostDate,
  getPostExcerpt,
  extractLeadParagraph,
  extractToc,
} from "@openblog/core";

import { content, CONTENT_DIR } from "@/lib/content";
import { postPath } from "@/config/site";

export function getAllPosts(includeDrafts = false) {
  return content.listPosts(includeDrafts);
}

export function getPostBySlug(slug: string, includeDrafts = false) {
  return content.getPost(slug, includeDrafts);
}

export function getBlogIndexData() {
  return content.getBlogIndexData();
}

export function getPostsByCategory(categorySlug: string) {
  return content.getPostsByCategory(categorySlug);
}

export function getPostsByTag(tagSlug: string) {
  return content.getPostsByTag(tagSlug);
}

export function getPostsByAuthor(authorSlug: string) {
  return content.getPostsByAuthor(authorSlug);
}

export function getRelatedPosts(
  post: Parameters<typeof content.getRelatedPosts>[0],
  limit = 3,
) {
  return content.getRelatedPosts(post, limit);
}

export function getAdjacentPosts(slug: string) {
  return content.getAdjacentPosts(slug);
}

export {
  formatPostDate,
  getPostExcerpt,
  extractLeadParagraph,
  extractToc,
  CONTENT_DIR,
};

export { postPath as getPostPath };
