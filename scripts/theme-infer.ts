#!/usr/bin/env tsx
/**
 * Infer blog theme preset from a product/blog URL.
 *
 * Usage:
 *   npm run theme:infer -- --url https://vercel.com/blog
 *   npm run theme:infer -- --url https://yourproduct.com/blog --write
 */
import fs from "fs";
import path from "path";

import { inferThemeFromUrl } from "@openblog/themes";

const repoRoot = path.resolve(__dirname, "..");
const outDir = path.join(repoRoot, "integrations", "theme", ".generated");
const outFile = path.join(outDir, "inference.json");

function parseArgs(argv: string[]) {
  let url: string | undefined;
  let write = false;

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--url" && argv[i + 1]) {
      url = argv[++i];
    } else if (argv[i] === "--write") {
      write = true;
    }
  }

  return { url, write };
}

async function main() {
  const { url, write } = parseArgs(process.argv.slice(2));

  if (!url) {
    console.error("Usage: npm run theme:infer -- --url https://yourproduct.com/blog [--write]");
    process.exit(1);
  }

  const result = await inferThemeFromUrl(url);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, `${JSON.stringify(result, null, 2)}\n`, "utf8");

  console.log("\nTheme inference");
  console.log("─".repeat(40));
  console.log(`URL:              ${result.url}`);
  console.log(`Suggested preset: ${result.suggestedPreset}`);
  console.log(`Suggested axis:   ${result.suggestedAxis}`);
  console.log(`Confidence:       ${result.confidence}`);
  console.log(`Reason:           ${result.reason}`);
  if (result.signals.themeColor) {
    console.log(`theme-color:      ${result.signals.themeColor}`);
  }
  console.log(`\nWritten: ${outFile}`);
  console.log("\nNext: set in openblog.config.ts:");
  console.log(`  theme: { preset: "${result.suggestedPreset}", referenceUrl: "${result.url}" }`);
  console.log("Then run: npm run theme:sync");

  if (write) {
    const configPath = path.join(repoRoot, "openblog.config.ts");
    let config = fs.readFileSync(configPath, "utf8");

    if (/theme:\s*["'`]/.test(config) || /theme:\s*\{/.test(config)) {
      config = config.replace(
        /theme:\s*(?:["'`][^"'`]+["'`]|\{[\s\S]*?\}),/,
        `theme: {
    preset: "${result.suggestedPreset}",
    referenceUrl: "${result.url}",
    strategy: "hybrid",
  },`,
      );
    } else {
      console.warn("\n--write: could not patch openblog.config.ts automatically.");
    }

    if (write && config.includes(`preset: "${result.suggestedPreset}"`)) {
      fs.writeFileSync(configPath, config, "utf8");
      console.log(`\nUpdated: ${configPath}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
