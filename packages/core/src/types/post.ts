import { z } from "zod";

import type { ResolvedFeatures } from "../config/types";

export const postFrontmatterBaseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(80).max(320),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case"),
  date: z.string().min(1),
  updated: z.string().optional(),
  author: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  tags: z.array(z.string()).optional().default([]),
  draft: z.boolean().optional().default(false),
  /** Independent featured image URL (preferred for OG / list cards) */
  cover: z.union([z.string().url(), z.string().startsWith("/")]).optional(),
  /** Optional TL;DR block (40–320 chars). Falls back to ## TL;DR section in body */
  tldr: z.string().min(40).max(320).optional(),
});

export function createPostFrontmatterSchema(features: ResolvedFeatures) {
  return postFrontmatterBaseSchema.superRefine((data, ctx) => {
    if (features.categories && !data.category) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "category is required when features.categories is enabled",
        path: ["category"],
      });
    }

    if (features.authors && !data.author) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "author is required when features.authors is enabled",
        path: ["author"],
      });
    }
  });
}

const allFeaturesEnabled: ResolvedFeatures = {
  categories: true,
  tags: true,
  authors: true,
  rss: true,
};

/** Default schema with all features enabled (backward compatible). */
export const postFrontmatterSchema = createPostFrontmatterSchema(allFeaturesEnabled);

export type PostFrontmatter = z.infer<typeof postFrontmatterBaseSchema>;

export function validatePostFrontmatter(data: unknown, features: ResolvedFeatures) {
  return createPostFrontmatterSchema(features).safeParse(data);
}

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  author?: string;
  category?: string;
  categorySlug?: string;
  tags: string[];
  draft: boolean;
  readingMinutes: number;
  /** Explicit cover from frontmatter `cover` */
  cover?: string;
  /** Resolved image: frontmatter cover, else first body image */
  coverImage?: string;
  /** TL;DR text for optional summary block */
  tldr?: string;
}

export interface Post extends PostMeta {
  content: string;
}

export interface BlogIndexData {
  featured: PostMeta | null;
  latest: PostMeta[];
  byCategory: Record<string, PostMeta[]>;
  categories: { slug: string; name: string; count: number }[];
  articleCount: number;
}

export interface AdjacentPosts {
  prev: PostMeta | null;
  next: PostMeta | null;
}

export function categoryToSlug(category: string): string {
  return category
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function tagToSlug(tag: string): string {
  return categoryToSlug(tag);
}

export function authorToSlug(author: string): string {
  return categoryToSlug(author);
}
