import fs from "fs";
import path from "path";

import matter from "gray-matter";
import { resolveFeatures, validatePostFrontmatter, validateRequiredComponents } from "@openblog/core";
import { pathToFileURL } from "url";

import { CONTENT_DIR } from "../src/lib/content";

async function loadConfig() {
  const configPath = path.resolve(__dirname, "../../../openblog.config.ts");
  const mod = await import(pathToFileURL(configPath).href);
  return mod.default as import("@openblog/core").OpenBlogConfig;
}

async function main() {
  const config = await loadConfig();
  const features = resolveFeatures(config);
  const unknownRequired = validateRequiredComponents(config);

  if (unknownRequired.length > 0) {
    console.error(
      `\n✗ Unknown components.required ids: ${unknownRequired.join(", ")}`,
    );
    console.error(
      "  Known ids: breadcrumbs, post-title, post-meta, post-dek, featured-image, markdown",
    );
    process.exit(1);
  }

  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`Content directory not found: ${CONTENT_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((file) => file.endsWith(".md"));
  let failed = false;

  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data } = matter(raw);
    const slugFromFile = path.basename(file, ".md");

    const result = validatePostFrontmatter(data, features);
    if (!result.success) {
      failed = true;
      console.error(`\n✗ ${file}`);
      console.error(result.error.format());
      continue;
    }

    if (result.data.slug !== slugFromFile) {
      failed = true;
      console.error(
        `\n✗ ${file}: slug "${result.data.slug}" does not match filename "${slugFromFile}"`,
      );
      continue;
    }

    console.log(`✓ ${file}`);
  }

  if (failed) {
    process.exit(1);
  }

  console.log(`\nValidated ${files.length} posts.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
