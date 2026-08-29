import type { DeployMode } from "@openblog/core";

import { config, site, siteHelpers, siteRuntime } from "@/lib/openblog-config";

export type { DeployMode };

export { site, config as openblogConfig };

export function getDeployMode(): DeployMode {
  return siteRuntime.deployMode;
}

export function getSiteUrl(): string {
  return siteRuntime.siteUrl;
}

export function getBlogBasePath(): string {
  return siteRuntime.blogBasePath;
}

export const blogPath = siteHelpers.blogPath;
export const postPath = siteHelpers.postPath;
export const categoryPath = siteHelpers.categoryPath;
export const tagPath = siteHelpers.tagPath;
export const authorPath = siteHelpers.authorPath;
export const absoluteUrl = siteHelpers.absoluteUrl;
export const blogIndexUrl = siteHelpers.blogIndexUrl;
export const isSubdomainMode = siteHelpers.isSubdomainMode;
export const isStandaloneMode = siteHelpers.isStandaloneMode;
export const isSubdirectoryMode = siteHelpers.isSubdirectoryMode;
