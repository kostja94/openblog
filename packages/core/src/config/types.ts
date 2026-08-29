export type DeployMode = "subdirectory" | "subdomain" | "standalone";

export type ContentAdapterName = "local-md";

export interface OpenBlogSiteConfig {
  name: string;
  tagline?: string;
  description: string;
  github?: string;
  locale: string;
  /** Override SITE_URL env when set */
  url?: string;
  /** Override DEPLOY_MODE env when set */
  deployMode?: DeployMode;
  /** Override BLOG_BASE_PATH env when set */
  blogBasePath?: string;
}

export interface OpenBlogContentConfig {
  adapter: ContentAdapterName;
  options: {
    /** Relative to template cwd, e.g. "content/blog" */
    dir: string;
  };
}
import type { OpenBlogThemeConfig, ThemePresetId } from "../theme/types";

export type OpenBlogThemeName = ThemePresetId | (string & {});

export type { OpenBlogThemeConfig, ThemePresetId, ThemeAxisId } from "../theme/types";

export type ChromeMode = "openblog-default" | "custom" | "inherit-monorepo";

export interface OpenBlogChromeNavLink {
  label: string;
  href: string;
  external?: boolean;
  match?: "blog" | "exact";
}

export interface OpenBlogChromeFooterColumn {
  title: string;
  links: OpenBlogChromeNavLink[];
}

export interface OpenBlogChromeConfig {
  /**
   * - openblog-default: demo nav/footer (fork and customize)
   * - custom: use nav/footer/logo from this config + site-chrome.ts
   * - inherit-monorepo: replace Header/Footer under src/chrome/overrides/
   */
  mode?: ChromeMode;
  /** Main product site origin — integration anchor + future CLI scrape target */
  siteUrl?: string;
  /** Logo click target (usually product home, not blog index) */
  homeUrl?: string;
  /** Path under public/ (e.g. /brand/logo.svg) or absolute CDN URL */
  logo?: string;
  logoAlt?: string;
  /** Header navigation — omit to use defaults in site-chrome.ts */
  nav?: OpenBlogChromeNavLink[];
  footer?: {
    columns?: OpenBlogChromeFooterColumn[];
    legal?: OpenBlogChromeNavLink[];
  };
}

export interface OpenBlogOptionalComponents {
  toc?: boolean;
  relatedPosts?: boolean;
  xEmbed?: boolean;
  /** TL;DR summary block (Blog-Chrome: tldr-block) */
  tldr?: boolean;
  /** @deprecated Use `tldr` */
  aiSummary?: boolean;
  /** Share bar with copy link + social intents */
  shareBar?: boolean;
  /** @deprecated Use `shareBar` */
  shareButtons?: boolean;
  /** Tag pills in article footer */
  tagsList?: boolean;
  /** Author box at article footer */
  authorBox?: boolean;
  /** Previous / next post navigation */
  prevNext?: boolean;
}

export interface ResolvedOptionalComponents {
  toc: boolean;
  relatedPosts: boolean;
  xEmbed: boolean;
  tldr: boolean;
  shareBar: boolean;
  tagsList: boolean;
  authorBox: boolean;
  prevNext: boolean;
}

/** Known required article slot ids (kebab-case, config-facing) */
export const DEFAULT_REQUIRED_COMPONENT_IDS = [
  "breadcrumbs",
  "post-title",
  "post-meta",
  "post-dek",
  "featured-image",
  "markdown",
] as const;

export type RequiredComponentId = (typeof DEFAULT_REQUIRED_COMPONENT_IDS)[number];

export interface ResolvedRequiredComponents {
  breadcrumbs: boolean;
  postTitle: boolean;
  postMeta: boolean;
  postDek: boolean;
  featuredImage: boolean;
  markdown: boolean;
}

const REQUIRED_ID_TO_KEY: Record<RequiredComponentId, keyof ResolvedRequiredComponents> =
  {
    breadcrumbs: "breadcrumbs",
    "post-title": "postTitle",
    "post-meta": "postMeta",
    "post-dek": "postDek",
    "featured-image": "featuredImage",
    markdown: "markdown",
  };

export function isRequiredComponentId(id: string): id is RequiredComponentId {
  return id in REQUIRED_ID_TO_KEY;
}

export interface OpenBlogComponentsConfig {
  /** Required component ids (defaults applied when omitted) */
  required?: string[];
  optional?: OpenBlogOptionalComponents;
}

export interface OpenBlogFeaturesConfig {
  /** Category archive routes + category badge/links in UI */
  categories?: boolean;
  /** Tag archive routes + tagsList default */
  tags?: boolean;
  /** Author archive routes + author in post-meta/authorBox */
  authors?: boolean;
  /** /blog/rss.xml feed */
  rss?: boolean;
}

export interface ResolvedFeatures {
  categories: boolean;
  tags: boolean;
  authors: boolean;
  rss: boolean;
}

export interface OpenBlogConfig {
  site: OpenBlogSiteConfig;
  content: OpenBlogContentConfig;
  /** Preset slug string or full theme config (see INTEGRATION.md / docs/theming.md) */
  theme: OpenBlogThemeConfig | ThemePresetId;
  chrome?: OpenBlogChromeConfig;
  components?: OpenBlogComponentsConfig;
  features?: OpenBlogFeaturesConfig;
}

export const DEFAULT_OPTIONAL_COMPONENTS: ResolvedOptionalComponents = {
  toc: false,
  relatedPosts: true,
  xEmbed: false,
  tldr: false,
  shareBar: true,
  tagsList: true,
  authorBox: false,
  prevNext: false,
};

export function defineConfig(config: OpenBlogConfig): OpenBlogConfig {
  return config;
}

export function resolveFeatures(config: OpenBlogConfig): ResolvedFeatures {
  const features = config.features ?? {};

  return {
    categories: features.categories ?? true,
    tags: features.tags ?? true,
    authors: features.authors ?? true,
    rss: features.rss ?? true,
  };
}

export function resolveOptionalComponents(
  config: OpenBlogConfig,
): ResolvedOptionalComponents {
  const opt = config.components?.optional ?? {};
  const features = resolveFeatures(config);

  return {
    toc: opt.toc ?? DEFAULT_OPTIONAL_COMPONENTS.toc,
    relatedPosts: opt.relatedPosts ?? DEFAULT_OPTIONAL_COMPONENTS.relatedPosts,
    xEmbed: opt.xEmbed ?? DEFAULT_OPTIONAL_COMPONENTS.xEmbed,
    tldr: opt.tldr ?? opt.aiSummary ?? DEFAULT_OPTIONAL_COMPONENTS.tldr,
    shareBar:
      opt.shareBar ?? opt.shareButtons ?? DEFAULT_OPTIONAL_COMPONENTS.shareBar,
    tagsList: features.tags
      ? (opt.tagsList ?? DEFAULT_OPTIONAL_COMPONENTS.tagsList)
      : false,
    authorBox: features.authors
      ? (opt.authorBox ?? DEFAULT_OPTIONAL_COMPONENTS.authorBox)
      : false,
    prevNext: opt.prevNext ?? DEFAULT_OPTIONAL_COMPONENTS.prevNext,
  };
}

export function resolveRequiredComponents(
  config: OpenBlogConfig,
): ResolvedRequiredComponents {
  const ids = config.components?.required ?? [...DEFAULT_REQUIRED_COMPONENT_IDS];
  const resolved: ResolvedRequiredComponents = {
    breadcrumbs: false,
    postTitle: false,
    postMeta: false,
    postDek: false,
    featuredImage: false,
    markdown: false,
  };

  for (const id of ids) {
    if (isRequiredComponentId(id)) {
      resolved[REQUIRED_ID_TO_KEY[id]] = true;
    }
  }

  return resolved;
}

/** Returns unknown required component ids from config (empty = valid). */
export function validateRequiredComponents(config: OpenBlogConfig): string[] {
  const ids = config.components?.required;
  if (!ids) {
    return [];
  }

  return ids.filter((id) => !isRequiredComponentId(id));
}

export interface ResolvedChromeBrand {
  mode: ChromeMode;
  siteUrl: string;
  homeUrl: string;
  logo?: string;
  logoAlt: string;
}

export function resolveChromeBrand(config: OpenBlogConfig): ResolvedChromeBrand {
  const chrome = config.chrome ?? {};
  const siteUrl = (
    chrome.siteUrl ??
    config.site.url ??
    process.env.SITE_URL ??
    "https://openblog.ai"
  ).replace(/\/$/, "");

  return {
    mode: chrome.mode ?? "openblog-default",
    siteUrl,
    homeUrl: (chrome.homeUrl ?? siteUrl).replace(/\/$/, ""),
    logo: chrome.logo,
    logoAlt: chrome.logoAlt ?? config.site.name,
  };
}
