export function formatPostDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getPostExcerpt(description: string, maxLength = 140): string {
  const text = description.trim().replace(/\s+/g, " ");
  if (text.length <= maxLength) {
    return text;
  }

  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  const base = lastSpace > 60 ? truncated.slice(0, lastSpace) : truncated;
  return `${base.trim()}…`;
}

export function getReadingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function stripDuplicateH1(content: string, title: string): string {
  const lines = content.split("\n");
  if (!lines[0]?.startsWith("# ")) {
    return content;
  }

  const h1 = lines[0].slice(2).trim();
  const normalize = (value: string) => value.replace(/\?$/, "").trim();

  if (normalize(h1) === normalize(title)) {
    return lines.slice(1).join("\n").trimStart();
  }

  return content;
}

export function extractCoverImage(content: string): string | undefined {
  const markdownImage = content.match(/!\[[^\]]*]\(([^)]+)\)/);
  if (markdownImage?.[1]) {
    return markdownImage[1];
  }

  const htmlImage = content.match(/<img[^>]+src="([^"]+)"/i);
  return htmlImage?.[1] ?? undefined;
}

export function extractLeadParagraph(content: string): string | null {
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (
      !trimmed ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("!") ||
      trimmed.startsWith("<") ||
      trimmed.startsWith("*") ||
      trimmed.startsWith("-")
    ) {
      continue;
    }

    return trimmed;
  }

  return null;
}

export function extractToc(
  content: string,
): { id: string; title: string; level: number }[] {
  const items: { id: string; title: string; level: number }[] = [];

  for (const line of content.split("\n")) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) {
      continue;
    }

    const level = match[1].length;
    const title = match[2].replace(/\{#.+}$/, "").trim();
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    items.push({ id, title, level });
  }

  return items;
}

export function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Resolve post image to absolute URL for OG / JSON-LD */
export function resolvePostImageUrl(
  imageUrl: string | undefined,
  absoluteUrl: (path: string) => string,
): string | undefined {
  if (!imageUrl) {
    return undefined;
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  const path = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  return absoluteUrl(path);
}

/** Extract ## TL;DR section from markdown body */
export function extractTldrFromContent(content: string): string | null {
  const lines = content.split("\n");
  let inTldr = false;
  const parts: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (/^##\s+TL;DR\s*$/i.test(trimmed)) {
      inTldr = true;
      continue;
    }

    if (inTldr) {
      if (/^##\s+/.test(trimmed)) {
        break;
      }

      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const bullet = trimmed.replace(/^[-*]\s+/, "").trim();
      if (bullet) {
        parts.push(bullet);
      }
    }
  }

  if (!parts.length) {
    return null;
  }

  return parts.join(" ");
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
