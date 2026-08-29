import type { ThemePresetId } from "@openblog/core";
import { getThemeStylesheetImport } from "@openblog/core";

import catalog from "../catalog.json";

export {
  inferThemeFromUrl,
  inferPresetFromDomain,
  getPresetAxis,
  listLaunchPresets,
  catalog,
} from "./infer";

export const themeStylesheets: Record<string, string> = {
  product: "@openblog/themes/product",
  minimal: "@openblog/themes/minimal",
  editorial: "@openblog/themes/editorial",
  ...(Object.fromEntries(
    (catalog.launchPresets as string[]).map((id) => [
      id,
      `@openblog/themes/presets/${id}`,
    ]),
  ) as Record<string, string>),
};

export function getThemeStylesheet(preset: ThemePresetId | string): string {
  return themeStylesheets[preset] ?? getThemeStylesheetImport(preset as ThemePresetId);
}

export function listThemes(): string[] {
  return [
    ...(catalog.launchPresets as string[]),
    ...(catalog.builtinPresets as string[]),
  ];
}
