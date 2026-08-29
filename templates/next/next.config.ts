import type { NextConfig } from "next";
import { resolveFeatures } from "@openblog/core";

import config from "../../openblog.config";

const features = resolveFeatures(config);

const nextConfig: NextConfig = {
  env: {
    FEATURES_RSS: features.rss ? "true" : "false",
  },
  trailingSlash: false,
  assetPrefix: process.env.ASSET_PREFIX || undefined,
  transpilePackages: [
    "@openblog/core",
    "@openblog/content",
    "@openblog/components",
    "@openblog/themes",
  ],
};

export default nextConfig;
