/** Matches twitter.com or x.com status URLs (with optional query string). */
export const X_STATUS_URL_RE =
  /^https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/([^/?#]+)\/status\/(\d+)(?:\?.*)?$/i;

export function isXStatusUrl(url: string): boolean {
  return X_STATUS_URL_RE.test(url.trim());
}

/** Normalize to twitter.com canonical form for the widgets.js blockquote. */
export function normalizeXStatusUrl(url: string): string {
  const trimmed = url.trim();
  const match = trimmed.match(X_STATUS_URL_RE);
  if (!match) return trimmed;
  const [, user, statusId] = match;
  return `https://twitter.com/${user}/status/${statusId}`;
}
