import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export function resolveOpenBlogRepoRootFrom(packageRoot: string): string {
  const monorepoRoot = path.resolve(packageRoot, "../..");
  const scaffoldRoot = path.join(packageRoot, "scaffold");

  if (fs.existsSync(path.join(monorepoRoot, "templates/next"))) {
    return monorepoRoot;
  }

  if (fs.existsSync(path.join(scaffoldRoot, "templates/next"))) {
    return scaffoldRoot;
  }

  throw new Error(
    "Could not locate OpenBlog templates. Run create-openblog from the published package or monorepo checkout.",
  );
}

export function resolveOpenBlogRepoRoot(): string {
  const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  return resolveOpenBlogRepoRootFrom(packageRoot);
}
