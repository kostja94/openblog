import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, describe, expect, it } from "vitest";

import { resolveOpenBlogRepoRootFrom } from "./resolve-repo-root.js";

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

function createLayout(root: string, layout: "monorepo" | "scaffold"): string {
  if (layout === "monorepo") {
    fs.mkdirSync(path.join(root, "templates/next"), { recursive: true });
    fs.mkdirSync(path.join(root, "packages/core"), { recursive: true });
    fs.writeFileSync(path.join(root, "templates/next/package.json"), "{}", "utf8");
    return root;
  }

  const packageRoot = path.join(root, "create-openblog");
  fs.mkdirSync(path.join(packageRoot, "scaffold/templates/next"), { recursive: true });
  fs.mkdirSync(path.join(packageRoot, "scaffold/packages/core"), { recursive: true });
  fs.writeFileSync(path.join(packageRoot, "scaffold/templates/next/package.json"), "{}", "utf8");
  return packageRoot;
}

describe("resolveOpenBlogRepoRootFrom", () => {
  it("prefers monorepo layout when templates/next exists two levels up", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "openblog-monorepo-"));
    tempDirs.push(root);

    const packageRoot = path.join(root, "packages/create-openblog");
    createLayout(root, "monorepo");
    fs.mkdirSync(packageRoot, { recursive: true });
    fs.mkdirSync(path.join(packageRoot, "scaffold/templates/next"), { recursive: true });

    expect(resolveOpenBlogRepoRootFrom(packageRoot)).toBe(root);
  });

  it("falls back to bundled scaffold for published npm layout", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "openblog-scaffold-"));
    tempDirs.push(root);

    const packageRoot = createLayout(root, "scaffold");
    expect(resolveOpenBlogRepoRootFrom(packageRoot)).toBe(path.join(packageRoot, "scaffold"));
  });

  it("throws when neither monorepo nor scaffold templates are present", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "openblog-missing-"));
    tempDirs.push(root);

    const packageRoot = path.join(root, "create-openblog");
    fs.mkdirSync(packageRoot, { recursive: true });

    expect(() => resolveOpenBlogRepoRootFrom(packageRoot)).toThrow(
      "Could not locate OpenBlog templates",
    );
  });
});
