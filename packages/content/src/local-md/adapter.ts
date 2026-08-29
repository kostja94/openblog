import fs from "fs";
import path from "path";

import matter from "gray-matter";

import {
  categoryToSlug,
  createPostFrontmatterSchema,
  extractCoverImage,
  extractTldrFromContent,
  getReadingMinutes,
  stripDuplicateH1,
  type Post,
  type ResolvedFeatures,
} from "@openblog/core";

import type { ContentAdapter } from "../types";

const ALL_FEATURES_ENABLED: ResolvedFeatures = {
  categories: true,
  tags: true,
  authors: true,
  rss: true,
};

export interface LocalMdAdapterOptions {
  /** Absolute path to the content directory */
  contentDir: string;
  features?: ResolvedFeatures;
}

function parseFile(filePath: string, features: ResolvedFeatures): Post {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const parsed = createPostFrontmatterSchema(features).parse(data);
  const slugFromFile = path.basename(filePath, ".md");

  if (parsed.slug !== slugFromFile) {
    throw new Error(
      `Slug mismatch in ${filePath}: frontmatter "${parsed.slug}" vs filename "${slugFromFile}"`,
    );
  }

  const body = stripDuplicateH1(content, parsed.title);
  const coverImage = parsed.cover ?? extractCoverImage(body);
  const tldr = parsed.tldr ?? extractTldrFromContent(body) ?? undefined;

  return {
    slug: parsed.slug,
    title: parsed.title,
    description: parsed.description,
    date: parsed.date,
    updated: parsed.updated,
    author: parsed.author,
    category: parsed.category,
    categorySlug: parsed.category ? categoryToSlug(parsed.category) : undefined,
    tags: parsed.tags ?? [],
    draft: parsed.draft ?? false,
    readingMinutes: getReadingMinutes(body),
    cover: parsed.cover,
    coverImage,
    tldr,
    content: body,
  };
}

export function createLocalMdAdapter(options: LocalMdAdapterOptions): ContentAdapter {
  const { contentDir, features = ALL_FEATURES_ENABLED } = options;

  return {
    listPosts(includeDrafts = false): Post[] {
      if (!fs.existsSync(contentDir)) {
        return [];
      }

      return fs
        .readdirSync(contentDir)
        .filter((file) => file.endsWith(".md"))
        .map((file) => parseFile(path.join(contentDir, file), features))
        .filter((post) => includeDrafts || !post.draft)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },

    getPost(slug: string, includeDrafts = false): Post | undefined {
      const filePath = path.join(contentDir, `${slug}.md`);
      if (!fs.existsSync(filePath)) {
        return undefined;
      }

      const post = parseFile(filePath, features);
      if (post.draft && !includeDrafts) {
        return undefined;
      }

      return post;
    },
  };
}

export function resolveContentDir(cwd: string, relativeDir: string): string {
  return path.join(cwd, relativeDir);
}
