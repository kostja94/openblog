import fs from "fs";
import os from "os";
import path from "path";

import { afterEach, describe, expect, it } from "vitest";

import type { ResolvedFeatures } from "@openblog/core";

import { createLocalMdAdapter } from "./adapter";

const featuresOff: ResolvedFeatures = {
  categories: false,
  tags: true,
  authors: false,
  rss: true,
};

const validFrontmatter = `---
title: Test Post Without Author Or Category
description: This is a test description that meets the minimum length requirement of eighty characters for validation.
slug: test-post
date: "2024-01-01"
---

# Test Post Without Author Or Category

Body content here.
`;

describe("createLocalMdAdapter", () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    for (const dir of tempDirs) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
    tempDirs.length = 0;
  });

  function createTempContentDir(content: string): string {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "openblog-adapter-"));
    tempDirs.push(dir);
    fs.writeFileSync(path.join(dir, "test-post.md"), content, "utf8");
    return dir;
  }

  it("allows missing author and category when features are disabled", () => {
    const contentDir = createTempContentDir(validFrontmatter);
    const adapter = createLocalMdAdapter({ contentDir, features: featuresOff });

    const post = adapter.getPost("test-post");
    expect(post).toBeDefined();
    expect(post?.author).toBeUndefined();
    expect(post?.category).toBeUndefined();
    expect(post?.title).toBe("Test Post Without Author Or Category");
  });

  it("requires author and category when features are enabled (default)", () => {
    const contentDir = createTempContentDir(validFrontmatter);
    const adapter = createLocalMdAdapter({ contentDir });

    expect(() => adapter.getPost("test-post")).toThrow();
  });
});
