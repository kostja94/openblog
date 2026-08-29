import type {
  OpenBlogThemeConfig,
  ResolvedThemeConfig,
  ThemePresetId,
} from "./types";

const LAUNCH_PRESETS: ThemePresetId[] = [
  "openai-monochrome",
  "anthropic-parchment",
  "vercel-geist",
  "linear-lavender-dark",
  "figma-magazine-pastel",
  "stripe-fintech-gradient",
];

export function isLaunchPreset(preset: string): preset is ThemePresetId {
  return LAUNCH_PRESETS.includes(preset as ThemePresetId);
}

export function normalizeThemeInput(
  theme: string | OpenBlogThemeConfig | undefined,
): OpenBlogThemeConfig {
  if (!theme) {
    return { preset: "product", colorMode: "light", strategy: "preset" };
  }

  if (typeof theme === "string") {
    return {
      preset: theme as ThemePresetId,
      colorMode: theme === "linear-lavender-dark" ? "dark" : "light",
      strategy: "preset",
    };
  }

  return theme;
}

export function resolveThemeConfig(
  theme: string | OpenBlogThemeConfig | undefined,
  inferredPreset?: ThemePresetId,
): ResolvedThemeConfig {
  const input = normalizeThemeInput(theme);
  const preset =
    input.preset ??
    inferredPreset ??
    inferPresetFromReferenceUrl(input.referenceUrl) ??
    "product";

  return {
    preset,
    axis: input.axis ?? null,
    referenceUrl: input.referenceUrl,
    colorMode:
      input.colorMode ??
      (preset === "linear-lavender-dark" ? "dark" : "light"),
    strategy: input.strategy ?? "preset",
    overrides: input.overrides ?? {},
  };
}

/** Lightweight domain heuristic when inference file not yet generated */
function inferPresetFromReferenceUrl(url?: string): ThemePresetId | undefined {
  if (!url) {
    return undefined;
  }

  try {
    const host = new URL(url).hostname.replace(/^www\./, "");

    const map: Record<string, ThemePresetId> = {
      "openai.com": "openai-monochrome",
      "anthropic.com": "anthropic-parchment",
      "vercel.com": "vercel-geist",
      "linear.app": "linear-lavender-dark",
      "figma.com": "figma-magazine-pastel",
      "stripe.com": "stripe-fintech-gradient",
    };

    for (const [domain, preset] of Object.entries(map)) {
      if (host === domain || host.endsWith(`.${domain}`)) {
        return preset;
      }
    }
  } catch {
    return undefined;
  }

  return undefined;
}

export function getThemeStylesheetImport(preset: ThemePresetId): string {
  if (preset === "product" || preset === "minimal" || preset === "editorial") {
    return `@openblog/themes/${preset}`;
  }

  return `@openblog/themes/presets/${preset}`;
}
