import fs from "fs";
import path from "path";

import matter from "gray-matter";
import {
  type ResolvedFeatures,
  validatePostFrontmatter,
} from "@openblog/core";

const ALL_FEATURES_ENABLED: ResolvedFeatures = {
  categories: true,
  tags: true,
  authors: true,
  rss: true,
};

export interface ValidateLocalMdResult {
  ok: boolean;
  fileCount: number;
  errors: string[];
}

export function validateLocalMdContentDir(
  contentDir: string,
  features: ResolvedFeatures = ALL_FEATURES_ENABLED,
): ValidateLocalMdResult {
  const errors: string[] = [];

  if (!fs.existsSync(contentDir)) {
    return {
      ok: false,
      fileCount: 0,
      errors: [`Content directory not found: ${contentDir}`],
    };
  }

  const files = fs.readdirSync(contentDir).filter((file) => file.endsWith(".md"));

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data } = matter(raw);
    const slugFromFile = path.basename(file, ".md");

    const result = validatePostFrontmatter(data, features);
    if (!result.success) {
      errors.push(`✗ ${file}: ${JSON.stringify(result.error.format())}`);
      continue;
    }

    if (result.data.slug !== slugFromFile) {
      errors.push(
        `✗ ${file}: slug "${result.data.slug}" does not match filename "${slugFromFile}"`,
      );
      continue;
    }
  }

  return {
    ok: errors.length === 0,
    fileCount: files.length,
    errors,
  };
}
