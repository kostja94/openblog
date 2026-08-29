"use client";

import Link from "next/link";

import { authorToSlug } from "@openblog/core";

import { useOpenBlog, useSiteHelpers } from "../provider";
import { obBorder, obHoverText, obMuted, obSurface, obText } from "../tokens";

export function AuthorBox({ author }: { author: string }) {
  const { features } = useOpenBlog();
  const site = useSiteHelpers();

  if (!features.authors) {
    return null;
  }

  return (
    <section aria-label="Author" className={`mt-10 rounded-2xl border p-6 ${obBorder} ${obSurface}`}>
      <p className={`text-sm font-medium uppercase tracking-[0.15em] ${obMuted}`}>
        Written by
      </p>
      <p className={`mt-2 text-lg font-semibold ${obText}`}>
        <Link
          href={site.authorPath(authorToSlug(author))}
          className={obHoverText}
        >
          {author}
        </Link>
      </p>
    </section>
  );
}
