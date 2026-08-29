import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, describe, expect, it } from "vitest";

import { createProject } from "./create-project.js";

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe("createProject", () => {
  it("scaffolds a standalone project with config and sample post", () => {
    const parentDir = fs.mkdtempSync(path.join(os.tmpdir(), "create-openblog-test-"));
    tempDirs.push(parentDir);

    const projectName = "test-blog";
    const previousCwd = process.cwd();

    try {
      process.chdir(parentDir);
      const result = createProject({
        dir: projectName,
        preset: "vercel-geist",
        install: false,
      });

      expect(result.siteName).toBe("Test Blog");
      expect(fs.existsSync(path.join(result.targetDir, "openblog.config.ts"))).toBe(true);
      expect(fs.existsSync(path.join(result.targetDir, "content/blog/hello-world.md"))).toBe(true);
      expect(fs.existsSync(path.join(result.targetDir, "packages/core/package.json"))).toBe(true);
      expect(fs.existsSync(path.join(result.targetDir, "node_modules"))).toBe(false);

      const config = fs.readFileSync(path.join(result.targetDir, "openblog.config.ts"), "utf8");
      expect(config).toContain('name: "Test Blog"');
      expect(config).toContain('preset: "vercel-geist"');
      expect(config).toContain("features: {");
      expect(config).toContain("categories: true");
      expect(config).toContain("rss: true");

      const openblogConfigImport = fs.readFileSync(
        path.join(result.targetDir, "src/lib/openblog-config.ts"),
        "utf8",
      );
      expect(openblogConfigImport).toContain('../../openblog.config"');

      const blogFiles = fs.readdirSync(path.join(result.targetDir, "content/blog")).filter((file) =>
        file.endsWith(".md"),
      );
      expect(blogFiles).toEqual(["hello-world.md"]);
    } finally {
      process.chdir(previousCwd);
    }
  });

  it("patches monorepo paths for standalone layout", () => {
    const parentDir = fs.mkdtempSync(path.join(os.tmpdir(), "create-openblog-patch-"));
    tempDirs.push(parentDir);

    const projectName = "patched-blog";
    const previousCwd = process.cwd();

    try {
      process.chdir(parentDir);
      const result = createProject({
        dir: projectName,
        preset: "vercel-geist",
        install: false,
      });

      const tsconfig = fs.readFileSync(path.join(result.targetDir, "tsconfig.json"), "utf8");
      expect(tsconfig).toContain("./openblog.config.ts");
      expect(tsconfig).not.toContain("../../openblog.config.ts");

      const validatePosts = fs.readFileSync(
        path.join(result.targetDir, "scripts/validate-posts.ts"),
        "utf8",
      );
      expect(validatePosts).toContain('path.resolve(__dirname, "../openblog.config.ts")');
      expect(validatePosts).not.toContain('path.resolve(__dirname, "../../../openblog.config.ts")');

      const syncTheme = fs.readFileSync(path.join(result.targetDir, "scripts/sync-theme.ts"), "utf8");
      expect(syncTheme).toContain("const repoRoot = templateRoot;");
      expect(syncTheme).toContain(
        'const inferenceFile = path.join(templateRoot, ".openblog", "theme-inference.json");',
      );
      expect(syncTheme).not.toContain('path.resolve(templateRoot, "../..")');
    } finally {
      process.chdir(previousCwd);
    }
  });
});
