"use client";

import { useCallback, useState } from "react";

import { obBorder, obBorderT, obHoverBorder, obMuted, obText } from "../tokens";

export function ShareBar({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [url]);

  const actionClass = `rounded-full border px-3 py-1.5 text-sm ${obBorder} ${obText} ${obHoverBorder}`;

  return (
    <section aria-label="Share" className={`mt-10 pt-8 ${obBorderT}`}>
      <h2 className={`text-sm font-medium uppercase tracking-[0.15em] ${obMuted}`}>
        Share
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={copyLink} className={actionClass}>
          {copied ? "Copied!" : "Copy link"}
        </button>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          className={actionClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          Share on X
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          className={actionClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </div>
    </section>
  );
}

/** @deprecated Use ShareBar */
export function ShareButtons(props: { url: string; title: string }) {
  return <ShareBar {...props} />;
}
