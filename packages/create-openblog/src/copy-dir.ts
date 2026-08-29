import fs from "fs";
import path from "path";

const DEFAULT_EXCLUDE_DIRS = new Set(["node_modules", ".next"]);
const DEFAULT_EXCLUDE_FILES = new Set(["package-lock.json"]);

export interface CopyDirOptions {
  excludeDirs?: Set<string>;
  excludeFiles?: Set<string>;
  excludeSuffixes?: string[];
}

export function copyDir(src: string, dest: string, options: CopyDirOptions = {}): void {
  const excludeDirs = options.excludeDirs ?? DEFAULT_EXCLUDE_DIRS;
  const excludeFiles = options.excludeFiles ?? DEFAULT_EXCLUDE_FILES;
  const excludeSuffixes = options.excludeSuffixes ?? [];

  fs.cpSync(src, dest, {
    recursive: true,
    filter: (source) => {
      const relative = path.relative(src, source);
      if (!relative) {
        return true;
      }

      const segments = relative.split(path.sep);
      if (segments.some((segment) => excludeDirs.has(segment))) {
        return false;
      }

      const base = path.basename(source);
      if (excludeFiles.has(base)) {
        return false;
      }

      if (excludeSuffixes.some((suffix) => base.endsWith(suffix))) {
        return false;
      }

      return true;
    },
  });
}
