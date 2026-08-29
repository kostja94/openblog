import fs from "fs";
import path from "path";
import type { ComponentType } from "react";
import { pathToFileURL } from "url";

import { resolveChromeBrand } from "@openblog/core";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { config } from "@/lib/openblog-config";

type ChromeSlot = ComponentType<Record<string, never>>;

const OVERRIDES_DIR = path.join(process.cwd(), "src", "chrome", "overrides");

async function loadOverride(
  filename: string,
  exportName: string,
): Promise<ChromeSlot | null> {
  const filePath = path.join(OVERRIDES_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const mod = await import(pathToFileURL(filePath).href);
  return (mod[exportName] ?? mod.default ?? null) as ChromeSlot | null;
}

export async function resolveBlogChrome(): Promise<{
  Header: ChromeSlot;
  Footer: ChromeSlot;
}> {
  const { mode } = resolveChromeBrand(config);

  if (mode !== "inherit-monorepo") {
    return { Header: SiteHeader, Footer: SiteFooter };
  }

  const Header = (await loadOverride("Header.tsx", "Header")) ?? SiteHeader;
  const Footer = (await loadOverride("Footer.tsx", "Footer")) ?? SiteFooter;

  return { Header, Footer };
}
