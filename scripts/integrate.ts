#!/usr/bin/env tsx
/**
 * Scrape brand metadata from a product site URL.
 *
 * Security: only pass trusted URLs — this fetches remote HTML server-side (SSRF risk).
 *
 * Usage:
 *   npm run integrate -- --site https://yourproduct.com
 */
import fs from "fs";
import path from "path";

const repoRoot = path.resolve(__dirname, "..");
const outDir = path.join(repoRoot, "integrations", "chrome", ".generated");
const outFile = path.join(outDir, "brand.manifest.json");

function parseArgs(argv: string[]) {
  let site: string | undefined;

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--site" && argv[i + 1]) {
      site = argv[++i];
    }
  }

  return { site };
}

function parseMeta(html: string, property: string): string | undefined {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${escaped}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${escaped}["']`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return undefined;
}

function parseTitle(html: string): string | undefined {
  return html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim();
}

function parseFavicon(html: string, baseUrl: string): string | undefined {
  const patterns = [
    /<link[^>]+rel=["'](?:shortcut icon|icon|apple-touch-icon)["'][^>]+href=["']([^"']+)["']/i,
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:shortcut icon|icon|apple-touch-icon)["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      try {
        return new URL(match[1], baseUrl).href;
      } catch {
        return match[1];
      }
    }
  }

  return undefined;
}

function resolveAbsoluteUrl(value: string | undefined, baseUrl: string): string | undefined {
  if (!value) {
    return undefined;
  }

  try {
    return new URL(value, baseUrl).href;
  } catch {
    return value;
  }
}

async function main() {
  const { site } = parseArgs(process.argv.slice(2));

  if (!site) {
    console.error("Usage: npm run integrate -- --site https://yourproduct.com");
    process.exit(1);
  }

  const normalized = site.startsWith("http") ? site : `https://${site}`;
  let html = "";
  let siteUrl: string | undefined;

  try {
    const parsed = new URL(normalized);
    siteUrl = `${parsed.protocol}//${parsed.host}`;
  } catch {
    console.error(`Invalid site URL: ${site}`);
    process.exit(1);
  }

  try {
    const response = await fetch(normalized, {
      headers: { "User-Agent": "OpenBlog-Integrate/0.1" },
      redirect: "follow",
    });
    html = await response.text();
  } catch (error) {
    console.error(`Failed to fetch ${normalized}:`, error);
    process.exit(1);
  }

  const title = parseTitle(html);
  const themeColor =
    parseMeta(html, "theme-color") ?? parseMeta(html, "msapplication-TileColor");
  const ogImage = resolveAbsoluteUrl(parseMeta(html, "og:image"), normalized);
  const favicon =
    parseFavicon(html, normalized) ??
    resolveAbsoluteUrl("/favicon.ico", siteUrl);

  const manifest = {
    sourceUrl: normalized,
    siteUrl,
    title,
    themeColor,
    logo: ogImage,
    ogImage,
    favicon,
    generatedAt: new Date().toISOString(),
  };

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  console.log("\nBrand integration");
  console.log("─".repeat(40));
  console.log(`Site:        ${siteUrl}`);
  if (title) console.log(`Title:       ${title}`);
  if (themeColor) console.log(`theme-color: ${themeColor}`);
  if (ogImage) console.log(`og:image:    ${ogImage}`);
  if (favicon) console.log(`Favicon:     ${favicon}`);
  console.log(`\nWritten: ${outFile}`);
  console.log("\nNext: copy hints into openblog.config.ts chrome block, or compare with");
  console.log("integrations/chrome/brand.manifest.example.json");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
