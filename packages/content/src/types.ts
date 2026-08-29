import type { AdjacentPosts, BlogIndexData, Post, PostMeta } from "@openblog/core";
import { tagToSlug } from "@openblog/core";

export interface ContentAdapter {
  listPosts(includeDrafts?: boolean): Post[];
  getPost(slug: string, includeDrafts?: boolean): Post | undefined;
}

export function toMeta(post: Post): PostMeta {
  const { content: _content, ...meta } = post;
  return meta;
}

export function getBlogIndexData(adapter: ContentAdapter): BlogIndexData {
  const posts = adapter.listPosts().map(toMeta);
  const featured = posts[0] ?? null;
  const latest = posts.slice(0, 6);
  const byCategory: Record<string, PostMeta[]> = {};

  for (const post of posts) {
    if (!post.categorySlug) {
      continue;
    }
    if (!byCategory[post.categorySlug]) {
      byCategory[post.categorySlug] = [];
    }
    byCategory[post.categorySlug]!.push(post);
  }

  const categories = Object.entries(byCategory)
    .map(([slug, items]) => ({
      slug,
      name: items[0]?.category ?? slug,
      count: items.length,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    featured,
    latest,
    byCategory,
    categories,
    articleCount: posts.length,
  };
}

export function getPostsByCategory(
  adapter: ContentAdapter,
  categorySlug: string,
): PostMeta[] {
  return adapter
    .listPosts()
    .map(toMeta)
    .filter((post) => post.categorySlug === categorySlug);
}

export function getPostsByTag(
  adapter: ContentAdapter,
  tagSlug: string,
): PostMeta[] {
  return adapter
    .listPosts()
    .map(toMeta)
    .filter((post) => post.tags.some((tag) => tagToSlug(tag) === tagSlug));
}

export function getPostsByAuthor(
  adapter: ContentAdapter,
  authorSlug: string,
): PostMeta[] {
  return adapter
    .listPosts()
    .map(toMeta)
    .filter((post) => post.author && tagToSlug(post.author) === authorSlug);
}

export function getRelatedPosts(
  adapter: ContentAdapter,
  post: PostMeta,
  limit = 3,
): PostMeta[] {
  const postTagSlugs = new Set(post.tags.map(tagToSlug));

  return adapter
    .listPosts()
    .map(toMeta)
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => {
      let score = 0;
      if (
        post.categorySlug &&
        candidate.categorySlug &&
        candidate.categorySlug === post.categorySlug
      ) {
        score += 10;
      }
      for (const tag of candidate.tags) {
        if (postTagSlugs.has(tagToSlug(tag))) {
          score += 1;
        }
      }
      return { candidate, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.candidate.date.localeCompare(a.candidate.date);
    })
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

/** Chronological neighbors in publish order (prev = older, next = newer) */
export function getAdjacentPosts(
  adapter: ContentAdapter,
  slug: string,
): AdjacentPosts {
  const posts = adapter.listPosts().map(toMeta);
  const index = posts.findIndex((post) => post.slug === slug);

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: posts[index + 1] ?? null,
    next: posts[index - 1] ?? null,
  };
}

export interface ContentService {
  adapter: ContentAdapter;
  listPosts: ContentAdapter["listPosts"];
  getPost: ContentAdapter["getPost"];
  getBlogIndexData: () => BlogIndexData;
  getPostsByCategory: (categorySlug: string) => PostMeta[];
  getPostsByTag: (tagSlug: string) => PostMeta[];
  getPostsByAuthor: (authorSlug: string) => PostMeta[];
  getRelatedPosts: (post: PostMeta, limit?: number) => PostMeta[];
  getAdjacentPosts: (slug: string) => AdjacentPosts;
}

export function createContentService(adapter: ContentAdapter): ContentService {
  return {
    adapter,
    listPosts: (includeDrafts) => adapter.listPosts(includeDrafts),
    getPost: (slug, includeDrafts) => adapter.getPost(slug, includeDrafts),
    getBlogIndexData: () => getBlogIndexData(adapter),
    getPostsByCategory: (categorySlug) => getPostsByCategory(adapter, categorySlug),
    getPostsByTag: (tagSlug) => getPostsByTag(adapter, tagSlug),
    getPostsByAuthor: (authorSlug) => getPostsByAuthor(adapter, authorSlug),
    getRelatedPosts: (post, limit) => getRelatedPosts(adapter, post, limit),
    getAdjacentPosts: (slug) => getAdjacentPosts(adapter, slug),
  };
}
