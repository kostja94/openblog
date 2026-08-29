#!/usr/bin/env tsx
import { spawnSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

import { createProject } from "../packages/create-openblog/src/create-project.js";

function patchFeaturesAllFalse(configPath: string): void {
  let source = fs.readFileSync(configPath, "utf8");

  const disabledFeaturesBlock = `  features: {
    categories: false,
    tags: false,
    authors: false,
    rss: false,
  },`;

  if (source.includes("features:")) {
    source = source.replace(/  features: \{[\s\S]*?\},/, disabledFeaturesBlock);
  } else {
    source = source.replace(
      "  components: {",
      `${disabledFeaturesBlock}

  components: {`,
    );
  }

  fs.writeFileSync(configPath, source, "utf8");
}

function writeMinimalPost(blogDir: string): void {
  for (const file of fs.readdirSync(blogDir)) {
    if (file.endsWith(".md")) {
      fs.unlinkSync(path.join(blogDir, file));
    }
  }

  fs.writeFileSync(
    path.join(blogDir, "smoke-test.md"),
    `---
title: "Smoke test"
description: "Minimal post for scaffold smoke test verifying create-openblog end-to-end build with all features disabled."
slug: "smoke-test"
date: "2026-01-01"
draft: false
---

# Smoke test

Hello from scaffold smoke test.
`,
    "utf8",
  );
}

function runCommand(cwd: string, command: string, args: string[]): void {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: { ...process.env, CI: "true" },
  });

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed in ${cwd}`);
  }
}

function main(): void {
  const parentDir = fs.mkdtempSync(path.join(os.tmpdir(), "openblog-scaffold-smoke-"));
  const projectName = "smoke-blog";
  const previousCwd = process.cwd();

  try {
    process.chdir(parentDir);
    const { targetDir } = createProject({
      dir: projectName,
      preset: "vercel-geist",
      install: false,
    });

    patchFeaturesAllFalse(path.join(targetDir, "openblog.config.ts"));
    writeMinimalPost(path.join(targetDir, "content/blog"));

    runCommand(targetDir, "npm", ["install"]);
    runCommand(targetDir, "npm", ["run", "build"]);

    if (!fs.existsSync(path.join(targetDir, ".next"))) {
      throw new Error("Expected .next output after scaffold build");
    }

    console.log("\n✓ Scaffold smoke test passed\n");
  } finally {
    process.chdir(previousCwd);
    fs.rmSync(parentDir, { recursive: true, force: true });
  }
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\n✗ Scaffold smoke test failed: ${message}\n`);
  process.exit(1);
}
