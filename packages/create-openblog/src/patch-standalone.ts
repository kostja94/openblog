import fs from "fs";
import path from "path";

export function patchStandalonePaths(projectRoot: string): void {
  const openblogConfigImport = path.join(projectRoot, "src/lib/openblog-config.ts");
  replaceInFile(
    openblogConfigImport,
    'import config from "../../../../openblog.config";',
    'import config from "../../openblog.config";',
  );

  const tsconfigPath = path.join(projectRoot, "tsconfig.json");
  replaceInFile(
    tsconfigPath,
    "../../openblog.config.ts",
    "./openblog.config.ts",
  );

  const validatePostsPath = path.join(projectRoot, "scripts/validate-posts.ts");
  replaceInFile(
    validatePostsPath,
    'path.resolve(__dirname, "../../../openblog.config.ts")',
    'path.resolve(__dirname, "../openblog.config.ts")',
  );

  replaceInFile(
    path.join(projectRoot, "next.config.ts"),
    'import config from "../../openblog.config";',
    'import config from "./openblog.config";',
  );

  const syncThemePath = path.join(projectRoot, "scripts/sync-theme.ts");
  let syncTheme = fs.readFileSync(syncThemePath, "utf8");
  syncTheme = syncTheme.replace(
    'const repoRoot = path.resolve(templateRoot, "../..");',
    "const repoRoot = templateRoot;",
  );
  syncTheme = syncTheme.replace(
    'const inferenceFile = path.join(repoRoot, "integrations", "theme", ".generated", "inference.json");',
    "const inferenceFile = path.join(templateRoot, \".openblog\", \"theme-inference.json\");",
  );
  fs.writeFileSync(syncThemePath, syncTheme, "utf8");
}

function replaceInFile(filePath: string, search: string, replace: string): void {
  const content = fs.readFileSync(filePath, "utf8");
  if (!content.includes(search)) {
    throw new Error(`Expected patch target not found in ${filePath}: ${search}`);
  }
  fs.writeFileSync(filePath, content.replace(search, replace), "utf8");
}
