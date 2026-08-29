import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

import { copyDir } from "./copy-dir.js";
import { formatSiteName, generateOpenBlogConfig } from "./generate-config.js";
import { generateHelloWorldPost } from "./hello-world-post.js";
import { patchStandalonePaths } from "./patch-standalone.js";
import type { CreateOptions } from "./parse-args.js";
import { resolveOpenBlogRepoRoot } from "./resolve-repo-root.js";

const VALID_PRESETS = new Set([
  "openai-monochrome",
  "anthropic-parchment",
  "vercel-geist",
  "linear-lavender-dark",
  "figma-magazine-pastel",
  "stripe-fintech-gradient",
  "product",
  "minimal",
  "editorial",
]);

export interface CreateProjectResult {
  targetDir: string;
  siteName: string;
  installed: boolean;
}

export function createProject(options: CreateOptions): CreateProjectResult {
  if (!VALID_PRESETS.has(options.preset)) {
    throw new Error(
      `Unknown preset "${options.preset}". Valid presets: ${[...VALID_PRESETS].join(", ")}`,
    );
  }

  const repoRoot = resolveOpenBlogRepoRoot();
  const templateDir = path.join(repoRoot, "templates/next");
  const packagesDir = path.join(repoRoot, "packages");
  const targetDir = path.resolve(process.cwd(), options.dir);

  if (fs.existsSync(targetDir)) {
    throw new Error(`Directory already exists: ${targetDir}`);
  }

  fs.mkdirSync(targetDir, { recursive: true });

  console.log(`Creating OpenBlog project in ${targetDir}...`);

  copyDir(templateDir, targetDir);
  copyDir(packagesDir, path.join(targetDir, "packages"), {
    excludeDirs: new Set(["node_modules", ".next", "create-openblog"]),
    excludeSuffixes: [".test.ts"],
  });

  const featuresSource = path.join(repoRoot, "docs/features.md");
  const agentsDoc = "https://github.com/kostja94/openblog/blob/main/AGENTS.md";
  if (fs.existsSync(featuresSource)) {
    let featuresContent = fs.readFileSync(featuresSource, "utf8");
    featuresContent = featuresContent.replaceAll("../AGENTS.md", agentsDoc);
    fs.writeFileSync(path.join(targetDir, "FEATURES.md"), featuresContent);
  }

  const siteName = formatSiteName(options.dir);
  fs.writeFileSync(
    path.join(targetDir, "openblog.config.ts"),
    generateOpenBlogConfig({ siteName, preset: options.preset }),
    "utf8",
  );

  const blogDir = path.join(targetDir, "content/blog");
  fs.mkdirSync(blogDir, { recursive: true });
  for (const file of fs.readdirSync(blogDir)) {
    if (file.endsWith(".md")) {
      fs.unlinkSync(path.join(blogDir, file));
    }
  }
  fs.writeFileSync(path.join(blogDir, "hello-world.md"), generateHelloWorldPost(siteName), "utf8");

  patchStandalonePaths(targetDir);
  updatePackageJson(targetDir, options.dir);

  let installed = false;
  if (options.install) {
    console.log("\nInstalling dependencies...");
    const result = spawnSync("npm", ["install"], {
      cwd: targetDir,
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    if (result.status !== 0) {
      throw new Error("npm install failed");
    }
    installed = true;
  }

  printNextSteps(targetDir, options.install);

  return { targetDir, siteName, installed };
}

function updatePackageJson(targetDir: string, projectName: string): void {
  const packageJsonPath = path.join(targetDir, "package.json");
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8")) as Record<string, unknown>;

  pkg.name = projectName;
  pkg.workspaces = ["packages/*"];

  fs.writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
}

function printNextSteps(targetDir: string, installed: boolean): void {
  const relativeDir = path.relative(process.cwd(), targetDir) || ".";
  const cdCommand = relativeDir === "." ? "# already in project directory" : `cd ${relativeDir}`;

  console.log(`
Success! Created OpenBlog project at ${targetDir}

Next steps:
  ${cdCommand}
${installed ? "" : "  npm install\n"}  npm run dev

Open http://localhost:3000/blog and edit content/blog/hello-world.md
Customize openblog.config.ts for theme, features, and site metadata.
`);
}
