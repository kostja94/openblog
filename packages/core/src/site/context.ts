import type { OpenBlogConfig, ResolvedFeatures } from "../config/types";
import { resolveFeatures } from "../config/types";

export type DeployMode = "subdirectory" | "subdomain" | "standalone";

export interface SiteRuntime {
  site: OpenBlogConfig["site"];
  deployMode: DeployMode;
  siteUrl: string;
  blogBasePath: string;
  features: ResolvedFeatures;
}

function parseDeployMode(value: string | undefined): DeployMode {
  if (value === "subdirectory" || value === "subdomain" || value === "standalone") {
    return value;
  }
  return "standalone";
}

export function resolveSiteRuntime(config: OpenBlogConfig): SiteRuntime {
  const deployMode = parseDeployMode(
    config.site.deployMode ?? process.env.DEPLOY_MODE ?? "standalone",
  );

  const siteUrl = (config.site.url ?? process.env.SITE_URL ?? "https://openblog.ai").replace(
    /\/$/,
    "",
  );

  let blogBasePath: string;
  if (deployMode === "subdomain") {
    blogBasePath = "";
  } else {
    const configured = config.site.blogBasePath ?? process.env.BLOG_BASE_PATH ?? "/blog";
    if (!configured || configured === "/") {
      blogBasePath = "";
    } else {
      blogBasePath = configured.startsWith("/")
        ? configured.replace(/\/$/, "")
        : `/${configured.replace(/\/$/, "")}`;
    }
  }

  return {
    site: config.site,
    deployMode,
    siteUrl,
    blogBasePath,
    features: resolveFeatures(config),
  };
}

export interface SiteHelpers {
  runtime: SiteRuntime;
  blogPath: (...segments: string[]) => string;
  postPath: (slug: string) => string;
  categoryPath: (slug: string) => string;
  tagPath: (slug: string) => string;
  authorPath: (slug: string) => string;
  absoluteUrl: (path: string) => string;
  blogIndexUrl: () => string;
  isSubdomainMode: () => boolean;
  isStandaloneMode: () => boolean;
  isSubdirectoryMode: () => boolean;
}

function joinUrlPath(...segments: string[]): string {
  const parts = segments
    .flatMap((segment) => segment.split("/"))
    .filter(Boolean);
  return parts.length ? `/${parts.join("/")}` : "/";
}

export function createSiteHelpers(runtime: SiteRuntime): SiteHelpers {
  const blogPath = (...segments: string[]): string => {
    const base = runtime.blogBasePath;
    if (!segments.length) {
      return base || "/";
    }
    return joinUrlPath(base, ...segments);
  };

  const postPath = (slug: string): string => blogPath(slug);

  const categoryPath = (slug: string): string => blogPath("category", slug);

  const tagPath = (slug: string): string => blogPath("tag", slug);

  const authorPath = (slug: string): string => blogPath("author", slug);

  const absoluteUrl = (path: string): string => {
    const origin = runtime.siteUrl;
    if (path === "/" || path === "") {
      return origin;
    }
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${origin}${normalized.replace(/\/+$/, "")}`;
  };

  const blogIndexUrl = (): string => absoluteUrl(blogPath());

  return {
    runtime,
    blogPath,
    postPath,
    categoryPath,
    tagPath,
    authorPath,
    absoluteUrl,
    blogIndexUrl,
    isSubdomainMode: () => runtime.deployMode === "subdomain",
    isStandaloneMode: () => runtime.deployMode === "standalone",
    isSubdirectoryMode: () => runtime.deployMode === "subdirectory",
  };
}
