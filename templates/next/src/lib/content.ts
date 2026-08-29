import {
  createContentService,
  createLocalMdAdapter,
  resolveContentDir,
} from "@openblog/content/local-md";
import { resolveFeatures } from "@openblog/core";

import { config } from "@/lib/openblog-config";

export const CONTENT_DIR = resolveContentDir(
  process.cwd(),
  config.content.options.dir,
);

export const content = createContentService(
  createLocalMdAdapter({
    contentDir: CONTENT_DIR,
    features: resolveFeatures(config),
  }),
);
