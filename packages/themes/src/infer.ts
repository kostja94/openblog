/**
 * Security: only pass trusted URLs — this fetches remote HTML server-side (SSRF risk).
 */
import type { ThemeAxisId, ThemeInferenceResult, ThemePresetId } from "@openblog/core";

import catalog from "../catalog.json";

const DOMAIN_MAP = catalog.domainPresetMap as Record<string, ThemePresetId>;

const PRESET_AXIS: Record<ThemePresetId, ThemeAxisId> = {
  "openai-monochrome": "monochrome-light",
  "anthropic-parchment": "serif-editorial-warm",
  "vercel-geist": "developer-prose",
  "linear-lavender-dark": "dark-precision",
  "figma-magazine-pastel": "magazine-expressive",
  "stripe-fintech-gradient": "chromatic-fintech",
  product: "monochrome-light",
  minimal: "monochrome-light",
  editorial: "serif-editorial-warm",
};

function parseMeta(html: string, property: string): string | undefined {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${escaped}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']+)["']`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return undefined;
}

function parseTitle(html: string): string | undefined {
  return html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim();
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{3,8}$/.test(normalized)) {
    return null;
  }

  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized.slice(0, 6);

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function scorePresetFromThemeColor(themeColor?: string): ThemePresetId | null {
  if (!themeColor) {
    return null;
  }

  const rgb = hexToRgb(themeColor);
  if (!rgb) {
    return null;
  }

  const { r, g, b } = rgb;
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  if (luminance < 0.15) {
    return "linear-lavender-dark";
  }

  if (r > 200 && g > 180 && b > 160 && luminance > 0.7) {
    return "anthropic-parchment";
  }

  if (b > r + 20 && b > g) {
    return "stripe-fintech-gradient";
  }

  if (luminance > 0.92 && Math.max(r, g, b) - Math.min(r, g, b) < 20) {
    return "openai-monochrome";
  }

  return "vercel-geist";
}

export function inferPresetFromDomain(url: string): ThemePresetId | null {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");

    if (DOMAIN_MAP[host]) {
      return DOMAIN_MAP[host];
    }

    for (const [domain, preset] of Object.entries(DOMAIN_MAP)) {
      if (host.endsWith(`.${domain}`)) {
        return preset;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export async function inferThemeFromUrl(url: string): Promise<ThemeInferenceResult> {
  const normalized = url.startsWith("http") ? url : `https://${url}`;
  let domainPreset = inferPresetFromDomain(normalized);

  let html = "";
  let themeColor: string | undefined;
  let ogImage: string | undefined;
  let title: string | undefined;

  try {
    const response = await fetch(normalized, {
      headers: { "User-Agent": "OpenBlog-Theme-Infer/0.3" },
      redirect: "follow",
    });
    html = await response.text();
    themeColor = parseMeta(html, "theme-color") ?? parseMeta(html, "msapplication-TileColor");
    ogImage = parseMeta(html, "og:image");
    title = parseTitle(html);
  } catch {
    // offline / blocked — fall back to domain only
  }

  if (!domainPreset) {
    domainPreset = scorePresetFromThemeColor(themeColor);
  }

  const suggestedPreset: ThemePresetId = domainPreset ?? "product";
  const suggestedAxis = PRESET_AXIS[suggestedPreset];

  let confidence: ThemeInferenceResult["confidence"] = "low";
  let reason = "No strong domain or theme-color match; defaulting to neutral product preset.";

  if (inferPresetFromDomain(normalized)) {
    confidence = "high";
    reason = `Known product domain mapped to preset "${suggestedPreset}".`;
  } else if (themeColor && domainPreset) {
    confidence = "medium";
    reason = `theme-color ${themeColor} heuristically matched preset "${suggestedPreset}".`;
  }

  let siteUrl: string | undefined;
  try {
    const parsed = new URL(normalized);
    siteUrl = `${parsed.protocol}//${parsed.host}`;
  } catch {
    siteUrl = undefined;
  }

  return {
    url: normalized,
    suggestedPreset,
    suggestedAxis,
    confidence,
    reason,
    signals: {
      domain: siteUrl ? new URL(normalized).hostname : undefined,
      themeColor,
      ogImage,
      title,
    },
    chromeHints: {
      siteUrl,
      logo: ogImage,
    },
  };
}

export function getPresetAxis(preset: ThemePresetId): ThemeAxisId {
  return PRESET_AXIS[preset];
}

export function listLaunchPresets(): ThemePresetId[] {
  return catalog.launchPresets as ThemePresetId[];
}

export { catalog };
