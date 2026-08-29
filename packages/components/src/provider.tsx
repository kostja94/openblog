"use client";

import { createContext, useContext, useMemo } from "react";

import type { OpenBlogConfig, ResolvedFeatures, SiteHelpers } from "@openblog/core";
import {
  createSiteHelpers,
  resolveFeatures,
  resolveOptionalComponents,
  resolveRequiredComponents,
  resolveSiteRuntime,
} from "@openblog/core";

export interface OpenBlogContextValue {
  config: OpenBlogConfig;
  site: SiteHelpers;
  features: ResolvedFeatures;
  optional: ReturnType<typeof resolveOptionalComponents>;
  required: ReturnType<typeof resolveRequiredComponents>;
}

const OpenBlogContext = createContext<OpenBlogContextValue | null>(null);

export function OpenBlogProvider({
  config,
  children,
}: {
  config: OpenBlogConfig;
  children: React.ReactNode;
}) {
  const value = useMemo<OpenBlogContextValue>(() => {
    const site = createSiteHelpers(resolveSiteRuntime(config));
    return {
      config,
      site,
      features: resolveFeatures(config),
      optional: resolveOptionalComponents(config),
      required: resolveRequiredComponents(config),
    };
  }, [config]);

  return (
    <OpenBlogContext.Provider value={value}>{children}</OpenBlogContext.Provider>
  );
}

export function useOpenBlog(): OpenBlogContextValue {
  const context = useContext(OpenBlogContext);
  if (!context) {
    throw new Error("useOpenBlog must be used within OpenBlogProvider");
  }
  return context;
}

export function useSiteHelpers(): SiteHelpers {
  return useOpenBlog().site;
}
