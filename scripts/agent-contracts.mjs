import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(root, "integrations", "agent-contracts.json");
const documentationPath = path.join(root, "docs", "component-model.md");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function relativeLink(fromFile, targetPath) {
  return path.relative(path.dirname(fromFile), path.join(root, targetPath)).replaceAll("\\", "/");
}

function catalogIds(catalog) {
  const candidates = [catalog.pages, catalog.components, catalog.items];
  const records = candidates.find(Array.isArray);
  assert(records, "External catalog must expose pages, components, or items as an array");
  return new Set(records.map((entry) => entry.id));
}

function findExternalRoot(name) {
  const envName = `${name.toUpperCase()}_ROOT`;
  const candidates = [process.env[envName], path.resolve(root, "..", name)].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(path.join(candidate, "package.json")));
}

function validateContract(name, contract) {
  assert(typeof contract.repository === "string" && contract.repository.startsWith("https://"), `${name}: invalid repository URL`);
  assert(Array.isArray(contract.implementations) && contract.implementations.length > 0, `${name}: implementations must not be empty`);

  const seen = new Set();
  for (const implementation of contract.implementations) {
    assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(implementation.id), `${name}: invalid id ${implementation.id}`);
    assert(!seen.has(implementation.id), `${name}: duplicate id ${implementation.id}`);
    seen.add(implementation.id);
    assert(fs.existsSync(path.join(root, implementation.path)), `${name}: missing OpenBlog implementation ${implementation.path}`);
  }

  const externalRoot = findExternalRoot(name);
  if (!externalRoot) return `${name}: local paths valid; external catalog not present`;

  const externalCatalogPath = path.join(externalRoot, contract.catalog);
  assert(fs.existsSync(externalCatalogPath), `${name}: missing external catalog ${externalCatalogPath}`);
  const ids = catalogIds(JSON.parse(fs.readFileSync(externalCatalogPath, "utf8")));
  for (const id of seen) assert(ids.has(id), `${name}: external catalog does not define ${id}`);
  return `${name}: local paths and ${seen.size} external IDs valid`;
}

function renderTable(contract) {
  const rows = contract.implementations.map((item) => {
    const local = `[\`${item.path}\`](${relativeLink(documentationPath, item.path)})`;
    const external = `[${item.name}](${contract.repository}/blob/main/${contract.catalog})`;
    return `| ${local} | \`${item.id}\` | ${external} |`;
  });
  return [
    "| OpenBlog implementation | Contract ID | Contract owner |",
    "|---|---|---|",
    ...rows,
  ].join("\n");
}

function renderDocumentation() {
  return `---
title: OpenBlog Agent contract implementations
description: Generated index of the Pagina page contracts and Bricks component contracts implemented by OpenBlog.
type: reference
date: ${manifest.documentation.date}
updated: ${manifest.documentation.updated}
version: ${manifest.version}
---

# OpenBlog Agent contract implementations

This file is generated from [\`integrations/agent-contracts.json\`](../integrations/agent-contracts.json). Edit the manifest and run \`npm run contracts:generate\`; do not maintain mappings here.

Pagina owns page responsibilities and page-to-component recommendations. Bricks owns component responsibilities. OpenBlog owns only the declaration of which contracts its runnable CMS implements.

## Pagina page contracts

${renderTable(manifest.pagina)}

## Bricks component contracts

${renderTable(manifest.bricks)}

## Boundary

These are design-time Agent contracts, not runtime package dependencies. OpenBlog remains independently installable and does not duplicate Pagina or Bricks guidance. Contextus is intentionally outside this integration.
`;
}

const results = [
  validateContract("pagina", manifest.pagina),
  validateContract("bricks", manifest.bricks),
];
const generated = renderDocumentation();

if (process.argv.includes("--write")) {
  fs.writeFileSync(documentationPath, generated, "utf8");
  console.log(`Generated ${path.relative(root, documentationPath)}`);
} else {
  assert(fs.readFileSync(documentationPath, "utf8").replaceAll("\r\n", "\n") === generated, "docs/component-model.md is stale; run npm run contracts:generate");
}

for (const result of results) console.log(`✓ ${result}`);
