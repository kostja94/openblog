import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { copyDir } from "../src/copy-dir.js";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const monorepoRoot = path.resolve(packageRoot, "../..");
const scaffoldRoot = path.join(packageRoot, "scaffold");

const templateSource = path.join(monorepoRoot, "templates/next");
const packagesSource = path.join(monorepoRoot, "packages");

if (!fs.existsSync(templateSource)) {
  throw new Error(`Missing template source: ${templateSource}`);
}

if (!fs.existsSync(packagesSource)) {
  throw new Error(`Missing packages source: ${packagesSource}`);
}

if (fs.existsSync(scaffoldRoot)) {
  fs.rmSync(scaffoldRoot, { recursive: true, force: true });
}

fs.mkdirSync(scaffoldRoot, { recursive: true });

copyDir(templateSource, path.join(scaffoldRoot, "templates/next"));

const scaffoldPackagesDir = path.join(scaffoldRoot, "packages");
fs.mkdirSync(scaffoldPackagesDir, { recursive: true });

for (const entry of fs.readdirSync(packagesSource, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name === "create-openblog") {
    continue;
  }

  copyDir(path.join(packagesSource, entry.name), path.join(scaffoldPackagesDir, entry.name));
}

const AGENTS_DOC =
  "https://github.com/kostja94/openblog/blob/main/AGENTS.md";

const featuresSource = path.join(monorepoRoot, "docs/features.md");
if (fs.existsSync(featuresSource)) {
  let featuresContent = fs.readFileSync(featuresSource, "utf8");
  featuresContent = featuresContent.replaceAll("../AGENTS.md", AGENTS_DOC);
  fs.writeFileSync(path.join(scaffoldRoot, "FEATURES.md"), featuresContent);
}

console.log(`Bundled scaffold assets to ${scaffoldRoot}`);
