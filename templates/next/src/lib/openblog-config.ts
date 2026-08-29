import {
  createSiteHelpers,
  resolveSiteRuntime,
  resolveThemeConfig,
} from "@openblog/core";
import { getThemeStylesheet } from "@openblog/themes";

import config from "../../../../openblog.config";

export { config };

export const siteRuntime = resolveSiteRuntime(config);
export const siteHelpers = createSiteHelpers(siteRuntime);

export const site = {
  name: config.site.name,
  tagline: config.site.tagline ?? "",
  description: config.site.description,
  github: config.site.github ?? "",
  locale: config.site.locale,
} as const;

export const resolvedTheme = resolveThemeConfig(config.theme);

export function getThemeImportPath(): string {
  return getThemeStylesheet(resolvedTheme.preset);
}

export function getThemeColorModeClass(): string {
  if (resolvedTheme.colorMode === "system") return "ob-theme-system";
  if (resolvedTheme.colorMode === "dark") return "ob-theme-dark";
  return "ob-theme-light";
}
