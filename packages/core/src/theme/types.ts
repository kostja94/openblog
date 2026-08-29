export type ThemePresetId =
  | "openai-monochrome"
  | "anthropic-parchment"
  | "vercel-geist"
  | "linear-lavender-dark"
  | "figma-magazine-pastel"
  | "stripe-fintech-gradient"
  | "product"
  | "minimal"
  | "editorial";

export type ThemeAxisId =
  | "monochrome-light"
  | "serif-editorial-warm"
  | "developer-prose"
  | "dark-precision"
  | "magazine-expressive"
  | "chromatic-fintech";

export type ThemeColorMode = "light" | "dark" | "system";

export type ThemeStrategy = "preset" | "hybrid" | "inherit";

export interface ThemeOverrides {
  colors?: Record<string, string>;
  typography?: Record<string, string>;
  spacing?: Record<string, string>;
}

export interface OpenBlogThemeConfig {
  /** Six-axis exemplar preset slug */
  preset?: ThemePresetId;
  /** Optional axis hint (validated against preset) */
  axis?: ThemeAxisId;
  /**
   * Product or blog URL for theme inference when preset is omitted.
   * Run `npm run theme:infer -- --url <url>` to generate suggestions.
   */
  referenceUrl?: string;
  colorMode?: ThemeColorMode;
  strategy?: ThemeStrategy;
  overrides?: ThemeOverrides;
}

export interface ResolvedThemeConfig {
  preset: ThemePresetId;
  axis: ThemeAxisId | null;
  referenceUrl?: string;
  colorMode: ThemeColorMode;
  strategy: ThemeStrategy;
  overrides: ThemeOverrides;
}

export interface ThemeInferenceResult {
  url: string;
  suggestedPreset: ThemePresetId;
  suggestedAxis: ThemeAxisId;
  confidence: "high" | "medium" | "low";
  reason: string;
  signals: {
    domain?: string;
    themeColor?: string;
    ogImage?: string;
    title?: string;
  };
  chromeHints?: {
    siteUrl?: string;
    logo?: string;
  };
}
