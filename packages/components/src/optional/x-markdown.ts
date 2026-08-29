import type { Element, Text } from "hast";

import { isXStatusUrl } from "./x-status-url";

/** Returns a status URL when a paragraph contains only that link (or bare URL). */
export function getParagraphXStatusUrl(node?: Element): string | null {
  if (!node || node.tagName !== "p") return null;

  const meaningful = node.children.filter((child) => {
    if (child.type === "text") return (child as Text).value.trim().length > 0;
    return true;
  });

  if (meaningful.length !== 1) return null;

  const child = meaningful[0];

  if (child.type === "element" && child.tagName === "a") {
    const href = String(child.properties?.href ?? "");
    return isXStatusUrl(href) ? href : null;
  }

  if (child.type === "text") {
    const text = (child as Text).value.trim();
    return isXStatusUrl(text) ? text : null;
  }

  return null;
}
